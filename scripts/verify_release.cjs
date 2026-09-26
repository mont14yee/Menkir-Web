const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const TEST_PORT = 3042;
const BASE_URL = `http://127.0.0.1:${TEST_PORT}`;

let serverProcess = null;
let allPassed = true;
const results = [];

function record(name, passed, details = '') {
  if (!passed) allPassed = false;
  results.push({ name, passed, details });
  const mark = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${mark}: ${name}${details ? ` -> ${details}` : ''}`);
}

function makeRequest(pathname, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(pathname, BASE_URL);
    const reqOptions = {
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: 5000,
    };

    const req = http.request(url, reqOptions, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const rawBuffer = Buffer.concat(chunks);
        let body = '';
        if (res.headers['content-encoding'] === 'gzip') {
          try {
            body = zlib.gunzipSync(rawBuffer).toString('utf8');
          } catch (e) {
            body = rawBuffer.toString('utf8');
          }
        } else {
          body = rawBuffer.toString('utf8');
        }

        let json = null;
        try {
          json = JSON.parse(body);
        } catch {}

        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body,
          json,
          rawBuffer,
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });

    if (options.body) {
      if (typeof options.body === 'object') {
        req.write(JSON.stringify(options.body));
      } else {
        req.write(options.body);
      }
    }
    req.end();
  });
}

async function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function run() {
  console.log('====================================================');
  console.log('🚀 MENKIR PORTFOLIO - RELEASE ENGINEERING TEST SUITE');
  console.log('====================================================\n');

  // 1. Dockerfile & .dockerignore Static Check
  try {
    const dockerfile = fs.readFileSync(path.join(process.cwd(), 'Dockerfile'), 'utf8');
    const hasMultiStage = dockerfile.includes('FROM node:20-alpine AS build') && dockerfile.includes('FROM node:20-alpine');
    const hasDistCopy = dockerfile.includes('COPY --from=build /app/dist ./dist');
    const hasStartCmd = dockerfile.includes('CMD ["node", "dist/server.cjs"]');
    record('Docker Multi-stage Build & Node 20 LTS Spec', hasMultiStage && hasDistCopy && hasStartCmd, 'Multi-stage node:20-alpine configured');

    const dockerignore = fs.readFileSync(path.join(process.cwd(), '.dockerignore'), 'utf8');
    const hasNodeModulesIgnore = dockerignore.includes('node_modules');
    const hasDistIgnore = dockerignore.includes('dist');
    const hasEnvIgnore = dockerignore.includes('.env');
    record('.dockerignore Optimization', hasNodeModulesIgnore && hasDistIgnore && hasEnvIgnore, 'node_modules, dist, .env safely excluded');
  } catch (err) {
    record('Dockerfile verification', false, err.message);
  }

  // 2. Start Production Server
  console.log(`\nStarting production server (NODE_ENV=production PORT=${TEST_PORT} node dist/server.cjs)...`);
  serverProcess = spawn('node', ['dist/server.cjs'], {
    env: {
      ...process.env,
      NODE_ENV: 'production',
      PORT: String(TEST_PORT),
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  serverProcess.stdout.on('data', (d) => {
    // console.log('[SERVER STDOUT]', d.toString().trim());
  });
  serverProcess.stderr.on('data', (d) => {
    console.error('[SERVER STDERR]', d.toString().trim());
  });

  let serverReady = false;
  for (let i = 0; i < 20; i++) {
    try {
      const res = await makeRequest('/api/health');
      if (res.statusCode === 200 && res.json && res.json.status === 'healthy') {
        serverReady = true;
        break;
      }
    } catch {
      await sleep(250);
    }
  }

  record('Production Server Startup on Port 3042', serverReady, serverReady ? 'Server online and accepting connections' : 'Server failed to start');
  if (!serverReady) {
    console.error('Cannot proceed with remaining tests because server is unreachable.');
    if (serverProcess) serverProcess.kill('SIGTERM');
    process.exit(1);
  }

  // 3. Health Endpoint Verification
  try {
    const health = await makeRequest('/api/health');
    const valid = health.statusCode === 200 && health.json?.status === 'healthy' && health.json?.environment === 'production';
    record('Health Endpoint (/api/health)', valid, `Status: ${health.json?.status}, Env: ${health.json?.environment}`);
  } catch (e) {
    record('Health Endpoint (/api/health)', false, e.message);
  }

  // 4. Security Headers Verification
  try {
    const rootRes = await makeRequest('/');
    const headers = rootRes.headers;
    const hasNosniff = headers['x-content-type-options'] === 'nosniff';
    const hasFrameOptions = headers['x-frame-options'] === 'SAMEORIGIN';
    const hasHsts = headers['strict-transport-security']?.includes('max-age=31536000');
    const hasCsp = headers['content-security-policy']?.includes("default-src 'self'");
    const hasReferrer = headers['referrer-policy'] === 'strict-origin-when-cross-origin';

    record('Security Headers: X-Content-Type-Options: nosniff', hasNosniff);
    record('Security Headers: X-Frame-Options: SAMEORIGIN', hasFrameOptions);
    record('Security Headers: Strict-Transport-Security in Production', hasHsts, headers['strict-transport-security']);
    record('Security Headers: Content-Security-Policy', hasCsp);
    record('Security Headers: Referrer-Policy', hasReferrer);
  } catch (e) {
    record('Security Headers Verification', false, e.message);
  }

  // 5. Caching Headers Verification
  try {
    // Root HTML must NOT be cached
    const rootRes = await makeRequest('/');
    const rootCache = rootRes.headers['cache-control'];
    const htmlNoCache = rootCache?.includes('no-cache') && rootCache?.includes('no-store');
    record('Root HTML Cache-Control (no-cache, no-store)', htmlNoCache, rootCache);

    // SPA Route HTML must NOT be cached
    const spaRes = await makeRequest('/interface');
    const spaCache = spaRes.headers['cache-control'];
    const spaHtmlNoCache = spaCache?.includes('no-cache') && spaCache?.includes('no-store');
    record('SPA Route Cache-Control (no-cache, no-store)', spaHtmlNoCache, spaCache);

    // Static Fingerprinted Assets must be cached immutable
    const distFiles = fs.readdirSync(path.join(process.cwd(), 'dist', 'assets'));
    const cssFile = distFiles.find((f) => f.endsWith('.css'));
    const jsFile = distFiles.find((f) => f.endsWith('.js'));

    if (cssFile) {
      const assetRes = await makeRequest(`/assets/${cssFile}`);
      const assetCache = assetRes.headers['cache-control'];
      const isImmutable = assetCache?.includes('immutable') && assetCache?.includes('31536000');
      record('Asset Fingerprint Cache-Control (immutable, 1 year)', isImmutable, assetCache);
    }
  } catch (e) {
    record('Caching Headers Verification', false, e.message);
  }

  // 6. Gzip Compression Verification
  try {
    const compRes = await makeRequest('/', {
      headers: { 'Accept-Encoding': 'gzip' },
    });
    const isCompressed = compRes.headers['content-encoding'] === 'gzip';
    record('Gzip Compression (Accept-Encoding: gzip)', isCompressed, `Content-Encoding: ${compRes.headers['content-encoding']}`);
  } catch (e) {
    record('Gzip Compression Verification', false, e.message);
  }

  // 7. SPA Routing Verification (All routes return 200 with HTML shell)
  const routesToTest = ['/', '/interface', '/design', '/photos', '/resume', '/main', '/random-unknown-spa-path'];
  for (const route of routesToTest) {
    try {
      const res = await makeRequest(route);
      const isHtml = res.headers['content-type']?.includes('text/html');
      const hasRootDiv = res.body.includes('<div id="root">');
      record(`SPA Routing: ${route}`, res.statusCode === 200 && isHtml && hasRootDiv, `HTTP ${res.statusCode}, HTML shell present`);
    } catch (e) {
      record(`SPA Routing: ${route}`, false, e.message);
    }
  }

  // 8. Static Assets Verification
  const staticFiles = [
    '/favicon.svg',
    '/profile.webp',
    '/robots.txt',
    '/sitemap.xml',
  ];
  for (const file of staticFiles) {
    try {
      const res = await makeRequest(file);
      record(`Static Asset: ${file}`, res.statusCode === 200, `HTTP ${res.statusCode}, ${res.rawBuffer.length} bytes`);
    } catch (e) {
      record(`Static Asset: ${file}`, false, e.message);
    }
  }

  // 9. API 404 Handler Verification
  try {
    const res = await makeRequest('/api/unknown-route');
    const is404 = res.statusCode === 404 && res.json?.error;
    record('API 404 Handler for Unmatched Route', is404, `HTTP ${res.statusCode}: ${JSON.stringify(res.json)}`);
  } catch (e) {
    record('API 404 Handler', false, e.message);
  }

  // 10. Design Request API Endpoint Verification
  // 10a. Valid submission
  try {
    const res = await makeRequest('/api/design-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        email: 'qa.engineer@example.com',
        project: 'GERD Mega Dam Civil Portal',
        theme: 'Hydraulic Blue',
        notes: 'Release engineering automated verification',
      },
    });
    const valid = res.statusCode === 200 && res.json?.success === true && res.json?.requestId && res.json?.deliveryStatus;
    record('API: POST /api/design-request (Valid Submission)', valid, `Status: ${res.statusCode}, ID: ${res.json?.requestId}, Delivery: ${res.json?.deliveryStatus}`);
  } catch (e) {
    record('API: POST /api/design-request (Valid Submission)', false, e.message);
  }

  // 10b. Invalid email
  try {
    const res = await makeRequest('/api/design-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { email: 'not-an-email', project: 'Test' },
    });
    record('API: POST /api/design-request (Invalid Email -> 400)', res.statusCode === 400, `HTTP ${res.statusCode}: ${res.json?.error}`);
  } catch (e) {
    record('API: POST /api/design-request (Invalid Email)', false, e.message);
  }

  // 10c. Empty fields
  try {
    const res = await makeRequest('/api/design-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {},
    });
    record('API: POST /api/design-request (Empty Fields -> 400)', res.statusCode === 400, `HTTP ${res.statusCode}: ${res.json?.error}`);
  } catch (e) {
    record('API: POST /api/design-request (Empty Fields)', false, e.message);
  }

  // 10d. Honeypot anti-spam
  try {
    const res = await makeRequest('/api/design-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { email: 'bot@spam.com', honeypot: 'bot-fill-value' },
    });
    record('API: POST /api/design-request (Honeypot Silent Trap)', res.statusCode === 200 && res.json?.success === true, `HTTP ${res.statusCode}`);
  } catch (e) {
    record('API: POST /api/design-request (Honeypot)', false, e.message);
  }

  // 10e. Server failure simulation
  try {
    const res = await makeRequest('/api/design-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-simulate-failure': 'server' },
      body: { email: 'test@example.com' },
    });
    record('API: POST /api/design-request (Simulated 500 Failure)', res.statusCode === 500, `HTTP ${res.statusCode}`);
  } catch (e) {
    record('API: POST /api/design-request (Simulated 500)', false, e.message);
  }

  // 10f. Timeout simulation
  try {
    const res = await makeRequest('/api/design-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-simulate-failure': 'timeout' },
      body: { email: 'test@example.com' },
    });
    record('API: POST /api/design-request (Simulated 504 Timeout)', res.statusCode === 504, `HTTP ${res.statusCode}`);
  } catch (e) {
    record('API: POST /api/design-request (Simulated 504)', false, e.message);
  }

  // 11. Gemini Gateway Verification
  // 11a. Invalid request method
  try {
    const res = await makeRequest('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { method: 'unsupportedOperation' },
    });
    record('Gemini Gateway (Invalid Method -> 400)', res.statusCode === 400, `HTTP ${res.statusCode}`);
  } catch (e) {
    record('Gemini Gateway (Invalid Method)', false, e.message);
  }

  // 11b. Simulated Timeout
  try {
    const res = await makeRequest('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-test-gemini': 'timeout' },
      body: { method: 'generateContent', prompt: 'test' },
    });
    record('Gemini Gateway (Simulated Timeout -> 504)', res.statusCode === 504, `HTTP ${res.statusCode}`);
  } catch (e) {
    record('Gemini Gateway (Simulated Timeout)', false, e.message);
  }

  // 11c. Simulated Malformed upstream
  try {
    const res = await makeRequest('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-test-gemini': 'malformed' },
      body: { method: 'generateContent', prompt: 'test' },
    });
    record('Gemini Gateway (Simulated Malformed -> 502)', res.statusCode === 502, `HTTP ${res.statusCode}`);
  } catch (e) {
    record('Gemini Gateway (Simulated Malformed)', false, e.message);
  }

  // 11d. Simulated Rate Limit
  try {
    const res = await makeRequest('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-test-gemini': 'rate_limit' },
      body: { method: 'generateContent', prompt: 'test' },
    });
    const hasRetryAfter = res.headers['retry-after'] === '60';
    record('Gemini Gateway (Simulated Rate Limit -> 429 + Retry-After)', res.statusCode === 429 && hasRetryAfter, `HTTP ${res.statusCode}, Retry-After: ${res.headers['retry-after']}`);
  } catch (e) {
    record('Gemini Gateway (Simulated Rate Limit)', false, e.message);
  }

  // 11e. Simulated Unavailable
  try {
    const res = await makeRequest('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-test-gemini': 'unavailable' },
      body: { method: 'generateContent', prompt: 'test' },
    });
    record('Gemini Gateway (Simulated Unavailable -> 503)', res.statusCode === 503, `HTTP ${res.statusCode}`);
  } catch (e) {
    record('Gemini Gateway (Simulated Unavailable)', false, e.message);
  }

  // 11f. SSRF Prevention on video download
  try {
    const res = await makeRequest('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { method: 'downloadVideo', uri: 'http://169.254.169.254/latest/meta-data/' },
    });
    record('Gemini Gateway SSRF Protection (Metadata IP Blocked -> 403)', res.statusCode === 403, `HTTP ${res.statusCode}`);
  } catch (e) {
    record('Gemini Gateway SSRF Protection', false, e.message);
  }

  // 12. Graceful Shutdown Check
  console.log('\nTesting Graceful Shutdown (SIGTERM)...');
  const shutdownPromise = new Promise((resolve) => {
    serverProcess.on('exit', (code, signal) => {
      resolve({ code, signal });
    });
  });
  serverProcess.kill('SIGTERM');
  const exitResult = await shutdownPromise;
  record('Graceful Server Shutdown on SIGTERM', exitResult.code === 0 || exitResult.signal === 'SIGTERM', `Exit code: ${exitResult.code}`);

  // Summary
  console.log('\n====================================================');
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  console.log(`TOTAL CHECKS: ${total} | PASSED: ${passed} | FAILED: ${total - passed}`);
  console.log('====================================================');

  if (!allPassed) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Fatal Test Runner Failure:', err);
  if (serverProcess) serverProcess.kill('SIGTERM');
  process.exit(1);
});
