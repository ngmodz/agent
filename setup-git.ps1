# PowerShell script to set up Git repository and push to GitHub

# Check if Git is already initialized
if (-not (Test-Path -Path ".git")) {
    Write-Host "Initializing Git repository..."
    git init
} else {
    Write-Host "Git repository already initialized."
}

# Add all files to Git
Write-Host "Adding files to Git..."
git add .

# Check if remote origin already exists
$remotes = git remote
if ($remotes -contains "origin") {
    Write-Host "Remote 'origin' already exists. Removing it..."
    git remote remove origin
}

# Add the new remote origin
Write-Host "Adding remote origin..."
git remote add origin https://github.com/ngmodz/agent.git

# Commit changes
Write-Host "Committing changes..."
git commit -m "Initial commit"

# Push to GitHub
Write-Host "Pushing to GitHub..."
git push -u origin main

Write-Host "Done!"
