import os
from pypdf import PdfReader, PdfWriter

def split_pdf_interactive():
    output_folder = "Juzz"
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    files = [f for f in os.listdir('.') if f.lower().endswith('.pdf')]
    
    if not files:
        print("No PDF files found!")
        return

    print("\n--- PDF File Selection ---")
    for i, filename in enumerate(files, 1):
        print(f"{i}. {filename}")

    try:
        # 1. Select File
        file_choice = int(input("\nSelect file number: "))
        selected_file = files[file_choice - 1]
        
        reader = PdfReader(selected_file)
        total_pages = len(reader.pages)
        print(f"Selected: {selected_file} ({total_pages} pages)")

        # 2. Page Details
        from_page = int(input("Enter 'From' page number: "))
        to_page = int(input("Enter 'To' page number: "))
        
        # 3. New Question: Sequential or Alternating
        print("\nHow should pages be collected?")
        print("1. Sequential (1, 2, 3...)")
        print("2. Alternative/Skip (1, 3, 5...)")
        mode_choice = int(input("Select mode (1 or 2): "))
        
        # Determine the step based on user choice
        step = 2 if mode_choice == 2 else 1

        new_name_num = input("Enter new file number (for 'Juzz-<number>.pdf'): ")

        # 4. Perform the split
        if 1 <= from_page <= to_page <= total_pages:
            writer = PdfWriter()
            
            # Using the dynamic step: 1 for sequential, 2 for skipping
            for pg in range(from_page - 1, to_page, step):
                writer.add_page(reader.pages[pg])
            
            new_filename = f"Juzz-{new_name_num}.pdf"
            output_path = os.path.join(output_folder, new_filename)
            
            with open(output_path, "wb") as f:
                writer.write(f)
            
            mode_text = "Alternating" if step == 2 else "Sequential"
            print(f"\nSuccess! [{mode_text}] File saved as: {output_path}")
        else:
            print("\nError: Invalid page range.")

    except (ValueError, IndexError):
        print("\nError: Please enter valid numbers.")

if __name__ == "__main__":
    split_pdf_interactive()