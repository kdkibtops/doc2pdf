import yargs from 'yargs';
import ConsoleColorLogger, { LogLevels } from './ConsoleColorLogger';
import convertAllDocsInFolder from './convertDocToPdf';
import { promisify } from 'util';
import { exec } from 'child_process';
import readline from 'readline';
import path from 'path';

async function askForConfirmation(question: string): Promise<boolean> {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	const confirm: boolean = await new Promise((resolve) => {
		console.log('\x1b[31m');
		rl.question(question, (response) => {
			console.log('\x1b[0m');
			rl.close();
			resolve(Boolean(response && response.toLowerCase() === 'y'));
		});
	});
	return confirm;
}

export type ConversionResult =
	| {
			successful: false;
			message: string;
	  }
	| {
			successful: true;
			outputDirectory: string;
	  };

async function convert2PDF(
	prompt: boolean = false,
	logToConsole: boolean = false,
	inputFolder?: string,
	outputFolder?: string,
	logLevel: LogLevels = 'info',
	logFile?: string
): Promise<ConversionResult> {
	const options: Intl.DateTimeFormatOptions = {
		timeZone: 'Africa/Cairo',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	};

	console.log(`\x1b[32m%s\x1b[0m`, 'Convert2Pdf Developed by Mustafa Heidar');

	if (prompt) {
		const answer = await askForConfirmation(
			`This process will terminate all opened Microsoft word instances, save your work before proceeding or terminate this.
Do you want to continue and terminate all running word processes? (Y) or terminate (press any key)`
		);
		if (!answer)
			return {
				successful: false,
				message: 'Operation cancelled by user',
			};
	}

	const argv = await yargs(process.argv.slice(2))
		.option('input', {
			alias: 'i',
			type: 'string',
			description: 'Input directory path',
			demandOption: true,
		})
		.option('log-level', {
			alias: 'll',
			type: 'string',
			description: 'Log level',
			default: 'info',
			choices: ['info', 'debug', 'warn'],
		})
		.option('log-file', {
			alias: 'lf',
			type: 'string',
			description:
				'Log file path (If omitted, default is ..OutputDirectory/conversionlog.<timestamp>.log',
		})
		.option('output', {
			alias: 'o',
			type: 'string',
			description: 'Output directory path',
			default: './exported',
		})
		.help().argv;

	inputFolder = inputFolder
		? path.resolve(inputFolder)
		: path.resolve(argv.input);
	outputFolder = outputFolder
		? path.resolve(outputFolder)
		: path.resolve(argv.output);
	logLevel = logLevel || (argv['log-level'] as LogLevels);
	logFile = logFile
		? path.resolve(logFile)
		: path.resolve(
				argv['log-file'] ? argv['log-file'] : path.resolve(outputFolder),
				`conversionlog.${new Date().toISOString().replace(/:/g, '_')}.log`
		  );

	const logger = new ConsoleColorLogger(logLevel, logFile);

	if (logToConsole) {
		logger.log('yellow', [
			`Process starting at: ${new Date().toLocaleDateString(
				'en-EG',
				options
			)}@${new Date().toLocaleTimeString('en-EG', options)}`,
		]);
		logger.log('magenta', [
			`Processing ${inputFolder}\nOutput Directory:${outputFolder}\nLog Level: ${logLevel}\nLog directory ${logFile}`,
		]);
	}

	const startProcess = performance.now();

	if (inputFolder) {
		try {
			// Terminate any previous word process
			const execPromise = promisify(exec);
			await execPromise(`TASKKILL /im winword.exe /f`)
				.then(() => true)
				.catch((err) => true);

			await convertAllDocsInFolder(inputFolder, logger, outputFolder);

			if (logToConsole) {
				logger.log('green', ['All documents have been converted to PDF.']);
				const endProcess = performance.now();
				logger.log('yellow', [
					`Process ended at: ${new Date().toLocaleDateString(
						'en-EG',
						options
					)}@${new Date().toLocaleTimeString('en-EG', options)}`,
				]);
				logger.log('cyan', [
					`Process finished, whole process took ${Math.round(
						(endProcess - startProcess) / 1000
					)} Seconds`,
				]);
			}
			return { successful: true, outputDirectory: outputFolder }; // Return output folder on success
		} catch (err) {
			const error = err as Error;
			logger.log('red', ['Error during conversion:', error.message]);
			return {
				successful: false,
				message: `Error during conversion: ${error.message}`,
			}; // Return error message on failure
		}
	} else {
		return {
			successful: false,
			message:
				'Please provide an input folder path as a command-line argument.',
		};
	}
}

// Export the convert2PDF for use in other apps
export default convert2PDF;

// Check if the script is being run directly or imported as a module
if (require.main === module) {
	convert2PDF(true, true).then((result) => {
		console.log(result.successful ? '' : ``);
		if (result.successful) {
			console.log('\x1b[32m%s\x1b[0m', 'Process completed successfully');
			process.exit(1); // Exit with error code
		} else {
			console.log('\x1b[31m%s\x1b[0m', 'Process failed');

			process.exit(0); // Exit with success code
		}
	});
}
