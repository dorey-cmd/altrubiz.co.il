import base64
from PIL import Image

def generate_favicons():
    # Load master transparent image
    master = Image.open('public/favicon.png')

    # 1. Favicon 32x32
    fav32 = master.resize((32, 32), Image.Resampling.LANCZOS)
    fav32.save('public/favicon-32x32.png', 'PNG')

    # 2. Favicon 16x16
    fav16 = master.resize((16, 16), Image.Resampling.LANCZOS)
    fav16.save('public/favicon-16x16.png', 'PNG')

    # 3. Favicon 48x48
    fav48 = master.resize((48, 48), Image.Resampling.LANCZOS)
    fav48.save('public/favicon-48x48.png', 'PNG')

    # 4. Apple Touch Icon 180x180
    apple_touch = master.resize((180, 180), Image.Resampling.LANCZOS)
    apple_touch.save('public/apple-touch-icon.png', 'PNG')

    # 5. Multi-size ICO
    master.save('public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])

    # 6. SVG wrapping high-res PNG
    fav256 = master.resize((256, 256), Image.Resampling.LANCZOS)
    fav256.save('public/favicon-256.png', 'PNG')
    with open('public/favicon-256.png', 'rb') as f:
        b64_png = base64.b64encode(f.read()).decode('utf-8')

    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <image href="data:image/png;base64,{b64_png}" x="0" y="0" width="256" height="256" />
</svg>
'''
    with open('public/favicon.svg', 'w', encoding='utf-8') as f:
        f.write(svg_content)

    print('All favicon assets generated successfully!')

if __name__ == '__main__':
    generate_favicons()
