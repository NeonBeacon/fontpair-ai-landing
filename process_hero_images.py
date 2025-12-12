import os
from PIL import Image

# Define source and destination
SOURCE_DIR = r"f:\Coding projects\Font-Pair-AI-webpage\assets\new hero section"
DEST_DIR = r"f:\Coding projects\Font-Pair-AI-webpage\assets"

# Map source filenames to new optimized filenames and max widths
MAPPING = {
    "landing page hero section table2.png": ("hero-bg-new.webp", 1920),
    "tablet.png": ("tablet-new.webp", 800),
    "coffee mug.png": ("coffee-new.webp", 400),
    "eraser.png": ("eraser-new.webp", 300),
    "kerning post-it.png": ("postit-kerning.webp", 400),
    "serif post-it.png": ("postit-serif.webp", 400),
    "x-height post-it.png": ("postit-xheight.webp", 400),
    "penicl and shaving.png": ("pencil-new.webp", 800)
}

def process_images():
    if not os.path.exists(DEST_DIR):
        os.makedirs(DEST_DIR)

    for src_name, (dest_name, max_width) in MAPPING.items():
        src_path = os.path.join(SOURCE_DIR, src_name)
        dest_path = os.path.join(DEST_DIR, dest_name)

        if not os.path.exists(src_path):
            print(f"Skipping {src_name}: Source not found")
            continue

        try:
            with Image.open(src_path) as img:
                # Calculate new height to maintain aspect ratio
                width_percent = (max_width / float(img.size[0]))
                if width_percent < 1: # Only resize if smaller
                    h_size = int((float(img.size[1]) * float(width_percent)))
                    img = img.resize((max_width, h_size), Image.Resampling.LANCZOS)
                
                img.save(dest_path, "WEBP", quality=85)
                print(f"Processed {src_name} -> {dest_name}")
        except Exception as e:
            print(f"Error processing {src_name}: {e}")

if __name__ == "__main__":
    try:
        import PIL
        process_images()
    except ImportError:
        print("Pillow not installed")
