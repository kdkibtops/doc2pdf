import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';
import {
	existsSync,
	mkdirSync,
	readdirSync,
	statSync,
	writeFileSync,
} from 'fs';
import ConsoleColorLogger from './ConsoleColorLogger';
const execPromise = promisify(exec);

async function convertDocxToPdf(
	docxPath: string,
	pdfPath: string,
	logger: ConsoleColorLogger
): Promise<boolean> {
	// Determine the correct path for script.vbs
	const scriptPath = path.join(__dirname, '../', 'assets', '~$temp_script.vbs');

	// For `pkg` environment, resolve path correctly
	const resolvedScriptPath = process.pkg
		? path.join(path.dirname(process.execPath), '~$temp_script.vbs')
		: scriptPath;
	//  Create temp vbs script if not exists
	if (!existsSync(resolvedScriptPath)) {
		const vbsScript = `
Dim args
Set args = WScript.Arguments

On Error Resume Next

inputFile = args(0)
outputFile = args(1)

Set objWord = CreateObject("Word.Application")
Set objDoc = objWord.Documents.Open(inputFile)

If Err.Number <> 0 Then
    ' Error occurred while opening the file
    WScript.StdOut.WriteLine "Error opening file: " & Err.Description
    objWord.Quit
    WScript.Quit(1)  ' Exit with error code 1
End If

On Error GoTo 0  ' Reset error handling

objDoc.SaveAs2 outputFile, 17 '17 stands for wdFormatPDF
objDoc.Close
objWord.Quit

WScript.StdOut.WriteLine "Conversion successful"
WScript.Quit(0)  ' Exit with success code
`;
		if (!existsSync(path.dirname(resolvedScriptPath)))
			mkdirSync(path.dirname(resolvedScriptPath));
		writeFileSync(resolvedScriptPath, vbsScript, 'utf8');
	}

	const command = `cscript //Nologo "${resolvedScriptPath}" "${docxPath}" "${pdfPath}"`;
	let state: boolean = false;
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
		state = true;
	} catch (error) {
		state = false;
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

async function checkFileTypeAndProceed(
	filePath: string,
	newPDFFilePath: string,
	logger: ConsoleColorLogger
): Promise<boolean | 'Directory' | 'Not Supported' | 'Temp file'> {
	try {
		const allowedFileExtensionsToConvert = ['.docx', '.doc'];
		const isDirectory = statSync(filePath).isDirectory();
		if (isDirectory) {
			await convertAllDocsInFolder(
				filePath,
				logger,
				path.dirname(newPDFFilePath)
			);
			return 'Directory';
		}
		if (
			!allowedFileExtensionsToConvert.includes(
				path.extname(filePath).toLowerCase()
			)
		) {
			logger.log('yellow', [
				`File: ${path.basename(
					filePath
				)} is not supported for conversion to pdf`,
			]);
			return 'Not Supported';
		}
		// Skip temporary Word files
		if (
			path.basename(filePath).startsWith('~$') ||
			path.extname(filePath).toLowerCase() === '.tmp'
		) {
			return 'Temp file';
		}

		if (!existsSync(path.dirname(newPDFFilePath)))
			mkdirSync(path.dirname(newPDFFilePath), { recursive: true });
		const state = await convertDocxToPdf(filePath, newPDFFilePath, logger);
		return state;
	} catch (error) {
		logger.log('red', [error]);
		return false;
	}
}

interface DocumentKey {
	documentPath: string;
	pdfPath: string;
	state: boolean | 'Directory' | 'Not Supported' | 'Temp file';
}

const converted: Map<number, DocumentKey> = new Map();
let iterator: number = 0;
// Function to count states
function countStates(map: Map<number, DocumentKey>) {
	let directoryCount = 0;
	let notSupportedCount = 0;
	let trueCount = 0;
	let falseCount = 0;
	for (const [, value] of map.entries()) {
		switch (value.state) {
			case 'Directory':
				directoryCount++;
				break;
			case 'Not Supported':
				notSupportedCount++;
				break;
			case true:
				trueCount++;
				break;
			case false:
				falseCount++;
				break;
		}
	}
	return { directoryCount, notSupportedCount, trueCount, falseCount };
}
async function convertAllDocsInFolder(
	inputFolder: string,
	logger: ConsoleColorLogger,
	outputFolder: string
): Promise<{
	directoryCount: number;
	notSupportedCount: number;
	trueCount: number;
	falseCount: number;
} | null> {
	try {
		if (!statSync(inputFolder).isDirectory()) {
			// Input is path not directory, treat as a file
			const filePath = inputFolder;
			const pdfPath = path.join(
				outputFolder,
				path.parse(inputFolder).name.trim() + '.pdf'
			);
			const state = await checkFileTypeAndProceed(filePath, pdfPath, logger);
			converted.set(iterator, { documentPath: filePath, pdfPath, state });
			iterator++;
		} else {
			// Input is a directory
			const contents = readdirSync(path.join(inputFolder));
			for (const child of contents) {
				const childPath = path.join(inputFolder, child);
				const pdfPath = path.join(
					outputFolder,
					path.parse(child).name.trim() + '.pdf'
				);

				const state = await checkFileTypeAndProceed(childPath, pdfPath, logger);
				converted.set(iterator, { documentPath: childPath, pdfPath, state });
				iterator++;
			}
		}
		return countStates(converted);
	} catch (error) {
		logger.log('red', [(error as Error).message]);
		return null;
	}
}

export default convertAllDocsInFolder;
