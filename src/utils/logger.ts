import winston from "winston";

const isProd = process.env.NODE_ENV === "production";

const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.printf((info: winston.Logform.TransformableInfo) => {
    const { level, message, timestamp, traceId, traceID } = info;
    const traceValue = traceID || traceId;
    const trace = traceValue ? ` traceID=${traceValue}` : "";
    return `${timestamp} ${level}: ${message}${trace}`;
  })
);

const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format((info: winston.Logform.TransformableInfo) => {
    const traceId = (info.traceID || info.traceId) as string | undefined;
    return {
      ...info,
      severity: info.level,
      traceID: traceId,
      traceId
    };
  })(),
  winston.format.json()
);

export const logger = winston.createLogger({
  level: isProd ? "info" : "debug",
  format: isProd ? prodFormat : devFormat,
  defaultMeta: { service: "user-management-api" },
  transports: [new winston.transports.Console()]
});
