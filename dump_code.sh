#!/bin/bash

# Configuration
OUTPUT_FILE="project_code_dump.txt"

# Clear the output file if it exists
> "$OUTPUT_FILE"

echo "Starting code dump into $OUTPUT_FILE..."

# Find all files with allowed extensions, excluding the ignore directories
# Allowed: .ts, .tsx, .js, .jsx, .json, .css, .html, .md, .py, .sol, .yml, .yaml, .mjs
# Ignored: .git, node_modules, .next, dist, build, __pycache__, venv, .vercel, .git
find . -maxdepth 10 \
    -not -path '*/.*' \
    -not -path '*node_modules*' \
    -not -path '*venv*' \
    -not -path '*.next*' \
    -not -path '*dist*' \
    -not -path '*build*' \
    -not -path '*__pycache__*' \
    -type f \( \
        -name "*.ts" -o \
        -name "*.tsx" -o \
        -name "*.js" -o \
        -name "*.jsx" -o \
        -name "*.json" -o \
        -name "*.css" -o \
        -name "*.html" -o \
        -name "*.md" -o \
        -name "*.py" -o \
        -name "*.sol" -o \
        -name "*.yml" -o \
        -name "*.yaml" -o \
        -name "*.mjs" \
    \) | while read -r file; do

    # Skip the output file itself and the script itself
    if [[ "$file" == "./$OUTPUT_FILE" ]] || [[ "$file" == "./dump_code.sh" ]]; then
        continue
    fi

    echo "Adding: $file"
    
    # Write Header
    echo -e "\n\n================================================================================" >> "$OUTPUT_FILE"
    echo " FILE: $file" >> "$OUTPUT_FILE"
    echo -e "================================================================================\n" >> "$OUTPUT_FILE"
    
    # Append file content
    cat "$file" >> "$OUTPUT_FILE"
    
    # Add spacing
    echo -e "\n" >> "$OUTPUT_FILE"
done

echo "================================================================================"
echo "Done! All code aggregated into $OUTPUT_FILE"
echo "Total lines: $(wc -l < "$OUTPUT_FILE")"
