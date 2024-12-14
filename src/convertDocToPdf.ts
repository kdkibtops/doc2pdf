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
	const scriptPath = path.join(__dirname, '../', 'script.vbs');
	const command = `cscript //Nologo ${scriptPath} "${path.join(
		docxPath
	)}" "${path.join(pdfPath)}"`;
	let state: 'Successful' | 'Failed' = 'Failed';
	const start = performance.now();
	try {
		await execPromise(command);
		logger.log(
			'green',
			[`PDF created successfully from ${docxPath} to ${pdfPath}`],
			performance.now() - start
		);
		state = 'Successful';
	} catch (error) {
		state = 'Failed';
		logger.log(
			'red',
			[`Creating PDF failed from: ${docxPath}`],
			performance.now() - start
		);
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
