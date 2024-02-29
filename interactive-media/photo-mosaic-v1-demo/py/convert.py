# from PIL import Image

# def main():
#     image = Image.open("./photos/050616_bw_undergradgraduation_110-scaled.jpg")
#     sepia_filter = ((0.393, 0.769, 0.189), (0.349, 0.686, 0.168), (0.272, 0.534, 0.131))
#     apply_filter(image, sepia_filter)
#     image.save("solar.png")


# def apply_filter(image, mask):
#     (width, height) = image.size
#     for y in range(0, height - 1):
#         for x in range(0, width - 1):
#             px = image.getpixel((x, y))
#             new_px = get_new_pixel(px, mask)
#             image.putpixel((x, y), new_px)


# def get_new_pixel(old_px, mask):
#     (r, g, b) = old_px
#     new_r = int(r * mask[0][0] + g * mask[0][1] + b * mask[0][2])
#     new_g = int(r * mask[1][0] + g * mask[1][1] + b * mask[1][2])
#     new_b = int(r * mask[2][0] + g * mask[2][1] + b * mask[2][2])
#     return new_r, new_g, new_b

import cv2
import numpy as np
import skimage.exposure

def tint():
    # read image
    img = cv2.imread('./photos/050616_bw_undergradgraduation_110-scaled.jpg')

    # separate channels
    r,g,b = cv2.split(img)

    # compute clip points -- clip 1% only on high side
    clip_rmax = np.percentile(r, 99)
    clip_gmax = np.percentile(g, 99)
    clip_bmax = np.percentile(b, 99)
    clip_rmin = np.percentile(r, 0)
    clip_gmin = np.percentile(g, 0)
    clip_bmin = np.percentile(b, 0)

    # stretch each channel
    r_stretch = skimage.exposure.rescale_intensity(r, in_range=(clip_rmin,clip_rmax), out_range=(0,177)).astype(np.uint8)
    g_stretch = skimage.exposure.rescale_intensity(g, in_range=(clip_gmin,clip_gmax), out_range=(0,168)).astype(np.uint8)
    b_stretch = skimage.exposure.rescale_intensity(b, in_range=(clip_bmin,clip_bmax), out_range=(0,157)).astype(np.uint8)

    # combine channels
    img_stretch = cv2.merge([r_stretch, g_stretch, b_stretch])

    # invert
    # result = 255 - img_stretch

    # cv2.imshow('input', img)
    cv2.imshow('result', img_stretch)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

    # save results
    cv2.imwrite('boys_negative_inverted2.jpg', img_stretch)

def vignette():
    #reading the image 
    input_image = cv2.imread('./photos/050616_bw_undergradgraduation_110-scaled.jpg')
    
    #resizing the image according to our need 
    # resize() function takes 2 parameters,  
    # the image and the dimensions 
    input_image = cv2.resize(input_image, (480, 480))
    
    # Extracting the height and width of an image 
    rows, cols = input_image.shape[:2]
    
    # generating vignette mask using Gaussian 
    # resultant_kernels
    X_resultant_kernel = cv2.getGaussianKernel(cols,300)
    Y_resultant_kernel = cv2.getGaussianKernel(rows,300)
    
    #generating resultant_kernel matrix 
    resultant_kernel = Y_resultant_kernel * X_resultant_kernel.T
    
    #creating mask and normalising by using np.linalg
    # function
    mask = 380 * resultant_kernel / np.linalg.norm(resultant_kernel)
    output = np.copy(input_image)
    
    # applying the mask to each channel in the input image
    for i in range(3):
        output[:,:,i] = output[:,:,i] * mask
        
    #displaying the original image   
    # cv2.imshow('Original', input_image)
    
    #displaying the vignette filter image 
    cv2.imshow('VIGNETTE', output)
    
    # Maintain output window until 
    # user presses a key 
    cv2.waitKey(0)
    
    # Destroying present windows on screen 
    cv2.destroyAllWindows() 

    cv2.imwrite('vignette.png', output)

if __name__ == "__main__":
    vignette()