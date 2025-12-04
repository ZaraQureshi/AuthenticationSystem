import pino from "pino";

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
    },
  },
  level: process.env.LOG_LEVEL || "info",
});

export default logger;
