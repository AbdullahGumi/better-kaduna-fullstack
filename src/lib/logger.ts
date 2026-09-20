import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import fs from 'fs';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';
const enableFileLogging = process.env.ENABLE_FILE_LOGGING === 'true';

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: isProduction
      ? winston.format.combine(
          winston.format.timestamp(),
          winston.format.errors({ stack: true }),
          winston.format.json()
        )
      : winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.printf(({ level, message, timestamp, ...meta }) => {
            const metaStr = Object.keys(meta).length && meta.service !== 'better-kaduna-next'
              ? ` ${JSON.stringify(meta)}`
              : '';
            return `${timestamp} [${level}]: ${message}${metaStr}`;
          })
        ),
  }),
];

// File logging is opt-in (disabled by default in production/containers to stream logs to stdout/stderr)
if (enableFileLogging) {
  const logsDir = path.join(process.cwd(), 'logs');
  try {
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    transports.push(
      new DailyRotateFile({
        filename: 'logs/error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        maxSize: '20m',
        maxFiles: '14d',
      }),
      new DailyRotateFile({
        filename: 'logs/combined-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '14d',
      })
    );
  } catch (err) {
    console.error('Failed to initialize file logger:', err);
  }
}

// Winston Logger Setup
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  defaultMeta: { service: 'better-kaduna-next' },
  transports,
});

// Log Cleanup Function (only runs if file logging is enabled)
export const logCleanup = async () => {
  if (!enableFileLogging) return;

  const logsDir = path.join(process.cwd(), 'logs');
  try {
    if (!fs.existsSync(logsDir)) {
      return;
    }

    const files = fs.readdirSync(logsDir);
    const twentyNineDaysAgo = new Date();
    twentyNineDaysAgo.setDate(twentyNineDaysAgo.getDate() - 29);

    let deletedCount = 0;

    for (const file of files) {
      const filePath = path.join(logsDir, file);
      const stats = fs.statSync(filePath);

      if (stats.mtime < twentyNineDaysAgo) {
        fs.unlinkSync(filePath);
        deletedCount++;
        logger.info(`Deleted old log file: ${file}`);
      }
    }

    if (deletedCount > 0) {
      logger.info(`Log cleanup completed: ${deletedCount} file(s) deleted`);
    }
  } catch (error) {
    logger.error('Error during log cleanup:', error);
  }
};
