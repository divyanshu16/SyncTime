#!/usr/bin/env python3
"""
Generate icon16.png, icon48.png, icon128.png for SyncTime.
No external dependencies — uses only stdlib struct + zlib.
Icon: purple circle with a clock face (hour/minute hands).
"""
import struct, zlib, math, os

# Brand purple #5856d6
BG   = (0x58, 0x56, 0xd6, 255)   # purple fill
FACE = (255, 255, 255, 255)        # white clock face
HAND = (255, 255, 255, 255)        # white hands
RIM  = (255, 255, 255, 180)        # semi-white rim

def lerp(a, b, t):
    return a + (b - a) * t

def blend(base, over):
    """Alpha-composite over on top of base (both RGBA tuples)."""
    ao = over[3] / 255.0
    ab = base[3] / 255.0
    ar = ao + ab * (1 - ao)
    if ar == 0:
        return (0, 0, 0, 0)
    r = int((over[0]*ao + base[0]*ab*(1-ao)) / ar)
    g = int((over[1]*ao + base[1]*ab*(1-ao)) / ar)
    b = int((over[2]*ao + base[2]*ab*(1-ao)) / ar)
    return (r, g, b, int(ar * 255))

def aa_circle_alpha(cx, cy, r, px, py, feather=1.0):
    """Anti-aliased coverage for a filled circle."""
    dist = math.sqrt((px - cx)**2 + (py - cy)**2)
    return max(0.0, min(1.0, (r - dist + feather) / feather))

def aa_ring_alpha(cx, cy, r, w, px, py, feather=0.7):
    """Anti-aliased ring of radius r and width w."""
    dist = math.sqrt((px - cx)**2 + (py - cy)**2)
    inner = r - w / 2
    outer = r + w / 2
    a_outer = max(0.0, min(1.0, (outer - dist + feather) / feather))
    a_inner = max(0.0, min(1.0, (dist - inner + feather) / feather))
    return a_outer * a_inner

def capsule_alpha(x1, y1, x2, y2, radius, px, py, feather=0.7):
    """Signed distance to a capsule (line segment + end caps)."""
    dx, dy = x2 - x1, y2 - y1
    length = math.sqrt(dx*dx + dy*dy)
    if length == 0:
        return aa_circle_alpha(x1, y1, radius, px, py, feather)
    # Project px,py onto segment
    t = max(0.0, min(1.0, ((px-x1)*dx + (py-y1)*dy) / (length*length)))
    nx, ny = x1 + t*dx, y1 + t*dy
    dist = math.sqrt((px-nx)**2 + (py-ny)**2)
    return max(0.0, min(1.0, (radius - dist + feather) / feather))

def make_icon(size):
    """Render the SyncTime icon at given pixel size. Returns list of RGBA tuples."""
    pixels = [(0, 0, 0, 0)] * (size * size)
    cx = cy = (size - 1) / 2.0
    outer_r = size * 0.46
    rim_w   = max(1.0, size * 0.04)

    # Clock face inner radius (slightly inside rim)
    face_r  = outer_r - rim_w * 0.5

    # Hand proportions
    hour_len  = face_r * 0.45
    min_len   = face_r * 0.65
    hand_w    = max(0.7, size * 0.045)
    center_r  = max(0.8, size * 0.055)

    # Clock showing ~10:10 (classic "happy clock" position)
    hour_angle = math.radians(-60)   # 10 o'clock (from 12, clockwise positive)
    min_angle  = math.radians(60)    # 2 o'clock position

    hx = cx + math.sin(hour_angle) * hour_len
    hy = cy - math.cos(hour_angle) * hour_len
    mx = cx + math.sin(min_angle) * min_len
    my = cy - math.cos(min_angle) * min_len

    for py_i in range(size):
        for px_i in range(size):
            px = px_i + 0.5
            py = py_i + 0.5

            # Background circle (purple)
            a_bg = aa_circle_alpha(cx, cy, outer_r, px, py, feather=0.9)
            col = (BG[0], BG[1], BG[2], int(BG[3] * a_bg))

            # White rim ring
            a_rim = aa_ring_alpha(cx, cy, outer_r - rim_w*0.5, rim_w, px, py, feather=0.6)
            if a_rim > 0:
                overlay = (RIM[0], RIM[1], RIM[2], int(RIM[3] * a_rim))
                col = blend(col, overlay)

            # Hour hand
            if a_bg > 0:
                a_h = capsule_alpha(cx, cy, hx, hy, hand_w, px, py, feather=0.6)
                if a_h > 0:
                    overlay = (HAND[0], HAND[1], HAND[2], int(255 * a_h))
                    col = blend(col, overlay)

                # Minute hand
                a_m = capsule_alpha(cx, cy, mx, my, hand_w * 0.8, px, py, feather=0.6)
                if a_m > 0:
                    overlay = (HAND[0], HAND[1], HAND[2], int(255 * a_m))
                    col = blend(col, overlay)

                # Center dot
                a_c = aa_circle_alpha(cx, cy, center_r, px, py, feather=0.5)
                if a_c > 0:
                    overlay = (HAND[0], HAND[1], HAND[2], int(255 * a_c))
                    col = blend(col, overlay)

            pixels[py_i * size + px_i] = col

    return pixels

def write_png(filename, size, pixels):
    def make_chunk(name, data):
        c = struct.pack('>I', len(data)) + name + data
        c += struct.pack('>I', zlib.crc32(name + data) & 0xffffffff)
        return c

    raw_rows = b''
    for row in range(size):
        raw_rows += b'\x00'  # filter type None
        for col in range(size):
            r, g, b, a = pixels[row * size + col]
            raw_rows += struct.pack('BBBB', r, g, b, a)

    ihdr = struct.pack('>IIBBBBB', size, size, 8, 2, 0, 0, 0)
    # Color type 6 = RGBA
    ihdr = struct.pack('>II', size, size) + bytes([8, 6, 0, 0, 0])

    compressed = zlib.compress(raw_rows, 9)

    png = b'\x89PNG\r\n\x1a\n'
    png += make_chunk(b'IHDR', ihdr)
    png += make_chunk(b'IDAT', compressed)
    png += make_chunk(b'IEND', b'')

    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, 'wb') as f:
        f.write(png)
    print(f'  wrote {filename} ({size}x{size})')

if __name__ == '__main__':
    base = os.path.join(os.path.dirname(__file__), 'icons')
    for size in [16, 48, 128]:
        pixels = make_icon(size)
        write_png(os.path.join(base, f'icon{size}.png'), size, pixels)
    print('Done.')
