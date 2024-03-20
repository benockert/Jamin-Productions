from PIL import Image, ImageEnhance

def darken(img, factor):
    enhancer = ImageEnhance.Brightness(img)

    # to reduce brightness by 50%, use factor 0.5
    img = enhancer.enhance(factor)

    return img

if __name__ == "__main__":
    image_path = "../files/2024-N-CommencementBranding-v5_Page_11.png"
    # out_path = "../files"
    img = Image.open(image_path)
    img = darken(img, 0.18)
    img.save("../files/submit-darken.jpg")