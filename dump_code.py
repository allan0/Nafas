import os

# Configuration
OUTPUT_FILE = "project_code_dump.txt"
# Folders to skip
IGNORE_DIRS = {'.git', 'node_modules', '.next', 'dist', 'build', '__pycache__', 'venv', '.vercel'}
# File extensions to include
ALLOWED_EXTENSIONS = {'.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.html', '.md', '.py', '.sol', '.yml', '.yaml', '.mjs'}

def dump_code():
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as outfile:
        for root, dirs, files in os.walk('.'):
            # Skip ignored directories
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
            
            for file in files:
                if any(file.endswith(ext) for ext in ALLOWED_EXTENSIONS):
                    file_path = os.path.join(root, file)
                    
                    # Write a header for the file
                    outfile.write(f"\n\n{'='*80}\n")
                    outfile.write(f" FILE: {file_path}\n")
                    outfile.write(f"{'='*80}\n\n")
                    
                    try:
                        with open(file_path, 'r', encoding='utf-8') as infile:
                            outfile.write(infile.read())
                    except Exception as e:
                        outfile.write(f"--- Error reading file: {e} ---")

    print(f"Done! All code dumped to {OUTPUT_FILE}")

if __name__ == "__main__":
    dump_code()
