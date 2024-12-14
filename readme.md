# ConvertFolderDocs2PDF

## Description

ConvertFolderDocs2PDF is a Node.js-based application that recursively converts all .doc and .docx files in a specified folder and its subdirectories to PDF.
The application ensures all Microsoft Word instances are terminated before the conversion process starts, and provides detailed logging throughout the process.

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

## Installation

1. Clone the repository: git clone https://github.com/kdkibtops/docs2pdf.git

2. Navigate to the project directory: cd docs2pdf

3. Install the dependencies: npm install

## Usage

1. Build the project: `sh npm run build `

2. Run the project: `sh node build/index.js --input "path/to/input/folder" --output "path/to/output/folder" --log-level debug`

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

ConvertFolderDocs2PDF/
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

You can find the GitHub repository for this project at: [ConvertFolderDocs2PDF] (https://github.com/kdkibtops/doc2pdf.git)
