# ConvertFolderDocs2PDF

## Description

ConvertFolderDocs2PDF is a Node.js-based application that recursively converts all `.doc` and `.docx` files in a specified folder and its subdirectories to PDF. The application ensures all Microsoft Word instances are terminated before the conversion process starts, and provides detailed logging throughout the process.

## Features

- Recursively converts `.doc` and `.docx` files to PDF
- Handles subdirectories
- Terminates all running Microsoft Word instances before starting the conversion
- Provides detailed logging with timestamps and process times
- Skips temporary Word files to avoid errors

## Requirements

- Node.js (v14 or higher)
- npm (Node Package Manager)
- Microsoft Word (for the VBScript to interact with)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/kdkibtops/docs2pdf.git
   ```
