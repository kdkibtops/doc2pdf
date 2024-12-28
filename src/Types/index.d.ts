// index.d.ts
export type LogLevels = 'info' | 'debug' | 'warn';

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

export function convert2PDF(
	prompt?: boolean,
	logToConsole?: boolean,
	inputFolder?: string,
	outputFolder?: string,
	logLevel?: LogLevels,
	logFile?: string
): Promise<ConversionResult>;
