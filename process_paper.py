from PIL import Image
import os

def process_image():
    source_path = r"f:\Coding projects\Font-Pair-AI-webpage\assets\new hero section\Paperwith-A.png"
    dest_path = r"f:\Coding projects\Font-Pair-AI-webpage\assets\paper-a-new.webp"
    
    try:
        with Image.open(source_path) as img:
            # Resize if too huge (it's 5MB+, likely 4k+)
            # Keep it relatively large as it's the focal point
            max_width = 1200
            if img.width > max_width:
                ratio = max_width / img.width
                new_size = (max_width, int(img.height * ratio))
                img = img.resize(new_size, Image.Resampling.LANCZOS)
            
            img.save(dest_path, "WEBP", quality=90)
            print(f"Successfully processed {source_path} to {dest_path}")
            
    except Exception as e:
        print(f"Error processing {source_path}: {e}")

if __name__ == "__main__":
    process_image()
