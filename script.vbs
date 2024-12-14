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
