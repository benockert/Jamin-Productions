from PIL import Image
import math
from itertools import product

# image_path = "../static/full/nu_125_experience.JPG"
# image_path = "../static/full/DJI_0007.JPG"
# image_path = "../static/full/p8n82a8xlppjchvzrtzc.webp"
image_path = "../static/full/050418_AG_2018_Commencement_095.webp"

out_path = "../static/split"

def split_image():
    img = Image.open(image_path)
    width, height = img.size

    num_rows = 9
    num_cols = 16

    tile_height = math.floor(height / num_rows)
    tile_width = math.floor(width / num_cols)

    print(width)
    print(height)
    print(tile_width)
    print(tile_height)

    grid = product(range(0,num_rows), range(0, num_cols))
    # print(', '.join([str(g) for g in grid]))
    for r, c in grid:
        # (left, right, top, bottom)
        # print(f'{r}, {c}')
        box = (c * tile_width, r * tile_height, (c+1) * tile_width, (r+1) * tile_height)
        # print(box)

        # print(', '.join([str(g) for g in grid]))
        img.crop(box).save(f'{out_path}/{r}_{c}.jpg')



if __name__ == "__main__":
    print("Running")
    split_image()