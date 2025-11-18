interface RateLimitEntry {
  count: number;
  firstRequest: number;
  lastRequest: number;
}

class RateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map();
  private maxPerDay: number;
  private cooldownSeconds: number;

  constructor() {
    this.maxPerDay = parseInt(process.env.RATE_LIMIT_MAX_PER_DAY || '5');
    this.cooldownSeconds = parseInt(process.env.RATE_LIMIT_COOLDOWN_SECONDS || '30');

    // Cleanup old entries every hour
    setInterval(() => this.cleanup(), 60 * 60 * 1000);
  }

  private cleanup() {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    for (const [key, entry] of this.requests.entries()) {
      if (now - entry.firstRequest > oneDayMs) {
        this.requests.delete(key);
      }
    }
  }

  check(identifier: string): {
    allowed: boolean;
    error?: string;
    retryAfter?: number;
  } {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    // No previous requests
    if (!entry) {
      this.requests.set(identifier, {
        count: 1,
        firstRequest: now,
        lastRequest: now,
      });
      return { allowed: true };
    }

    // Check cooldown
    const cooldownMs = this.cooldownSeconds * 1000;
    const timeSinceLastRequest = now - entry.lastRequest;

    if (timeSinceLastRequest < cooldownMs) {
      const retryAfter = Math.ceil((cooldownMs - timeSinceLastRequest) / 1000);
      return {
        allowed: false,
        error: `Please wait ${retryAfter} seconds before trying again`,
        retryAfter,
      };
    }

    // Check daily limit
    const oneDayMs = 24 * 60 * 60 * 1000;
    const timeSinceFirstRequest = now - entry.firstRequest;

    if (timeSinceFirstRequest < oneDayMs) {
      if (entry.count >= this.maxPerDay) {
        const resetTime = entry.firstRequest + oneDayMs;
        const hoursUntilReset = Math.ceil((resetTime - now) / (60 * 60 * 1000));
        return {
          allowed: false,
          error: `Daily limit of ${this.maxPerDay} requests reached. Try again in ${hoursUntilReset} hours`,
        };
      }

      // Increment count
      entry.count++;
      entry.lastRequest = now;
      this.requests.set(identifier, entry);
      return { allowed: true };
    } else {
      // Reset after 24 hours
      this.requests.set(identifier, {
        count: 1,
        firstRequest: now,
        lastRequest: now,
      });
      return { allowed: true };
    }
  }
}

// Singleton instance
const rateLimiter = new RateLimiter();

export default rateLimiter;
