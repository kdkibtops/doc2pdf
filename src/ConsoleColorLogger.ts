import { appendFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { LogLevels } from '../Types/types';

class ConsoleColorLogger {
	private colors: { [key: string]: string } = {
		red: '\x1b[31m',
		green: '\x1b[32m',
		yellow: '\x1b[33m',
		blue: '\x1b[34m',
		magenta: '\x1b[35m',
		cyan: '\x1b[36m',
		reset: '\x1b[0m',
	};
	private logLevel:
		| 'info'
		| 'debug'
		| 'warn'
		| 'quiet'
		| 'log_to_file'
		| 'log_to_console' = 'info';
	private logFile?: string;

	constructor(logLevel: LogLevels = 'info', logFile?: string) {
		this.logLevel = logLevel;
		this.logFile = logFile;
		if (logFile && !existsSync(path.dirname(logFile)))
			mkdirSync(path.dirname(logFile));
	}

	public log(
		level: 'warn_success' | 'warn_failed' | 'warning' | 'info' | 'debug',
		[...message]: any[],
		processTime?: number
	) {
		const timestamp = new Date().toLocaleString('en-EG', {
			timeZone: 'Africa/Cairo',
		});
		const formattedMessage = processTime
			? `${timestamp} - ${message.join(' ')} => ${Math.round(
					processTime
			  )} seconds`
			: `${timestamp} - ${message.join(' ')}`;

		const color =
			level === 'warn_success'
				? 'green'
				: level === 'warn_failed'
				? 'red'
				: level === 'warning'
				? 'yellow'
				: level === 'info'
				? 'magenta'
				: level === 'debug'
				? 'blue'
				: 'reset';
		if (this.logLevel !== 'quiet')
			console.log(
				`${this.colors[color]}%s${this.colors.reset}`,
				formattedMessage
			);

		if (this.logFile) {
			let shouldLog = false;
			switch (this.logLevel) {
				case 'info':
					shouldLog = level === 'info';
					break;
				case 'warn':
					shouldLog = [
						'info',
						'warn_success',
						'warn_failed',
						'warning',
					].includes(level);
					break;
				case 'debug':
					shouldLog = true;
					break;
				case 'log_to_file':
					shouldLog = true;
					break;
				default:
					break;
			}
			if (shouldLog && this.logLevel !== 'quiet')
				appendFileSync(this.logFile, `${formattedMessage}` + '\n');
		}
	}

	public setLogLevel(logLevel: 'info' | 'debug' | 'warn') {
		this.logLevel = logLevel;
	}

	public getLogLevel() {
		return this.logLevel;
	}
}

export default ConsoleColorLogger;
