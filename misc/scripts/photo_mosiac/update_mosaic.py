import boto3
from botocore.config import Config

def update_mosaic_info(ddb, table, event_key, offset, width, height):

    available_positions = []
    for x in range(offset, offset + width):
        for y in range(offset, offset + height):
            position = {"M": {"x": {"N": str(x)}, "y": {"N": str(y)}}}
            available_positions.append(position)

    result = ddb.update_item(
            TableName=table,
            Key={"event_id": {"S": f"{event_key}.photomosaic"}},
            UpdateExpression="set available_positions=:ap, width=:w, height=:h, #os=:os",
            ExpressionAttributeNames={"#os": "offset"},
            ExpressionAttributeValues={":ap": {"L": available_positions}, ":w": {"N": str(width)}, ":h": {"N": str(height)}, ":os": {"N": str(offset)}},
        )
    
    print(result)

def main():
    ddb = boto3.client('dynamodb', config=Config(region_name="us-east-1"))
    table = "jamin-productions-events-prod"
    # table = "jamin-productions-events-dev"
    offset=30 

    event_key = "northeastern2024"

    width = 32
    height = 18

    update_mosaic_info(ddb, table, event_key, offset, width, height)


if __name__ == "__main__":
    main()