from PIL import Image
import math
from itertools import product
from PIL import Image, ImageEnhance

def split_image(offset):
    img = Image.open(image_path)
    width, height = img.size
    print(width, height)

    num_rows = 18
    num_cols = 32

    target_screen_size = (1920, 1080)
    target_tile_width = round(target_screen_size[0] / num_cols)
    target_tile_height = round(target_screen_size[1] / num_rows)

    tile_height = math.floor(height / num_rows)
    if (tile_height * num_cols > width):
        # using tile_height for tile_width would be too wide, so use tile_width for both instead of tile_height for both
        tile_width = math.floor(width / num_cols)
        tile_height = tile_width

    new_height = num_rows * tile_height
    new_width = num_cols * tile_height
    ratio = new_height / new_width
    cut_off_bottom = height - new_height
    cut_off_right = width - new_width
    print("Resulting image will be {} by {} pixels ({} ratio, compared to 0.5625). {} pixels will be cut off the bottom and {} off the right.".format(new_height, new_width, str(ratio), cut_off_bottom, cut_off_right))

    # using the decided on height/width, split the image
    grid = product(range(0,num_rows), range(0, num_cols))
    # # print(', '.join([str(g) for g in grid]))
    for r, c in grid:
        # (left, right, top, bottom)
        # print(f'{r}, {c}')
        box = (c * tile_height, r * tile_height, (c+1) * tile_height, (r+1) * tile_height)
        print(box)

        # print(', '.join([str(g) for g in grid]))
        # forms into x-idx_y-idx.jpg
        img.crop(box).resize((target_tile_width,target_tile_height), Image.ANTIALIAS).save(f'{out_path}/{c + offset}_{r + offset}.jpg', optimize=True, quality=95)

    return img, new_height, new_width
    
def darken(img, factor):
    enhancer = ImageEnhance.Brightness(img)

    # to reduce brightness by 50%, use factor 0.5
    img = enhancer.enhance(factor)

    return img


if __name__ == "__main__":
    image_path = "../files/2024-N-CommencementBranding-v5_Page_11.png"
    out_path = "../files/split"

    offset = 30
    image, adjusted_height, adjusted_width = split_image(offset)

    cropped_image = image.crop((0,0,adjusted_width,adjusted_height))

    darken(cropped_image, 0.20).save("../files/northeastern2024-bg.jpg")
