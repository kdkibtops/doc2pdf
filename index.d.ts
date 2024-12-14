declare module 'convertfolderdocs2pdf' {
	interface ConversionOptions {
		inputFolder?: string;
		outputFolder?: string;
		logLevel?: 'info' | 'debug' | 'warn';
		logFile?: string;
		prompt?: boolean;
		logToConsole?: boolean;
	}

	type ConversionResult =
		| {
				successful: false;
				message: string;
		  }
		| {
				successful: true;
				outputDirectory: string;
		  };

	function convert2PDF(
		prompt?: boolean,
		logToConsole?: boolean,
		inputFolder?: string,
		outputFolder?: string,
		logLevel?: 'info' | 'debug' | 'warn',
		logFile?: string
	): Promise<ConversionResult>;

	export { ConversionOptions, ConversionResult, convert2PDF };
}
