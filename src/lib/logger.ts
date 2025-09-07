import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// Create logs directory if it doesn't exist
import fs from 'fs';
import path from 'path';

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Winston Logger Setup (migrated from Express backend)
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: "better-kaduna-next" },
  transports: [
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d'
    }),
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d'
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

// Log Cleanup Function (migrated from Express backend)
export const logCleanup = async () => {
  try {
    // Check if logs directory exists
    if (!fs.existsSync(logsDir)) {
      logger.info("Logs directory does not exist, skipping cleanup");
      return;
    }

    const files = fs.readdirSync(logsDir);
    const twentyNineDaysAgo = new Date();
    twentyNineDaysAgo.setDate(twentyNineDaysAgo.getDate() - 29);

    let deletedCount = 0;

    for (const file of files) {
      const filePath = path.join(logsDir, file);
      const stats = fs.statSync(filePath);

      // Check if file is older than 29 days
      if (stats.mtime < twentyNineDaysAgo) {
        fs.unlinkSync(filePath);
        deletedCount++;
        logger.info(`Deleted old log file: ${file}`);
      }
    }

    if (deletedCount > 0) {
      logger.info(`Log cleanup completed: ${deletedCount} file(s) deleted`);
    } else {
      logger.info("Log cleanup completed: No old files to delete");
    }
  } catch (error) {
    logger.error("Error during log cleanup:", error);
  }
};
