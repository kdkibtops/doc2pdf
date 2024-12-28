// index.d.ts
export type LogLevels =
	| 'info'
	| 'debug'
	| 'warn'
	| 'quiet'
	| 'log_to_file'
	| 'log_to_console';

export interface ConversionOptions {
	inputFolder?: string;
	outputFolder?: string;
	logLevel?: LogLevels;
	logFile?: string;
	prompt?: boolean;
	logToConsole?: boolean;
}

export type ConversionResult =
	| {
			successful: false;
			message: string;
	  }
	| {
			successful: true;
			outputDirectory: string;
			directoryCount: number;
			falseCount: number;
			trueCount: number;
			notSupportedCount: number;
	  };
