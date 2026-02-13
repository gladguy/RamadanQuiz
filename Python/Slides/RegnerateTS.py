import os
import glob
import re
from docx import Document

def extract_slides_from_docx(file_path):
    """Parses the docx and returns a list of slide dictionaries."""
    doc = Document(file_path)
    slides = []
    current_slide = None
    
    # Extract day number from filename (e.g., Juzz-3.docx -> 3)
    match = re.search(r'Juzz-(\d+)', file_path)
    day_num = int(match.group(1)) if match else 0

    for para in doc.paragraphs:
        text = para.text.strip()
        if not text:
            continue
            
        # Matches "ஸ்லைடு X:" or "Slide X:"
        if text.startswith("ஸ்லைடு") or text.lower().startswith("slide"):
            if current_slide:
                slides.append(current_slide)
            
            parts = text.split(":", 1)
            title = parts[1].strip() if len(parts) > 1 else text
            
            current_slide = {
                "dayNumber": day_num,
                "title": title,
                "content": "",
                "order": len(slides) + 1
            }
        elif current_slide:
            # Append text to content; clean up extra spaces
            if current_slide["content"]:
                current_slide["content"] += " " + text
            else:
                current_slide["content"] = text

    if current_slide:
        slides.append(current_slide)
    return slides

def write_ts_file(slides, day_number):
    """Writes the extracted slides into the TypeScript format."""
    file_name = f"Day{day_number}Slides.ts"
    
    with open(file_name, "w", encoding="utf-8") as f:
        f.write("import { Slide } from '../types/slide';\n\n")
        f.write(f"export const getMockSlidesForDay{day_number} = (): Slide[] => {{\n")
        f.write("    return [\n")
        
        for s in slides:
            f.write("        {\n")
            f.write(f"            id: 'slide{s['order']}',\n")
            f.write(f"            dayNumber: {s['dayNumber']},\n")
            
            # Using template literals (backticks) to handle single/double quotes and newlines
            # Escaping backticks, ${, and parentheses as requested by user
            clean_title = s['title'].replace("`", "\\`").replace("${", "\\${").replace("(", "\\(").replace(")", "\\)").replace("\n", " ").strip()
            clean_content = s['content'].replace("`", "\\`").replace("${", "\\${").replace("(", "\\(").replace(")", "\\)").replace("\n", " ").strip()
            
            f.write(f"            title: `{clean_title}`,\n")
            f.write(f"            content: `{clean_content}`,\n")
            f.write(f"            order: {s['order']}\n")
            f.write("        },\n")
            
        f.write("    ];\n")
        f.write("};\n")
    print(f"Generated: {file_name}")

def main():
    # Find all Juzz-x.docx files
    docx_files = glob.glob("Juzz-*.docx")
    
    if not docx_files:
        print("No Juzz-x.docx files found in the current directory.")
        return

    for file_path in docx_files:
        # Get the Juzz number for the day mapping
        match = re.search(r'Juzz-(\d+)', file_path)
        if match:
            day_val = int(match.group(1))
            extracted_data = extract_slides_from_docx(file_path)
            if extracted_data:
                write_ts_file(extracted_data, day_val)

if __name__ == "__main__":
    main()