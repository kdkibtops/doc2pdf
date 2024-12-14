import { appendFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

export type LogLevels = 'info' | 'debug' | 'warn';

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

	private logLevel: string;
	private logFile?: string;

	constructor(logLevel: 'info' | 'debug' | 'warn' = 'info', logFile?: string) {
		this.logLevel = logLevel;
		this.logFile = logFile;

		if (logFile && !existsSync(path.dirname(logFile)))
			mkdirSync(path.dirname(logFile));
	}

	public log(
		color: 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'reset',
		[...message]: any[],
		processTime?: number
	) {
		const timestamp = new Date().toLocaleString('en-EG', {
			timeZone: 'Africa/Cairo',
		});
		const formattedMessage = processTime
			? `${timestamp} - ${message} => ${Math.round(processTime / 1000)} seconds`
			: `${timestamp} - ${message}`;

		if (this.colors[color]) {
			console.log(
				`${this.colors[color]}%s${this.colors.reset}`,
				formattedMessage
			);
		} else {
			console.log(formattedMessage); // Default to no color if the color is not found
		}
		if (this.logFile) {
			switch (this.logLevel) {
				case 'info':
					break;
				case 'warn':
					break;
				case 'debug':
					break;

				default:
					break;
			}
			appendFileSync(this.logFile, `${formattedMessage}`);
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
