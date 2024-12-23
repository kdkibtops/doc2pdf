# convert-doc-to-pdf

## Description

convert-doc-to-pdf is a Node.js-based application that recursively converts all .doc and .docx files in a specified folder and its subdirectories to PDF.
The application ensures all Microsoft Word instances are terminated before the conversion process starts, and provides detailed logging throughout the process.
This package tested only on Windows OS, not yet tested on Linux or MacOS

## Features

1. Recursively converts .doc and .docx files to PDF

2. Handles subdirectories

3. Terminates all running Microsoft Word instances before starting the conversion

4. Provides detailed logging with timestamps and process times

5. Skips temporary Word files to avoid errors

## Requirements

1. Node.js(v14 or higher)

2. npm (Node Package Manager)

3. Microsoft Word (for the VBScript to interact with)

4. Windows OS (Not tested on Linux or MacOS)

## Installation

### Globally:

- Install globally if you plan to use it directly from Command line:

```sh
npm install -g convert-doc-to-pdf
```

### Locally:

- Install locally to a project to use it within your project:

```sh
npm install convert-doc-to-pdf
```

### Executable

- You can create executable file (.exe) to use it from any place on your local directory or other devices, in package.json => pkg => targets keep the target OS for your executable file and remove others, then run the following command:

```sh
npm run pack
```

- .exe file will be created in the root directory,use the .exe file any place you want from the command line as follow:

```sh
convert-doc-to-pdf --input "path/to/input/folder" --output "path/to/output/folder" --log-level debug
```

## Usage

### Usage from command-line:

- From command line run:

```sh
node build/index.js --input "path/to/input/folder" --output "path/to/output/folder" --log-level debug
```

###

```ts
import convert2PDF from 'convert-doc-to-pdf';

async () => {
	const result = await convert2PDF(
		false,
		true,
		'path-to-input-folder',
		'path-to-output-folder',
		'<log-level> (default "info")',
		'path-to-log-file(default"Output folder")'
	);
};
```

## Command-line options:

- --input, -i: Input directory path (required)

- --output, -o: Output directory path (default: ./exported)

- --log-level, -ll: Log level (info, debug, warn; default: info)

- --log-file, -lf: Log file path (default: ./convert-<timestamp>.log)

### Example

```sh
node build/index.js --input "C:\path\to\input\folder" --output "C:\path\to\output\folder" --log-level debug --log-file "./logs/convert.log"
```

## Project Structure

convert-doc-to-pdf/
├── build/
│ ├── index.js
│ ├── convertDocToPdf.js
├── src/
│ ├── script.vbs
├── package.json
├── README.md
├── tsconfig.json

## Logging

The application provides detailed logs with timestamps and process times. Logs can be saved to a file or printed to the console.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the ISC License.

## Author

Mustafa Heidar

## Repository

You can find the GitHub repository for this project at: [convert-doc-to-pdf] (https://github.com/kdkibtops/doc2pdf.git)

## Changelog

### v1.0.1

- Minor fixes in the code and Readme.MD file.

### v1.0.2

- Updated dependencies to the latest versions.
- Fixed issues with logging to console and file.
- Improved error handling during the conversion process.
- Fixed output directory structure, now all created filed are grouped into one directory without any subdirectories.
- Fixed issue with created files extension, now original file extension is removed from the file name.

### v1.0.3 (Still working on it)

<span style="color:green">[x]</span> Now, VBS script will be created by the application if not exists, in case the app is running from pkg, the created temp_script.vbs will be removed once finished, however if app is running from node the created script will remain in the assets folder.
<span style="color:yellow">[ ]</span> Manage log levels accordingly.
<span style="color:yellow">[ ]</span> Quiet and no logging mode feature.
