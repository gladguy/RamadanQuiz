import os
from moviepy import VideoFileClip

def batch_convert_webp():
    # 1. Setup Folder
    folder_path = input("Enter the path to the folder: ").strip()
    if not os.path.isdir(folder_path):
        print("Directory not found.")
        return

    # 2. Filter WebP files
    files = sorted([f for f in os.listdir(folder_path) if f.lower().endswith('.webp')])
    if not files:
        print("No .webp files found.")
        return

    print("\nAvailable WebP files:")
    for idx, f in enumerate(files, 1):
        print(f"{idx}. {f}")

    # 3. User Selection
    selection = input("\nEnter numbers (e.g. 1,3,5), a range (1-5), or 'all': ").strip().lower()
    
    to_convert = []
    if selection == 'all':
        to_convert = files
    else:
        try:
            for part in selection.split(','):
                if '-' in part:
                    start, end = map(int, part.split('-'))
                    to_convert.extend(files[start-1:end])
                else:
                    to_convert.append(files[int(part.strip())-1])
        except (ValueError, IndexError):
            print("Invalid selection.")
            return

    # 4. Conversion Loop
    for webp_file in to_convert:
        input_path = os.path.join(folder_path, webp_file)
        # Output to same folder but as .mp4
        output_path = os.path.join(folder_path, os.path.splitext(webp_file)[0] + ".mp4")
        
        print(f"\n>>> Processing: {webp_file}")

        try:
            import imageio
            from moviepy import ImageSequenceClip
            
            # 1. Read all frames using imageio (Pillow-based usually)
            # This is much more reliable for animated WebP than FFmpeg's native decoder
            reader = imageio.get_reader(input_path)
            fps = reader.get_meta_data().get('fps', 25) # Default to 25 if not found
            frames = [frame for frame in reader]
            reader.close()
            
            # 2. Create a clip from the frames
            clip = ImageSequenceClip(frames, fps=fps)
            
            # 3. Write to MP4 (yuv420p for compatibility)
            clip.write_videofile(output_path, codec="libx264", ffmpeg_params=["-pix_fmt", "yuv420p"])
            clip.close()
            
            print(f"Successfully converted to: {os.path.basename(output_path)}")
        except Exception as e:
            print(f"Error converting {webp_file}: {e}")

if __name__ == "__main__":
    batch_convert_webp()