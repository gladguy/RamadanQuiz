import os
import re
from pypdf import PdfReader, PdfWriter

def auto_split_juz():
    # Show exactly where the script is looking
    current_dir = os.getcwd()
    print(f"DEBUG: Script is currently looking in: {current_dir}")

    output_folder = "Juzz"
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Improved file detection (handles .PDF and .pdf)
    files = [f for f in os.listdir('.') if f.lower().endswith('.pdf')]
    
    if not files:
        print("❌ No PDF files found! Move your PDF into the folder listed above.")
        return

    print("\n--- PDF Files Found ---")
    for i, filename in enumerate(files, 1):
        print(f"{i}. {filename}")

    try:
        file_choice = int(input("\nSelect the file number: "))
        selected_file = files[file_choice - 1]
        reader = PdfReader(selected_file)
        
        current_writer = None
        current_juz_num = None

        print(f"Scanning {len(reader.pages)} pages...")

        for pg_index in range(len(reader.pages)):
            page = reader.pages[pg_index]
            text = page.extract_text() or "" # Handle empty pages

            # Updated regex to be more flexible for "Juz' 4" or "Juz 4"
            match = re.search(r"JuzÕ?\s*(\d+)", text, re.IGNORECASE)

            if match:
                new_juz_num = match.group(1)
                
                if new_juz_num != current_juz_num:
                    if current_writer:
                        save_juz(current_writer, current_juz_num, output_folder)
                    
                    print(f"➜ Starting Juz' {new_juz_num} at page {pg_index + 1}")
                    current_writer = PdfWriter()
                    current_juz_num = new_juz_num

            if current_writer:
                current_writer.add_page(page)

        if current_writer:
            save_juz(current_writer, current_juz_num, output_folder)

        print(f"\n✅ Success! Check the '{output_folder}' folder.")

    except Exception as e:
        print(f"Error: {e}")

def save_juz(writer, num, folder):
    output_path = os.path.join(folder, f"Juzz-{num}.pdf")
    with open(output_path, "wb") as f:
        writer.write(f)

if __name__ == "__main__":
    auto_split_juz()