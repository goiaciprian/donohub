import { utilities } from "nest-winston";
import winston from "winston";

const loggerFactory = () => {
  return winston.createLogger({
    level: 'info',
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          utilities.format.nestLike()
        ),
      }),
    ],
  });
};

let instance: winston.Logger | null = null

export const Logger = instance || (() => {
  instance = loggerFactory();
  return instance
}) ()

