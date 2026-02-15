import imageio
import sys

try:
    reader = imageio.get_reader(sys.argv[1])
    print(f"Frames: {len(reader)}")
    for i, im in enumerate(reader):
        if i > 5: break
        print(f"Frame {i} shape: {im.shape}")
except Exception as e:
    print(f"Error: {e}")
