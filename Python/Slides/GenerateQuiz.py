import os
import re
from docx import Document

def convert_juzz_to_quiz_ts(input_file):
    # Load the document
    try:
        doc = Document(input_file)
    except Exception as e:
        print(f"Error loading {input_file}: {e}")
        return

    # Extract all text
    full_text = "\n".join([para.text for para in doc.paragraphs if para.text.strip()])
    
    # Locate the start of the quiz content after "Quiz (MCQ)"
    start_marker = "Quiz (MCQ)"
    if start_marker in full_text:
        quiz_body = full_text.split(start_marker)[1].strip()
    else:
        quiz_body = full_text.strip()

    # Extract Juzz number from filename (e.g., Juzz-1.docx -> 1)
    juzz_match = re.search(r'Juzz-(\d+)', input_file)
    juzz_num = juzz_match.group(1) if juzz_match else "X"
    
    # Mapping Tamil options to English letters
    option_map = {
        'அ)': 'A)',
        'ஆ)': 'B)',
        'இ)': 'C)',
        'ஈ)': 'D)'
    }
    
    # 1. Replace Tamil options with A), B), C), D)
    processed_text = quiz_body
    for tam, eng in option_map.items():
        processed_text = processed_text.replace(tam, eng)
    
    # 2. Escape parentheses for TypeScript template strings (e.g., \(MCQ\))
    # This matches the style in Day7Slides.ts
    escaped_text = processed_text.replace('(', r'\(').replace(')', r'\)')
    
    # 3. Clean up line breaks to maintain a clean string block
    content_lines = [line.strip() for line in escaped_text.split('\n') if line.strip()]
    final_content = "\\n".join(content_lines)

    # TypeScript Template generation
    ts_template = f"""import {{ Slide }} from '../types/slide';

export const getMockQuizForDay{juzz_num} = (): Slide[] => {{
    return [
        {{
            id: 'quiz-juzz-{juzz_num}',
            dayNumber: {juzz_num},
            title: `பயிற்சி வினாக்கள் \\(MCQ\\)`,
            content: `{final_content}`,
            order: 1
        }},
    ];
}};
"""
    
    # Save to Quiz-x.ts
    output_filename = f"Quiz-{juzz_num}.ts"
    with open(output_filename, 'w', encoding='utf-8') as f:
        f.write(ts_template)
    print(f"Converted {input_file} -> {output_filename}")

# Run for all matching files in the directory
for filename in os.listdir('.'):
    if filename.startswith("Juzz-") and filename.endswith(".docx"):
        convert_juzz_to_quiz_ts(filename)