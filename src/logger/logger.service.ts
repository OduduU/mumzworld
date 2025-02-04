import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { promises as fsPromises } from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerService extends ConsoleLogger {
  async logToFile(entry: string) {
    const formattedEntry = `${Intl.DateTimeFormat('en-US', {
      dateStyle: 'short',
      timeStyle: 'short',
      timeZone: 'Asia/Dubai',
    }).format(new Date())}\t${entry}\n`;

    try {
      if (!fs.existsSync(path.join(__dirname, '..', '..', 'logs'))) {
        await fsPromises.mkdir(path.join(__dirname, '..', '..', 'logs'));
      }
      await fsPromises.appendFile(
        path.join(__dirname, '..', '..', 'logs', 'myLogFile.log'),
        formattedEntry,
      );
    } catch (e) {
      if (e instanceof Error) console.error(e.message);
    }
  }
  log(message: any, context?: string): void {
    const logEntry = context ? `${context}\t${message}` : `${message}`;
    this.logToFile(logEntry);
    super.log(message, context);
  }

  error(message: any, stackOrContext?: string): void {
    const logEntry = stackOrContext
      ? `${stackOrContext}\t${message}`
      : `${message}`;
    this.logToFile(logEntry);
    super.error(message, stackOrContext);
  }

  warn(message: any, context?: string | undefined): void {
    const logEntry = `${context ? context : ''}${message}`;
    this.logToFile(logEntry);
    super.debug(message, context);
  }
}
