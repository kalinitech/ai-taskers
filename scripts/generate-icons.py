#!/usr/bin/env python3
"""Generate PWA icons (PNG) for AI Taskers platform using Pillow."""
from PIL import Image, ImageDraw, ImageFont
import os

OUTPUT_DIR = "/home/z/my-project/public/icons"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Brand gradient colors (violet -> fuchsia -> amber)
COLORS = [
    (139, 92, 246),   # violet-500
    (217, 70, 239),   # fuchsia-500
    (245, 158, 11),   # amber-500
]

def make_gradient(size, colors):
    """Create a diagonal gradient."""
    img = Image.new('RGB', (size, size), colors[0])
    pixels = img.load()
    for y in range(size):
        for x in range(size):
            t = (x + y) / (2 * size)
            if t < 0.5:
                # Interpolate colors[0] -> colors[1]
                tt = t * 2
                r = int(colors[0][0] * (1 - tt) + colors[1][0] * tt)
                g = int(colors[0][1] * (1 - tt) + colors[1][1] * tt)
                b = int(colors[0][2] * (1 - tt) + colors[1][2] * tt)
            else:
                tt = (t - 0.5) * 2
                r = int(colors[1][0] * (1 - tt) + colors[2][0] * tt)
                g = int(colors[1][1] * (1 - tt) + colors[2][1] * tt)
                b = int(colors[1][2] * (1 - tt) + colors[2][2] * tt)
            pixels[x, y] = (r, g, b)
    return img

def add_text(img, size, text="AI"):
    """Add 'AI' text in the center."""
    draw = ImageDraw.Draw(img)
    # Try to load a bold font
    font_paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf",
    ]
    font = None
    font_size = int(size * 0.45)
    for fp in font_paths:
        if os.path.exists(fp):
            try:
                font = ImageFont.truetype(fp, font_size)
                break
            except Exception:
                continue
    if font is None:
        font = ImageFont.load_default()
    # Get text bbox
    try:
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
    except Exception:
        text_width = font_size
        text_height = font_size
    x = (size - text_width) // 2
    y = (size - text_height) // 2 - int(size * 0.05)
    # Draw white text with subtle shadow
    draw.text((x + 2, y + 2), text, fill=(0, 0, 0, 80), font=font)
    draw.text((x, y), text, fill=(255, 255, 255), font=font)
    return img

def add_maskable_padding(img, size):
    """Add white padding for maskable icon (safe zone)."""
    padded = Image.new('RGB', (size, size), (255, 255, 255))
    # Scale the gradient to 80% size and center it
    inner_size = int(size * 0.8)
    inner = img.resize((inner_size, inner_size), Image.LANCZOS)
    offset = (size - inner_size) // 2
    padded.paste(inner, (offset, offset))
    return padded

# Generate icons
for size in [192, 512]:
    print(f"Generating {size}x{size} icon...")
    base = make_gradient(size, COLORS)
    icon = add_text(base.copy(), size, "AI")
    icon.save(os.path.join(OUTPUT_DIR, f"icon-{size}.png"), "PNG")
    # Maskable version
    maskable = add_maskable_padding(icon.copy(), size)
    maskable.save(os.path.join(OUTPUT_DIR, f"icon-maskable-{size}.png"), "PNG")

# Apple touch icon (180x180)
print("Generating Apple touch icon...")
apple = make_gradient(180, COLORS)
apple = add_text(apple, 180, "AI")
apple.save(os.path.join(OUTPUT_DIR, "apple-touch-icon.png"), "PNG")

# Favicon (32x32)
print("Generating favicon...")
fav = make_gradient(32, COLORS)
fav = add_text(fav, 32, "AI")
fav.save(os.path.join(OUTPUT_DIR, "favicon-32.png"), "PNG")

# Also save as favicon.ico
fav_big = make_gradient(256, COLORS)
fav_big = add_text(fav_big, 256, "AI")
fav_big.save("/home/z/my-project/public/favicon.ico", format="ICO", sizes=[(256, 256), (64, 64), (32, 32), (16, 16)])

print(f"✓ All icons generated in {OUTPUT_DIR}")
print(f"  Files: {os.listdir(OUTPUT_DIR)}")
