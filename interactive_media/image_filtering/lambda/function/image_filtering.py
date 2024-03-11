import urllib.parse
import boto3
import logging
from botocore.exceptions import ClientError
from botocore.config import Config

logging.getLogger().setLevel(logging.INFO)
logger = logging.getLogger()

config = Config(region_name = 'us-east-1')

def handler(event, context):
    try:
        # rekognition client
        rekognition = boto3.client('rekognition', config=config)

        # get the s3 object from the event (assumption that this lambda is being triggered by an S3 event)
        bucket = event['Records'][0]['s3']['bucket']['name']
        key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
        name = key.split("/")[-1]

        logger.info("New image: {} has been uploaded to {}/{} | Running label check...".format(name, bucket, key))

        image = RekognitionImage({'S3Object':{'Bucket':bucket,'Name':key}}, name, rekognition)
        
        labels = image.detect_moderation_labels()
        for label in labels:
            logger.info(label.to_string())

        labels = image.detect_labels()
        for label in labels:
            logger.info(label.to_string())

    except Exception as e:
        logger.error('Error getting object {} from bucket {}'.format(key, bucket))
        logger.exception(e)
        raise e

class RekognitionImage:
    """
    Encapsulates an Amazon Rekognition image. This class is a thin wrapper
    around parts of the Boto3 Amazon Rekognition API.
    """

    def __init__(self, image, image_name, rekognition_client):
        """
        Initializes the image object.

        :param image: Data that defines the image, either the image bytes or
                      an Amazon S3 bucket and object key.
        :param image_name: The name of the image.
        :param rekognition_client: A Boto3 Rekognition client.
        """
        self.image = image
        self.image_name = image_name
        self.rekognition_client = rekognition_client
        self.config = {'MinConfidence': 70} # move to env variable

    def detect_moderation_labels(self):
        """
        Detects moderation labels in the image. Moderation labels identify content
        that may be inappropriate for some audiences.

        :return: The list of moderation labels found in the image.
        """
        try:
            response = self.rekognition_client.detect_moderation_labels(
                Image=self.image, **self.config
            )
            labels = [
                RekognitionModerationLabel(label)
                for label in response["ModerationLabels"]
            ]
            logger.info(
                "Found %s moderation labels in %s", len(labels), self.image_name
            )
        except ClientError:
            logger.exception(
                "Couldn't detect moderation labels in %s", self.image_name
            )
            raise
        else:
            return labels
        
    def detect_labels(self):
        """
        Detects labels in the image.

        :return: The list of labels found in the image.
        """
        try:
            response = self.rekognition_client.detect_labels(
                Image=self.image, **self.config
            )
            labels = [
                RekognitionLabel(label)
                for label in response["Labels"]
            ]
            logger.info(
                "Found %s labels in %s", len(labels), self.image_name
            )
        except ClientError:
            logger.exception(
                "Couldn't detect labels in %s", self.image_name
            )
            raise
        else:
            return labels

class RekognitionLabel:
    def __init__(self, label_obj):
        self.name = label_obj["Name"]
        self.confidence = label_obj["Confidence"]

    def to_string(self):
        return f"Label: {self.name} | Confidence: {self.confidence}"
        
class RekognitionModerationLabel(RekognitionLabel):
    def __init__(self, label_obj):
        super().__init__(label_obj)
        # self.parent_name = label_obj["ParentName"]
        # self.taxonomy_level = label_obj["TaxonomyLevel"]
    
if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        handlers=[
            logging.FileHandler("image_filtering.log"),
            logging.StreamHandler()
        ]
    )
    
    rekognition = boto3.client('rekognition', config=config)
    bucket = "static.jaminproductions.com"
    key = "dev/interactive_media/photo_mosaic/northeastern2024/coop_tshirt_w.png"
    key = "dev/interactive_media/photo_mosaic/northeastern2024/explicit_test.jpg"
    name = key.split("/")[-1]

    logger.info("New image: {} has been uploaded to {}/{} | Running label check...".format(name, bucket, key))

    image = RekognitionImage({'S3Object':{'Bucket': bucket, 'Name': key}}, name, rekognition)
    labels = image.detect_labels()
    for label in labels:
        logger.info("\t" + label.to_string())

    labels = image.detect_moderation_labels()
    for label in labels:
        logger.info("\t" + label.to_string())