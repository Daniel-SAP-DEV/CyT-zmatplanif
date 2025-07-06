# Build script for GitHub Pages deployment
Write-Host "Building UI5 application for GitHub Pages..." -ForegroundColor Green

# Create dist directory
if (Test-Path "dist") {
    Remove-Item "dist" -Recurse -Force
}
New-Item -ItemType Directory -Path "dist" -Force

# Copy webapp files
Copy-Item "app\materialmannager\webapp\*" -Destination "dist\" -Recurse -Force

# Rename index-standalone.html to index.html
if (Test-Path "dist\index-standalone.html") {
    if (Test-Path "dist\index.html") {
        Remove-Item "dist\index.html" -Force
    }
    Rename-Item "dist\index-standalone.html" "index.html"
}

Write-Host "Build completed! Files are in the 'dist' directory." -ForegroundColor Green
Write-Host "To test locally, run: cd dist && python -m http.server 8080" -ForegroundColor Yellow
