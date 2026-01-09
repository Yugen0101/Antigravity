$oldName = "Script GO - AI"
$newName = "script-go-ai"
$parentDir = "C:\Users\YUGEN\Videos\AI Intern\Antigravity Google"

if (Test-Path "$parentDir\$oldName") {
    Write-Host "Renaming $oldName to $newName..."
    Rename-Item -Path "$parentDir\$oldName" -NewName "$newName" -ErrorAction Stop
    Write-Host "Successfully renamed. Please reopen the 'script-go-ai' folder in your IDE."
} else {
    Write-Host "Folder '$oldName' not found. It might have been renamed already."
}
