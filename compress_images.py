import os
from PIL import Image

dir_path = 'public/images'

for filename in os.listdir(dir_path):
    if filename.endswith('.webp'):
        filepath = os.path.join(dir_path, filename)
        try:
            with Image.open(filepath) as img:
                img.thumbnail((800, 800))
                img.save(filepath, 'webp', quality=60)
                print(f"Compressed {filename}")
        except Exception as e:
            print(f"Error compressing {filename}: {e}")
