import os
import re

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # We want to replace <img ... /> with <img width="800" height="600" ... /> if width is not present
    # but let's be more intelligent if we see aspect-[2/3] or aspect-[9/16] or similar in the same line or context.
    # A simple approach: just add width="800" height="600" right after <img if width= is not there.
    # The Tailwind classes will override the visual size, but this gives a fallback intrinsic size.
    
    def replacer(match):
        img_tag = match.group(0)
        if 'width=' in img_tag:
            return img_tag
        
        # default
        w = 800
        h = 600
        
        if 'aspect-[2/3]' in img_tag or 'aspect-[2/3]' in content:
             # Just a rough guess, let's look at the line
             pass
             
        # we'll just inject width and height.
        return img_tag.replace('<img ', '<img width="800" height="600" ')
        
    new_content = re.sub(r'<img\s+[^>]*>', replacer, content)
    
    # special cases
    new_content = new_content.replace('width="800" height="600" src={`https://picsum.photos/seed/${design.id}-1/400/711`}', 'width="400" height="711" src={`https://picsum.photos/seed/${design.id}-1/400/711`}')
    new_content = new_content.replace('width="800" height="600" src={`https://picsum.photos/seed/${design.id}-2/400/711`}', 'width="400" height="711" src={`https://picsum.photos/seed/${design.id}-2/400/711`}')
    new_content = new_content.replace('width="800" height="600" src={`https://picsum.photos/seed/${design.id}-3/400/711`}', 'width="400" height="711" src={`https://picsum.photos/seed/${design.id}-3/400/711`}')
    new_content = new_content.replace('width="800" height="600" src={`https://picsum.photos/seed/${design.id}-4/400/711`}', 'width="400" height="711" src={`https://picsum.photos/seed/${design.id}-4/400/711`}')
    new_content = new_content.replace('className="w-24 h-24 md:w-28 md:h-28', 'width="112" height="112" className="w-24 h-24 md:w-28 md:h-28')

    with open(filepath, 'w') as f:
        f.write(new_content)

for root, _, files in os.walk('components'):
    for file in files:
        if file.endswith('.tsx'):
            fix_file(os.path.join(root, file))

