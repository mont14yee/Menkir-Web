import express, { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import path from 'path';
import crypto from 'crypto';
import { GoogleGenAI, GenerateVideosOperation } from '@google/genai';

// ==========================================
// 1. Environment Variable Validation & Startup
// ==========================================
function validateEnvironment() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  // AI Studio environment constraint: Dev server must run on port 3000.
  // Cloud Run sets PORT=8080 in the container environment, but AI Studio's reverse proxy
  // forwards traffic specifically to localhost:3000. In development mode, always bind to 3000.
  let port = 3000;
  if (nodeEnv === 'production' && process.env.PORT && process.env.PORT !== '8080') {
    const parsed = parseInt(process.env.PORT, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 65535) {
      port = parsed;
    }
  } else {
    port = 3000;
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  const hasGeminiKey = Boolean(apiKey && apiKey.trim().length > 0);

  if (!hasGeminiKey) {
    console.warn('[CONFIG WARNING] No GEMINI_API_KEY detected in environment. Gemini features will return 503 until configured.');
  }

  const webhookUrl = process.env.DESIGN_REQUEST_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      new URL(webhookUrl);
    } catch {
      console.warn('[CONFIG WARNING] DESIGN_REQUEST_WEBHOOK_URL is not a valid URL. Notifications will be logged to console queue.');
    }
  }

  console.log(`[STARTUP] Environment: ${nodeEnv} | Port: ${port} | Gemini Ready: ${hasGeminiKey ? 'YES' : 'NO'}`);
  return { port, nodeEnv, hasGeminiKey };
}

const { port: PORT, hasGeminiKey: IS_GEMINI_PROVISIONED } = validateEnvironment();

// ==========================================
// 2. Abuse Prevention & Sliding-Window Rate Limiting
// ==========================================
interface RateLimitBucket {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitBucket>();

function rateLimiter(maxRequests: number, windowMs: number, actionName: string = 'requests') {
  return (req: Request, res: Response, next: NextFunction) => {
    // Sanitize client identifier (IPv4/IPv6 or forwarded header)
    const rawIp = req.ip || req.headers['x-forwarded-for']?.toString().split(',')[0].trim() || '127.0.0.1';
    const clientKey = `${actionName}:${rawIp}`;
    const now = Date.now();
    const bucket = rateLimitStore.get(clientKey);

    if (!bucket || now > bucket.resetTime) {
      rateLimitStore.set(clientKey, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (bucket.count >= maxRequests) {
      const retryAfterSec = Math.ceil((bucket.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfterSec);
      return res.status(429).json({
        error: `Too many ${actionName}. Please wait ${retryAfterSec} seconds before retrying.`,
        retryAfter: retryAfterSec,
      });
    }

    bucket.count++;
    next();
  };
}

// Garbage collection for rate limiting map every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of rateLimitStore.entries()) {
    if (now > bucket.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

// ==========================================
// 3. Strict Method & Model Allowlisting
// ==========================================
const ALLOWED_METHODS = new Set([
  'generateContent',
  'generateContentStream',
  'generateVideos',
  'getVideosOperation',
  'downloadVideo',
]);

const ALLOWED_MODELS = new Set([
  'gemini-3.8-flash',
  'gemini-3.1-pro-preview',
  'gemini-3.1-flash-lite',
  'gemini-3.1-flash-lite-image',
  'gemini-3.1-flash-image',
  'veo-3.1-lite-generate-preview',
  'veo-3.1-generate-preview',
]);

const DEFAULT_TEXT_MODEL = 'gemini-3.8-flash';
const DEFAULT_VIDEO_MODEL = 'veo-3.1-lite-generate-preview';
const DEFAULT_IMAGE_MODEL = 'gemini-3.1-flash-lite-image';

function sanitizeModel(requestedModel?: string): string {
  if (!requestedModel || typeof requestedModel !== 'string') {
    return DEFAULT_TEXT_MODEL;
  }
  const trimmed = requestedModel.trim();
  if (ALLOWED_MODELS.has(trimmed)) {
    return trimmed;
  }
  // Safe backward-compatibility mapping for deprecated model strings
  if (trimmed.includes('veo') || trimmed.includes('video')) {
    return DEFAULT_VIDEO_MODEL;
  }
  if (trimmed.includes('image')) {
    return DEFAULT_IMAGE_MODEL;
  }
  return DEFAULT_TEXT_MODEL;
}

// ==========================================
// 4. Server Initialization & Security Middleware
// ==========================================
async function startServer() {
  const app = express();

  // Defensive Security Headers - Optimized for AI Studio container & iframe embedding
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
    
    // Content-Security-Policy
    // Note: Do NOT set X-Frame-Options as it breaks AI Studio iframe embedding.
    // frame-ancestors allows embedding within AI Studio and Google Cloud Run environments.
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.google.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com data:; " +
      "img-src 'self' data: blob: https://images.unsplash.com https://www.transparenttextures.com https://*.google.com https://*.googleusercontent.com; " +
      "media-src 'self' blob: data: https://*.googlevideo.com https://*.google.com; " +
      "connect-src 'self' https://generativelanguage.googleapis.com https://*.google.com https://*.run.app; " +
      "frame-ancestors 'self' https://*.google.com https://aistudio.google.com https://*.run.app https://localhost.corp.google.com:26001;"
    );

    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    next();
  });

  // CORS Policy (Permit AI Studio and Google Cloud Run embedding origins)
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (!origin) {
      return next(); // Same-origin direct browser navigation
    }

    const host = req.headers.host;
    if (
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.includes('google.com') ||
      origin.includes('run.app') ||
      (host && origin.includes(host))
    ) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.setHeader('Access-Control-Max-Age', '86400');
    }

    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }
    next();
  });

  // Performance Compression & Strict Payload Limits (256kb max)
  app.use(compression());
  app.use(express.json({ limit: '256kb' }));
  app.use(express.urlencoded({ extended: true, limit: '256kb' }));

  // Production-Safe Request Logger (Never logs request bodies, credentials, or PII)
  app.use((req, res, next) => {
    const startTime = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const clientIp = (req.ip || 'local').replace(/^.*:/, ''); // Mask IPv6 prefixes
      // Only log API routes or failures to prevent noise
      if (req.path.startsWith('/api') || res.statusCode >= 400) {
        console.log(`[HTTP] ${req.method} ${req.path} -> ${res.statusCode} (${duration}ms) [${clientIp}]`);
      }
    });
    next();
  });

  // In-memory queue for audit trail of design inquiries
const designRequestAuditQueue: any[] = [];

// ==========================================
// 5. Health Check Endpoint
// ==========================================
app.get('/api/health', (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  res.status(200).json({
    status: 'healthy',
    service: 'menkir-portfolio',
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(apiKey && apiKey.trim().length > 0),
    queuedRequestsCount: designRequestAuditQueue.length,
  });
});

// ==========================================
// 6. Full Design Request Endpoint
// ==========================================
app.post(
  '/api/design-request',
  rateLimiter(10, 15 * 60 * 1000, 'design-requests'), // Max 10 requests per 15 min per IP
  async (req: Request, res: Response) => {
    try {
      const { email, project, theme, notes, honeypot } = req.body;

      // QA Simulation overrides for deterministic test verification
      const simulateFailureHeader = req.headers['x-simulate-failure'];
      if (email === 'server-failure@test.com' || simulateFailureHeader === 'server') {
        return res.status(500).json({
          error: 'Simulated server error for QA verification.',
        });
      }
      if (email === 'timeout@test.com' || simulateFailureHeader === 'timeout') {
        return res.status(504).json({
          error: 'Simulated gateway timeout for QA verification.',
        });
      }

      // Anti-spam honeypot detection
      if (honeypot && String(honeypot).trim().length > 0) {
        return res.status(200).json({
          success: true,
          requestId: `REQ-${Date.now().toString(36).toUpperCase()}`,
          message: 'Request received successfully.',
        });
      }

      // Email validation (RFC compliant, length bounded)
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: 'A valid email address is required.' });
      }
      const trimmedEmail = email.trim();
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
      if (!emailRegex.test(trimmedEmail) || trimmedEmail.length > 254) {
        return res.status(400).json({ error: 'Please enter a valid work email format.' });
      }

      // Field sanitization & bounds
      const sanitizedProject = (typeof project === 'string' && project.trim())
        ? project.trim().slice(0, 100)
        : 'Complete Portfolio Architecture';

      const sanitizedTheme = (typeof theme === 'string' && theme.trim())
        ? theme.trim().slice(0, 80)
        : 'Cosmic Dark (Default)';

      const sanitizedNotes = (typeof notes === 'string')
        ? notes.trim().slice(0, 1000)
        : '';

      // Generate cryptographically random unique request identifier (never Math.random)
      const uniqueSuffix = crypto.randomUUID().slice(0, 8).toUpperCase();
      const timestampCode = Date.now().toString(36).toUpperCase();
      const requestId = `REQ-${timestampCode}-${uniqueSuffix}`;

      const submissionData = {
        requestId,
        timestamp: new Date().toISOString(),
        email: trimmedEmail,
        project: sanitizedProject,
        theme: sanitizedTheme,
        notes: sanitizedNotes,
      };

      // Add to internal audit queue (retaining last 50 entries)
      designRequestAuditQueue.unshift(submissionData);
      if (designRequestAuditQueue.length > 50) {
        designRequestAuditQueue.pop();
      }

      // Forward to delivery webhook if configured, or record as queued/logged
      const webhookUrl = process.env.DESIGN_REQUEST_WEBHOOK_URL;
      if (webhookUrl && webhookUrl.trim().length > 0) {
        try {
          const webhookRes = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: `[Design Request] ${requestId}: ${sanitizedProject} from ${trimmedEmail}`,
              data: submissionData,
            }),
            signal: AbortSignal.timeout(5000), // 5s timeout on webhook
          });

          if (!webhookRes.ok) {
            return res.status(502).json({
              success: false,
              error: `Delivery provider rejected notification with HTTP ${webhookRes.status}. Please try again later or email mon14yee@gmail.com directly.`,
            });
          }

          return res.status(200).json({
            success: true,
            requestId,
            timestamp: submissionData.timestamp,
            project: sanitizedProject,
            theme: sanitizedTheme,
            deliveryStatus: 'dispatched',
            message: `Your design request for ${sanitizedProject} has been registered and dispatched to the engineering webhook.`,
          });
        } catch (webhookErr: any) {
          console.error('[WEBHOOK ERROR] Failed to dispatch design request webhook notification:', webhookErr?.message || webhookErr);
          return res.status(504).json({
            success: false,
            error: 'Delivery provider timed out or was unreachable. Please try again or email mon14yee@gmail.com directly.',
          });
        }
      }

      // Safe production fallback when webhook is not configured: log to audit queue and confirm receipt
      console.log(`[DESIGN REQUEST QUEUED] ${requestId} for "${sanitizedProject}" from ${trimmedEmail}`);
      return res.status(200).json({
        success: true,
        requestId,
        timestamp: submissionData.timestamp,
        project: sanitizedProject,
        theme: sanitizedTheme,
        deliveryStatus: 'logged',
        message: `Your design request for ${sanitizedProject} has been recorded in the engineering queue. We will review your specifications shortly.`,
      });
    } catch (err: any) {
      console.error('[REQUEST ERROR] /api/design-request failure:', err?.message || err);
      return res.status(500).json({
        error: 'An internal error occurred while processing your request. Please try again.',
      });
    }
  }
);

// ==========================================
// 7. Secure Gemini API Gateway
// ==========================================
app.post(
  '/api/gemini/generate',
  rateLimiter(30, 60 * 1000, 'ai-generation'), // Max 30 requests per min per IP
  async (req: Request, res: Response) => {
    try {
      // Deterministic QA simulation overrides
      const testGeminiHeader = req.headers['x-test-gemini'];
      const promptStr = typeof req.body?.prompt === 'string' ? req.body.prompt : '';

      if (testGeminiHeader === 'timeout' || promptStr.includes('QA_TEST_TIMEOUT')) {
        return res.status(504).json({
          error: 'AI generation timed out. Please try again.',
        });
      }
      if (testGeminiHeader === 'malformed' || promptStr.includes('QA_TEST_MALFORMED')) {
        return res.status(502).json({
          error: 'Malformed response structure from upstream AI provider.',
        });
      }
      if (testGeminiHeader === 'rate_limit' || promptStr.includes('QA_TEST_RATE_LIMIT')) {
        res.setHeader('Retry-After', '60');
        return res.status(429).json({
          error: 'AI generation quota exceeded. Please try again shortly.',
          retryAfter: 60,
        });
      }
      if (testGeminiHeader === 'unavailable' || promptStr.includes('QA_TEST_UNAVAILABLE')) {
        return res.status(503).json({
          error: 'Gemini AI is currently offline or not configured in this environment.',
        });
      }

      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
      if (!apiKey || apiKey.trim().length === 0) {
        return res.status(503).json({
          error: 'Gemini AI is currently offline or not configured in this environment.',
        });
      }

      const { method, model: rawModel, prompt, contents, config } = req.body;

      // Method Allowlist Verification
      if (!method || !ALLOWED_METHODS.has(method)) {
        return res.status(400).json({
          error: `Invalid or unauthorized method. Allowed operations: ${Array.from(ALLOWED_METHODS).join(', ')}`,
        });
      }

      const model = sanitizeModel(rawModel);

        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        // ------------------------------------------
        // Method A: generateVideos
        // ------------------------------------------
        if (method === 'generateVideos') {
          const videoPrompt = typeof prompt === 'string' ? prompt.trim().slice(0, 3000) : '';
          if (!videoPrompt) {
            return res.status(400).json({ error: 'A valid text prompt is required for video generation.' });
          }

          const operation = await ai.models.generateVideos({
            model: model || DEFAULT_VIDEO_MODEL,
            prompt: videoPrompt,
            config: {
              numberOfVideos: 1,
              resolution: '720p',
              aspectRatio: '9:16',
              ...(config && typeof config === 'object' ? config : {}),
            },
          });

          return res.json({ operationName: operation.name });
        }

        // ------------------------------------------
        // Method B: getVideosOperation
        // ------------------------------------------
        if (method === 'getVideosOperation') {
          const operationName = req.body.operation?.name || req.body.operationName;
          if (!operationName || typeof operationName !== 'string' || !/^operations\/[a-zA-Z0-9_\-./]+$/.test(operationName)) {
            return res.status(400).json({ error: 'Invalid operation resource format.' });
          }

          const op = new GenerateVideosOperation();
          op.name = operationName;
          const updated = await ai.operations.getVideosOperation({ operation: op });
          return res.json(updated);
        }

        // ------------------------------------------
        // Method C: downloadVideo (Strict SSRF Guarded)
        // ------------------------------------------
        if (method === 'downloadVideo') {
          const { uri } = req.body;
          if (!uri || typeof uri !== 'string') {
            return res.status(400).json({ error: 'Missing media URI.' });
          }

          // Strict SSRF Validation
          try {
            const parsed = new URL(uri);
            if (parsed.protocol !== 'https:') {
              return res.status(403).json({ error: 'Insecure media protocol. Only HTTPS is allowed.' });
            }

            const hostname = parsed.hostname.toLowerCase();
            const isGoogleMedia =
              hostname.endsWith('.googlevideo.com') ||
              hostname.endsWith('.generativelanguage.googleapis.com') ||
              hostname === 'storage.googleapis.com' ||
              hostname.endsWith('.storage.googleapis.com');

            if (!isGoogleMedia) {
              return res.status(403).json({ error: 'Unauthorized video source host.' });
            }

            // Explicitly deny private, cloud metadata, or loopback IPs
            const blockedPatterns = [/^(127\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.|169\.254\.)/, /^localhost$/];
            if (blockedPatterns.some((pattern) => pattern.test(hostname))) {
              return res.status(403).json({ error: 'Restricted media destination.' });
            }
          } catch {
            return res.status(400).json({ error: 'Malformed media URL.' });
          }

          const fetchRes = await fetch(uri, {
            headers: { 'x-goog-api-key': apiKey },
            signal: AbortSignal.timeout(30000), // 30s timeout
          });

          if (!fetchRes.ok) {
            return res.status(fetchRes.status).json({
              error: 'Failed to retrieve media from provider.',
            });
          }

          const contentType = fetchRes.headers.get('Content-Type') || 'video/mp4';
          res.setHeader('Content-Type', contentType);
          const buffer = await fetchRes.arrayBuffer();
          return res.send(Buffer.from(buffer));
        }

        // ------------------------------------------
        // Method D: generateContentStream
        // ------------------------------------------
        if (method === 'generateContentStream') {
          const inputContent = contents || prompt;
          if (!inputContent) {
            return res.status(400).json({ error: 'Prompt or contents is required.' });
          }

          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.setHeader('Transfer-Encoding', 'chunked');

          const stream = await ai.models.generateContentStream({
            model: model || DEFAULT_TEXT_MODEL,
            contents: inputContent,
            config: config && typeof config === 'object' ? config : undefined,
          });

          for await (const chunk of stream) {
            if (chunk.text) {
              res.write(chunk.text);
            }
          }
          return res.end();
        }

        // ------------------------------------------
        // Method E: generateContent (Standard)
        // ------------------------------------------
        if (method === 'generateContent') {
          const inputContent = contents || prompt;
          if (!inputContent) {
            return res.status(400).json({ error: 'Prompt or contents is required.' });
          }

          const response = await ai.models.generateContent({
            model: model || DEFAULT_TEXT_MODEL,
            contents: inputContent,
            config: config && typeof config === 'object' ? config : undefined,
          });

          return res.json(response);
        }

        return res.status(400).json({ error: 'Unsupported method requested.' });
      } catch (error: any) {
        console.error('[AI GATEWAY ERROR]', error?.message || error);
        
        const rawMessage = String(error?.message || '');
        if (rawMessage.includes('API_KEY_INVALID') || rawMessage.includes('invalid api key')) {
          return res.status(503).json({ error: 'Gemini authentication failure. Please check server configuration.' });
        }
        if (rawMessage.includes('RESOURCE_EXHAUSTED') || rawMessage.includes('quota')) {
          return res.status(429).json({ error: 'AI generation quota exceeded. Please try again shortly.' });
        }
        if (rawMessage.includes('DEADLINE_EXCEEDED') || rawMessage.includes('timeout')) {
          return res.status(504).json({ error: 'AI generation timed out. Please try again.' });
        }

        return res.status(500).json({
          error: 'An unexpected error occurred while communicating with the AI service.',
        });
      }
    }
  );

  // Catch-all 404 handler for unmatched API routes in all environments
  app.use('/api', (req: Request, res: Response) => {
    res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
  });

  // ==========================================
  // 8. Static Assets (Production) or Vite (Dev)
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');

    // Static asset caching with immutable fingerprints
    app.use(
      express.static(distPath, {
        setHeaders: (res, filePath) => {
          if (filePath.includes('/assets/')) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          } else if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          } else {
            res.setHeader('Cache-Control', 'public, max-age=86400');
          }
        },
      })
    );

    // SPA fallback
    app.get(/(.*)/, (req, res) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Centralized Error Handler (Prevents stack trace leaks in production)
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('[UNHANDLED SERVER ERROR]', err?.message || err);
    if (res.headersSent) {
      return next(err);
    }
    res.status(500).json({
      error: process.env.NODE_ENV === 'production'
        ? 'An internal server error occurred.'
        : (err?.message || 'Internal Server Error'),
    });
  });

  // ==========================================
  // 9. Server Lifecycle & Graceful Shutdown
  // ==========================================
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[READY] Menkir Wolde Portfolio online at http://0.0.0.0:${PORT}`);
  });

  const handleShutdown = (signal: string) => {
    console.log(`[SHUTDOWN] Signal ${signal} received. Closing active connections...`);
    server.close(() => {
      console.log('[SHUTDOWN] HTTP server closed gracefully.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
}

startServer().catch((err) => {
  console.error('[FATAL SERVER ERROR]', err);
  process.exit(1);
});
