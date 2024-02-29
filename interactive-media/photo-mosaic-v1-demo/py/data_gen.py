import sys
import json
import math
from random import randrange

message_library = [
    "Congrats Northeastern Class of 2024!",
    "Test message for the Northeastern message wall",
    "Whats up Tyler",
    "Testing 1 2 3 Testing 1 2 3",
    "Northeastern Northeastern Northeastern Northeastern",
    "asad123s45djsk126l3fgw56ekfhe1lfgwewu12389y42p4uyh3tuiblaskd",
    "Northeastern is a private research institution founded in 1898 in Boston",
    "Hello there",
    "Thank you for coming to my ted talk",
    "Congrats and best wishes"
]

photo_album = [
    "050616_bw_undergradgraduation_110-scaled.jpg",
    "279586982_369915035156814_2636644416267753392_n.jpg",
    "bb7ee30b-b32b-4b88-84db-8aa61cb83db3-SAR_GRAD_PARRISH_COMMUNITY_01.jpg",
    "photo-1594750852563-5ed8e0421d40.jpg",
    "regalia-image-1-1024x682.jpg",
    "Screen-Shot-2022-09-06-at-6.56.12-PM.jpg",
    "Smiling-grads800x533.jpg",
    "URI_Graduation_Photographer_Newport_RI-6-1(pp_w768_h1150).jpg"
]

def message_gen(percent):
    output = {}
    messages = {}
    maxRow = 18
    maxCol = 32
    total = maxRow * maxCol
    desired = math.floor((percent / 100) * total)

    while(len(messages) < desired):
        randRow = randrange(0, maxRow)
        randCol = randrange(0, maxCol)

        key = f"{randRow}_{randCol}"
        print(key)

        messages[key] = {
            "message": message_library[randrange(0, len(message_library))]
        }
    
    output["messages"] = messages
    # Serializing json
    json_object = json.dumps(output, indent=4)
    
    # Writing to sample.json
    with open("../data/messages.json", "w") as outfile:
        outfile.write(json_object)

def photo_gen(percent):
    output = {}
    messages = {}
    maxRow = 9
    maxCol = 16
    total = maxRow * maxCol
    desired = math.floor((percent / 100) * total)

    while(len(messages) < desired):
        randRow = randrange(0, maxRow)
        randCol = randrange(0, maxCol)

        key = f"{randRow}_{randCol}"
        print(key)

        messages[key] = {
            "src": photo_album[randrange(0, len(photo_album))],
            "message": message_library[randrange(0, len(message_library))]
        }
    
    output["photos"] = messages
    # Serializing json
    json_object = json.dumps(output, indent=4)
    
    # Writing to sample.json
    with open("../data/photos.json", "w") as outfile:
        outfile.write(json_object)
        
def both_gen(percent):
    pass

if __name__ == "__main__":
    typee = sys.argv[1]
    percent = sys.argv[2]
    print(f"Generating {str(typee)} file with {str(percent)}% coverage")
    if typee == "message":
        message_gen(int(percent))
    elif typee == "photo":
        photo_gen(int(percent))