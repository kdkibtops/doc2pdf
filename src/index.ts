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
	const confirm: boolean = await new Promise(async (resolve) => {
		console.log('\x1b[31m');
		rl.question(question, (response) => {
			console.log('\x1b[0m');
			rl.close();
			if (response && response.toLowerCase() === 'y') {
				resolve(true);
			} else {
				resolve(false);
			}
		});
	});
	return confirm;
}

async function mainFunction() {
	console.log(`\x1b[32m%s\x1b[0m`, 'Developed by Mustafa Heidar');
	const answer = await askForConfirmation(
		`This process will terminate all opened Microsoft word instances, save your work before proceeding or terminate this.
Do you want to continue and temrinate all running word processes? (Y) or terminate (press anykey)`
	);
	if (!answer) return process.exit(0);
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
				'Log file path (If ommitted, default is ..OutputDirectory/conversionlog.<timestamp>.log',
		})
		.option('output', {
			alias: 'o',
			type: 'string',
			description: 'Output directory path',
			default: './exported',
		})
		.help().argv;

	const inputFolder = path.resolve(argv.input);
	const outputFolder = path.resolve(argv.output);
	const logLevel = argv['log-level'] as LogLevels;
	const logFile = path.resolve(
		argv['log-file'] ? argv['log-file'] : path.resolve(outputFolder),
		`conversionlog.${new Date().toISOString().replaceAll(':', '_')}.log`
	);
	const logger = new ConsoleColorLogger(logLevel, logFile);
	const options: Intl.DateTimeFormatOptions = {
		timeZone: 'Africa/Cairo',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	};
	logger.log('yellow', [
		`Process starting at: ${new Date().toLocaleDateString(
			'en-EG',
			options
		)}@${new Date().toLocaleTimeString('en-EG', options)}`,
	]);
	logger.log(`magenta`, [
		`Processing ${inputFolder}\nOutput Directory:${outputFolder}\nLog Level: ${logLevel}\nLog directory ${
			logFile ? logFile : 'console'
		}`,
	]);
	const startProcess = performance.now();

	if (inputFolder) {
		try {
			// Teriminate any previous word process
			const execPromise = promisify(exec);
			await execPromise(`TASKKILL /im winword.exe /f`)
				.then(() => true)
				.catch((err) => true);

			await convertAllDocsInFolder(inputFolder, logger, outputFolder);
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
			process.exit(0); // Exit with success code
		} catch (err) {
			const error = err as Error;
			logger.log('red', ['Error during conversion:', error.message]);
			process.exit(1); // Exit with error code
		}
	} else {
		console.error(
			'Please provide an input folder path as a command-line argument.'
		);
	}
	process.exit(1); // Exit with error code if input folder is missing
}

mainFunction();
