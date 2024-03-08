import boto3
import pprint

def moderate_image(photo, bucket):
    
    # 
    session = boto3.Session(profile_name='dev')
    client = session.client('rekognition')

    response = client.detect_moderation_labels(Image={'S3Object':{'Bucket':bucket,'Name':photo}})

    print('Detected labels for ' + photo)
    for label in response['ModerationLabels']:
        print (label['Name'] + ' : ' + str(label['Confidence']))
        print (label['ParentName'])
    return len(response['ModerationLabels'])

def handler(event, context):

    # photo='image-name'
    # bucket='bucket-name'
    # label_count=moderate_image(photo, bucket)
    # print("Labels detected: " + str(label_count))
    pprint(event)

if __name__ == "__main__":
    handler()

# class RekognitionImage:
#     """
#     Encapsulates an Amazon Rekognition image. This class is a thin wrapper
#     around parts of the Boto3 Amazon Rekognition API.
#     """

#     def __init__(self, image, image_name, rekognition_client):
#         """
#         Initializes the image object.

#         :param image: Data that defines the image, either the image bytes or
#                       an Amazon S3 bucket and object key.
#         :param image_name: The name of the image.
#         :param rekognition_client: A Boto3 Rekognition client.
#         """
#         self.image = image
#         self.image_name = image_name
#         self.rekognition_client = rekognition_client


#     def detect_moderation_labels(self):
#         """
#         Detects moderation labels in the image. Moderation labels identify content
#         that may be inappropriate for some audiences.

#         :return: The list of moderation labels found in the image.
#         """
#         try:
#             response = self.rekognition_client.detect_moderation_labels(
#                 Image=self.image
#             )
#             labels = [
#                 RekognitionModerationLabel(label)
#                 for label in response["ModerationLabels"]
#             ]
#             logger.info(
#                 "Found %s moderation labels in %s.", len(labels), self.image_name
#             )
#         except ClientError:
#             logger.exception(
#                 "Couldn't detect moderation labels in %s.", self.image_name
#             )
#             raise
#         else:
#             return labels