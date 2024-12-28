import convert2PDF from '../src';

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
declare function convert2PDF(
	prompt: boolean = false,
	logToConsole: boolean = false,
	inputFolder?: string,
	outputFolder?: string,
	logLevel: LogLevels = 'info',
	logFile?: string
): Promise<ConversionResult>;
export default convert2PDF;
