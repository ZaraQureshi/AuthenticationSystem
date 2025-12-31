import { Redis } from "ioredis";
import { inject } from "tsyringe";
export interface RateLimiter {
    hit(key: string): Promise<void>;
}

export class RedisRateLimiter implements RateLimiter {
    constructor(
        private redis: Redis,
        @inject("RedisRateLimiter") private config: {
            windowSec: number
            limit: number,
        }
    ) { }

    async hit(key: string) {
        const current = await this.redis.incr(key);

        if (current === 1) {
            await this.redis.expire(key, this.config.windowSec);
        }

        if (current > this.config.limit) {
            const ttl = await this.redis.ttl(key);
            const error = new Error("Too many attempts");
            (error as any).retryAfter = ttl;
            throw error;
        }
    }
}
