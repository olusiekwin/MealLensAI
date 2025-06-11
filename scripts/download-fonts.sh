#!/bin/bash

# Create fonts directory if it doesn't exist
mkdir -p ../assets/fonts

# Download Inter font files
echo "Downloading Inter font files..."

# Regular
curl -L "https://fonts.google.com/download?family=Inter" -o inter.zip
unzip -j inter.zip "static/Inter-Regular.ttf" -d ../assets/fonts/

# Medium
unzip -j inter.zip "static/Inter-Medium.ttf" -d ../assets/fonts/

# SemiBold
unzip -j inter.zip "static/Inter-SemiBold.ttf" -d ../assets/fonts/

# Bold
unzip -j inter.zip "static/Inter-Bold.ttf" -d ../assets/fonts/

# Clean up
rm inter.zip

echo "Font files downloaded successfully!" 