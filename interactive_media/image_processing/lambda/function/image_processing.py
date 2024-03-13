import os
import math
import boto3
import logging
import mimetypes
from PIL import Image
from botocore.config import Config
from urllib.parse import unquote_plus
from botocore.exceptions import ClientError

logging.getLogger().setLevel(logging.INFO)
logger = logging.getLogger()

config = Config(region_name = 'us-east-1')

def handler(event, context):
    try:
        # get the s3 object from the event (assumption that this lambda is being triggered by an S3 event)
        bucket = event['Records'][0]['s3']['bucket']['name']
        file_key = unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
    
        # process our image by checking for inappropriate content and resizing
        enabled = detect_labels(bucket, file_key)
        ddb_sort_key, ddb_partition_key = process_image(bucket, file_key)

        # assumption is the image submission has been set to inactive in ddb, update to active if the image passes our checks
        if (enabled):
            logger.info("Image passes checks, updating active status in ddb.")
            result = enable_submission_in_ddb(ddb_sort_key, ddb_partition_key)
            if (result == 200):
                logger.info("Successfully updated active status of {}".format(ddb_partition_key))
            else:
                logger.error("Unsucessful attempt at updating active status of {}".format(ddb_partition_key))
        else:
            logger.info("Found inappropriate immage, nothing to update in ddb.")
        
    except Exception as e:
        logger.exception(e)
        raise e
    
def enable_submission_in_ddb(partition_key, sort_key):
    """
    Updates active to true for the DDB item with the given keys 
    """
    dynamo = boto3.client('dynamodb', config=config)
    table_name = os.environ['TABLE_NAME']
    try:
        result = dynamo.update_item(
            TableName=table_name,
            Key={"event_name": {"S": partition_key}, "image_key": {"S": sort_key}},
            UpdateExpression="set active=:r",
            ExpressionAttributeValues={":r": {"BOOL": True}},
        )
    except ClientError as err:
        logger.error(
            "Couldn't set %s to active in table %s. Here's why: %s: %s",
            sort_key,
            table_name,
            err.response["Error"]["Code"],
            err.response["Error"]["Message"],
        )
        return 500
    else:
        return result["ResponseMetadata"]["HTTPStatusCode"]


def resize_image(in_path, out_path):
    """
    Resizes the image at the given in path to be a perfect square, saves the cropped image to the given out path
    """
    with Image.open(in_path) as image:
        width, height = image.size
        if width == height:
            # nothing to do, just move/rename
            image.save(out_path)
        if width > height:
            # wider than tall, crop in the left and right to match the height
            center_width = math.floor(width / 2)
            center_height = math.floor(height / 2)
            new_width_and_height = center_height * 2
            new_left = center_width - (new_width_and_height / 2)
            new_right = center_width + (new_width_and_height / 2)

            # crop(left, upper, right, lower)
            image.crop((new_left, 0, new_right, new_width_and_height)).save(out_path)
        else:
            # taller than wide, crop in the bottom and top to match the width
            center_width = math.floor(width / 2)
            center_height = math.floor(height / 2)
            new_width_and_height = center_width * 2
            new_top = center_height - (new_width_and_height / 2)
            new_bottom = center_height + (new_width_and_height / 2)

            # crop(left, upper, right, lower)
            image.crop((0, new_top, new_width_and_height, new_bottom)).save(out_path)

def create_thumbnail(in_path, out_path, size):
    """
    Creates a thumbnail of the image at the given in path with the given size, saves the thumbnail to the given out path
    """
    with Image.open(in_path) as image:
        image.thumbnail((size, size))
        image.save(out_path)
    
def process_image(bucket, key, local_folder="/tmp"):
    """
    Crops images to be square and creates a thumbnail for them
    """
    image_name = key.split("/")[-1]
    logger.info("New image: {} has been uploaded to {}/{} | Processing image...".format(image_name, bucket, key))

    s3 = boto3.client('s3')

    key_split = key.split(".")
    resized_name = "-resized.".join(key_split).replace("upload/", "processed/") # adds '-resized' to the end pf the filename and replaces upload folder with processed folder
    thumbnail_name = "-thumbnail.".join(key_split).replace("upload/", "processed/") # adds '-thumbnail' to the end pf the filename and replaces upload folder with processed folder

    download_path_local = '{}/{}'.format(local_folder, key.replace("/", "_"))
    resized_path_local = '{}/{}'.format(local_folder, resized_name.replace("/", "_"))
    thumbnail_path_local = '{}/{}'.format(local_folder, thumbnail_name.replace("/", "_"))  

    s3.download_file(bucket, key, download_path_local)
    file_content_type = mimetypes.guess_type(download_path_local)[0]
    resize_image(download_path_local, resized_path_local)
    create_thumbnail(resized_path_local, thumbnail_path_local, 200)

    logger.info("Uploading resized photo to {}/{}".format(bucket, resized_name))
    # s3.upload_file(resized_path_local, bucket, resized_name, ExtraArgs={"Metadata": {"Content-Type": file_content_type}})
    with open(resized_path_local, "rb") as file:
        s3.put_object(
            Bucket=bucket,
            Body=file,
            Key=resized_name,
            ContentType=file_content_type
        )

    logger.info("Uploading thumbnail photo to {}/{}".format(bucket, thumbnail_name))
    # s3.upload_file(thumbnail_path_local, bucket, thumbnail_name, ExtraArgs={"Metadata": {"Content-Type": file_content_type}})
    with open(thumbnail_path_local, "rb") as file:
        s3.put_object(
            Bucket=bucket,
            Body=file,
            Key=thumbnail_name,
            ContentType=file_content_type
        )

    return key.split("/")[-3], f"image.{image_name.split('.')[-2]}"

def detect_labels(bucket, key):
    """
    Runs the image at the given bucket/key through AWS Rekognition and detects any moderation labels signifying the image may be innapropriate 
    """
    image_name = key.split("/")[-1]
    logger.info("New image: {} has been uploaded to {}/{} | Running label check...".format(image_name, bucket, key))

    rekognition = boto3.client('rekognition', config=config)
    image = RekognitionImage({'S3Object':{'Bucket':bucket,'Name':key}}, image_name, rekognition)
    labels = image.detect_moderation_labels()
    if len(labels):
        logging.info("Inappropriate image uploaded ({}), will be set to not appear in interactive media displays".format(image_name))
        return False
    return True

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
                "Found %s moderation labels in %s: %s", len(labels), self.image_name, ", ".join([l.name for l in labels])
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
                "Found %s labels in %s: %s", len(labels), self.image_name, ", ".join([l.name for l in labels])
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

# for local testing
if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        handlers=[
            logging.StreamHandler()
        ]
    )

    bucket = "static.jaminproductions.com"
    key = "dev/interactive_media/photo_mosaic/northeastern2024/upload/5b3e44b0-8824-4d90-8f40-c57ad1239633.jpg"
    result = detect_labels(bucket, key)
    ddb_sort_key, ddb_partition_key = process_image(bucket, key, "./test")
    if (result):
        logger.info("Image passes checks, updating active status in ddb.")
        result = enable_submission_in_ddb(ddb_sort_key, ddb_partition_key)
        if (result == 200):
            logger.info("Successfully updated active status of {}".format(ddb_partition_key))
        else:
            logger.error("Unsucessful attempt at updating active status of {}".format(ddb_partition_key))
    else:
        logger.info("Found inapropriate immage, nothing to update in ddb.")
    # enable_submission_in_ddb("northeastern2024", "5b3e44b0-8824-4d90-8f40-c57ad1239633")
