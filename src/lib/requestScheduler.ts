type QueuedRequest = {
  url: string;
  resolve: (value: Response) => void;
  reject: (reason: unknown) => void;
  signal?: AbortSignal;
};

const MAX_CONCURRENT = 2;
const BASE_DELAY_MS = 1000;
const MAX_RETRIES = 3;

let activeRequests = 0;
const queue: QueuedRequest[] = [];
const inflightRequests = new Map<string, Promise<Response>>();

function processQueue() {
  while (activeRequests < MAX_CONCURRENT && queue.length > 0) {
    const request = queue.shift()!;
    if (request.signal?.aborted) {
      request.reject(new DOMException('Aborted', 'AbortError'));
      continue;
    }
    activeRequests++;
    executeRequest(request);
  }
}

async function executeRequest(request: QueuedRequest) {
  try {
    const response = await fetchWithRetry(request.url, request.signal);
    request.resolve(response);
  } catch (error) {
    request.reject(error);
  } finally {
    activeRequests--;
    inflightRequests.delete(request.url);
    processQueue();
  }
}

async function fetchWithRetry(url: string, signal?: AbortSignal): Promise<Response> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    const response = await fetch(url, { signal });

    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      const delayMs = retryAfter
        ? parseInt(retryAfter, 10) * 1000
        : BASE_DELAY_MS * Math.pow(2, attempt);

      if (attempt < MAX_RETRIES) {
        await sleep(delayMs);
        continue;
      }
    }

    if (response.ok) {
      return response;
    }

    if (response.status >= 500 && attempt < MAX_RETRIES) {
      await sleep(BASE_DELAY_MS * Math.pow(2, attempt));
      continue;
    }

    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  throw new Error(`Max retries exceeded for ${url}`);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Scheduled fetch with concurrency control, retry, and request deduplication.
 * Same URL in-flight returns the same promise.
 */
export function scheduledFetch(url: string, signal?: AbortSignal): Promise<Response> {
  const existing = inflightRequests.get(url);
  if (existing) return existing;

  const promise = new Promise<Response>((resolve, reject) => {
    queue.push({ url, resolve, reject, signal });
    processQueue();
  });

  inflightRequests.set(url, promise);
  return promise;
}
