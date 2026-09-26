export interface VideoOperationStatus {
  name?: string;
  done?: boolean;
  response?: {
    generatedVideos?: Array<{
      video?: {
        uri?: string;
      };
    }>;
  };
  error?: {
    message?: string;
    code?: number;
  };
}

export async function generateContent(params: any): Promise<any> {
  let response: globalThis.Response;
  try {
    response = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...params, method: 'generateContent' }),
    });
  } catch (netErr: any) {
    throw new Error(netErr?.message || 'Network error communicating with AI gateway.');
  }
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to generate content: ${response.status} ${response.statusText}`);
  }
  
  try {
    return await response.json();
  } catch {
    throw new Error('Received malformed response payload from AI gateway.');
  }
}

export async function generateVideos(params: {
  prompt: string;
  model?: string;
  config?: Record<string, any>;
}): Promise<VideoOperationStatus> {
  let response: globalThis.Response;
  try {
    response = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...params, method: 'generateVideos' }),
    });
  } catch (netErr: any) {
    throw new Error(netErr?.message || 'Network error communicating with video generator.');
  }
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate videos');
  }
  
  try {
    const data = await response.json();
    return { name: data.operationName, done: false };
  } catch {
    throw new Error('Received malformed response payload from video generator.');
  }
}

export async function getVideosOperation(params: {
  operation?: { name?: string };
  operationName?: string;
}): Promise<VideoOperationStatus> {
  let response: globalThis.Response;
  try {
    response = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...params, method: 'getVideosOperation' }),
    });
  } catch (netErr: any) {
    throw new Error(netErr?.message || 'Network error communicating with video operation endpoint.');
  }
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to get video operation');
  }
  
  try {
    return await response.json();
  } catch {
    throw new Error('Received malformed video operation status.');
  }
}

export async function downloadVideo(uri: string): Promise<Blob> {
  let response: globalThis.Response;
  try {
    response = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uri, method: 'downloadVideo' }),
    });
  } catch (netErr: any) {
    throw new Error(netErr?.message || 'Network error downloading media asset.');
  }
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to download video');
  }
  
  return response.blob();
}

export async function* generateContentStream(params: any): AsyncGenerator<{ text: string }> {
  const response = await fetch('/api/gemini/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...params, method: 'generateContentStream' }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate content stream');
  }
  
  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body stream available");
  
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    yield { text: decoder.decode(value, { stream: true }) };
  }
}
