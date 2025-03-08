import winston from 'winston';
import { utilities } from 'nest-winston';

export const loggerFactory = () => {
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
