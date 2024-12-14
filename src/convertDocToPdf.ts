import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';
import fs, { existsSync, mkdirSync } from 'fs';
import ConsoleColorLogger from './ConsoleColorLogger';
const execPromise = promisify(exec);

async function convertDocxToPdf(
	docxPath: string,
	pdfPath: string,
	logger: ConsoleColorLogger
): Promise<'Failed' | 'Successful'> {
	// Determine the correct path for script.vbs
	const scriptPath = path.join(__dirname, '../', 'assets', 'script.vbs');

	// For `pkg` environment, resolve path correctly
	const resolvedScriptPath = process.pkg
		? path.join(path.dirname(process.execPath), 'assets', 'script.vbs')
		: scriptPath;

	const command = `cscript //Nologo "${resolvedScriptPath}" "${docxPath}" "${pdfPath}"`;
	let state: 'Successful' | 'Failed' = 'Failed';
	const startProcess = process.hrtime();

	try {
		await execPromise(command);
		const endProcess = process.hrtime(startProcess);
		const timeTaken = (endProcess[0] * 1e9 + endProcess[1]) / 1e9; // Convert to seconds
		logger.log(
			'green',
			[`PDF created successfully from ${docxPath} to ${pdfPath}`],
			timeTaken
		);
		state = 'Successful';
	} catch (error) {
		state = 'Failed';
		const endProcess = process.hrtime(startProcess);
		const timeTaken = (endProcess[0] * 1e9 + endProcess[1]) / 1e9; // Convert to seconds
		console.log(error);
		logger.log('red', [`Creating PDF failed from: ${docxPath}`], timeTaken);
	} finally {
		await execPromise(`TASKKILL /im winword.exe /f`)
			.then(() => true)
			.catch((err) => true);
		return state;
	}
}

const converted = new Map();

async function convertAllDocsInFolder(
	inputFolder: string,
	logger: ConsoleColorLogger,
	outputFolder?: string
) {
	const allowedFileExtensionsToConvert = ['.docx', '.doc'];
	const contents = fs.readdirSync(path.join(inputFolder));

	for (const child of contents) {
		const childPath = path.join(inputFolder, child);
		const isDirectory = fs.statSync(childPath).isDirectory();
		if (isDirectory) {
			await convertAllDocsInFolder(childPath, logger, outputFolder);
			continue;
		}

		if (
			!allowedFileExtensionsToConvert.includes(
				path.extname(child).toLowerCase()
			)
		) {
			logger.log('yellow', [
				`File: ${childPath} is not supported for conversion to pdf`,
			]);
			continue;
		}

		// Skip temporary Word files
		if (
			child.startsWith('~$') ||
			path.extname(child).toLowerCase() === '.tmp'
		) {
			continue;
		}

		const pdfPath = path.join(
			outputFolder ? outputFolder : inputFolder,
			path.basename(child) + '.pdf'
		);
		if (!existsSync(path.dirname(pdfPath))) mkdirSync(path.dirname(pdfPath));
		const state = await convertDocxToPdf(childPath, pdfPath, logger);
		converted.set(child, { documentPath: childPath, pdfPath, state });
	}
}

export default convertAllDocsInFolder;
