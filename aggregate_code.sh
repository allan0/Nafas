#!/bin/bash

# Define the output file
OUTPUT_FILE="nafas_full_codebase.txt"

# Clear the output file if it already exists
> "$OUTPUT_FILE"

echo "Aggregating code from Nafas Project into $OUTPUT_FILE..."
echo "Generated on: $(date)" >> "$OUTPUT_FILE"
echo "===============================================" >> "$OUTPUT_FILE"

# Use find to get all relevant files, excluding heavy/binary directories
find . -maxdepth 5 \
    -not -path "*/.*" \
    -not -path "*node_modules*" \
    -not -path "*venv*" \
    -not -path "*__pycache__*" \
    -not -path "*package-lock.json*" \
    -not -path "*.png" \
    -not -path "*.jpg" \
    -not -path "*.ico" \
    -not -path "*dist*" \
    -not -path "*.next*" \
    -type f \( -name "*.py" -o -name "*.sol" -o -name "*.ts" -o -name "*.tsx" -o -name "*.json" -o -name "*.md" -o -name "*.yml" -o -name "requirements.txt" \) \
    | while read -r file; do
        echo "Adding: $file"
        echo "---------------------------------------------------------" >> "$OUTPUT_FILE"
        echo "FILE PATH: $file" >> "$OUTPUT_FILE"
        echo "---------------------------------------------------------" >> "$OUTPUT_FILE"
        cat "$file" >> "$OUTPUT_FILE"
        echo -e "\n\n" >> "$OUTPUT_FILE"
    done

echo "==============================================="
echo "Done! All code is saved in: $OUTPUT_FILE"
echo "Total lines: $(wc -l < "$OUTPUT_FILE")"
