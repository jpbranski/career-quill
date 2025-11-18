// Client-side rate limiting using localStorage

const RATE_LIMIT_KEY = 'career-quill-ai-rate-limit';

interface RateLimitData {
  requests: number[];
  lastReset: string;
}

const RATE_LIMIT_CONFIG = {
  requestsPerDay: 5,
  cooldownSeconds: 30,
};

/**
 * Check if user can make an AI analysis request
 */
export function canMakeRequest(): { allowed: boolean; reason?: string; waitTime?: number } {
  const data = getRateLimitData();
  const now = Date.now();

  // Check daily limit
  const today = new Date().toDateString();
  const lastReset = new Date(data.lastReset).toDateString();

  // Reset counter if it's a new day
  if (today !== lastReset) {
    resetRateLimit();
    return { allowed: true };
  }

  // Check if daily limit exceeded
  if (data.requests.length >= RATE_LIMIT_CONFIG.requestsPerDay) {
    return {
      allowed: false,
      reason: `Daily limit of ${RATE_LIMIT_CONFIG.requestsPerDay} requests reached. Please try again tomorrow.`,
    };
  }

  // Check cooldown period (must wait 30 seconds between requests)
  if (data.requests.length > 0) {
    const lastRequest = data.requests[data.requests.length - 1];
    const timeSinceLastRequest = (now - lastRequest) / 1000; // in seconds

    if (timeSinceLastRequest < RATE_LIMIT_CONFIG.cooldownSeconds) {
      const waitTime = Math.ceil(RATE_LIMIT_CONFIG.cooldownSeconds - timeSinceLastRequest);
      return {
        allowed: false,
        reason: `Please wait ${waitTime} seconds before making another request.`,
        waitTime,
      };
    }
  }

  return { allowed: true };
}

/**
 * Record a new request
 */
export function recordRequest(): void {
  const data = getRateLimitData();
  const now = Date.now();

  data.requests.push(now);

  // Keep only requests from today
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  data.requests = data.requests.filter((timestamp) => timestamp > oneDayAgo);

  saveRateLimitData(data);
}

/**
 * Get remaining requests for today
 */
export function getRemainingRequests(): number {
  const data = getRateLimitData();
  const today = new Date().toDateString();
  const lastReset = new Date(data.lastReset).toDateString();

  if (today !== lastReset) {
    return RATE_LIMIT_CONFIG.requestsPerDay;
  }

  return Math.max(0, RATE_LIMIT_CONFIG.requestsPerDay - data.requests.length);
}

/**
 * Get time until next request is allowed
 */
export function getTimeUntilNextRequest(): number {
  const data = getRateLimitData();

  if (data.requests.length === 0) {
    return 0;
  }

  const lastRequest = data.requests[data.requests.length - 1];
  const timeSinceLastRequest = (Date.now() - lastRequest) / 1000;
  const waitTime = Math.max(0, RATE_LIMIT_CONFIG.cooldownSeconds - timeSinceLastRequest);

  return Math.ceil(waitTime);
}

/**
 * Reset rate limit data
 */
export function resetRateLimit(): void {
  const data: RateLimitData = {
    requests: [],
    lastReset: new Date().toISOString(),
  };
  saveRateLimitData(data);
}

/**
 * Get rate limit data from localStorage
 */
function getRateLimitData(): RateLimitData {
  try {
    const stored = localStorage.getItem(RATE_LIMIT_KEY);
    if (!stored) {
      return {
        requests: [],
        lastReset: new Date().toISOString(),
      };
    }
    return JSON.parse(stored) as RateLimitData;
  } catch (error) {
    console.error('Failed to load rate limit data:', error);
    return {
      requests: [],
      lastReset: new Date().toISOString(),
    };
  }
}

/**
 * Save rate limit data to localStorage
 */
function saveRateLimitData(data: RateLimitData): void {
  try {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save rate limit data:', error);
  }
}

/**
 * Get rate limit configuration
 */
export function getRateLimitConfig() {
  return RATE_LIMIT_CONFIG;
}
