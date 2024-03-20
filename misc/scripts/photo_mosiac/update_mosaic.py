import boto3
import random
import requests
from botocore.config import Config

def update_mosaic_info(ddb, table, event_key, offset, cols, rows, width, height):

    available_positions = []
    for x in range(offset, offset + cols):
        for y in range(offset, offset + rows):
            position = {"M": {"x": {"N": str(x)}, "y": {"N": str(y)}}}
            available_positions.append(position)

    # update available position info
    result = ddb.update_item(
            TableName=table,
            Key={"event_id": {"S": f"{event_key}.photomosaic.available_positions"}},
            UpdateExpression="set #v=:ap",
            ExpressionAttributeNames={"#v": "value"},
            ExpressionAttributeValues={":ap": {"L": available_positions}},
        )
    print(result)

    # update event mosaic info
    result = ddb.update_item(
            TableName=table,
            Key={"event_id": {"S": f"{event_key}.photomosaic"}},
            UpdateExpression="set width=:w, height=:h, cols=:c, #r=:r, #os=:os",
            ExpressionAttributeNames={"#os": "offset", "#r": "rows"},
            ExpressionAttributeValues={":w": {"N": str(width)}, ":h": {"N": str(height)}, ":c": {"N": str(cols)}, ":r": {"N": str(rows)}, ":os": {"N": str(offset)}},
        )
    
    print(result)

# def assign_positions(ddb, events_table, media_table, event_key):
#     items = ddb.get_item(
#         TableName=events_table,
#         Key={"event_id": {"S": f"{event_key}.photomosaic.available_positions"}},
#     )

#     available_positions = items["Item"]["value"]["L"]

#     # get enabled media from api endpoint
#     media = requests.get(f"https://pm0v1kb80m.execute-api.us-west-2.amazonaws.com/media/{event_key}/photo_mosaic").json()["items"]

#     for entry in media:
#         if not "position_x" in entry or not "position_y" in entry:
#             print("Missing position, assigning random position")
#             rand = random.randrange(0, len(available_positions))
#             position = available_positions.pop(rand)
#             result = ddb.update_item(
#                 TableName=media_table,
#                 Key={"event_id": {"S": event_key}, "image_key"},
#                 UpdateExpression="set width=:w, height=:h, #os=:os",
#                 ExpressionAttributeNames={"#os": "offset"},
#                 ExpressionAttributeValues={":w": {"N": str(width)}, ":h": {"N": str(height)}, ":os": {"N": str(offset)}},
#         )
#         else:
#             print("Found position, doing nothing")


def main():
    ddb = boto3.client('dynamodb', config=Config(region_name="us-east-1"))
    # events_table = "jamin-productions-events-prod"
    events_table = "jamin-productions-events-dev"
    offset=30

    event_key = "northeastern2024"

    cols = 32
    rows = 18
    width = 1920
    height = 1080


    update_mosaic_info(ddb, events_table, event_key, offset, cols, rows, width, height)

    # media_table = "interactive-media-form-submission-prod"
    # media_table = "interactive-media-form-submission-dev"
    # assign_positions(ddb, events_table, media_table, event_key)


if __name__ == "__main__":
    main()