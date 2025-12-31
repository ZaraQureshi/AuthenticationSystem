export const DEFAULT_ACCOUNT_LOCK = {
  maxAttempts: 2,
  lockDurationMin: 30,
};

export const DEFAULT_RATE_LIMITS = {
  login: {
    byIp: { limit: 30, windowSec: 60 },
    byEmail: { limit: 5, windowSec: 900 },
    byEmailIp: { limit: 5, windowSec: 600 },
  },
};
