import boto3
import requests
import json
from json import JSONDecodeError
from botocore.config import Config
from datetime import datetime, timezone
import math
import os
from botocore.exceptions import ClientError

# load the screen media changes that are scheduled for the current minute from DDB
def get_scheduled_changes(dynamodb):
    # cron isn't guarenteed to fire exactly at :00 so need to round down to nearest minute as well as grab previous minute (timestamp out to milliseconds)
    now = datetime.now(timezone.utc)
    timestamp = math.floor(datetime.timestamp(now.replace(second=0))) * 1000
    print(f"Looking for screens that need updating at '{timestamp}'")

    # could do scan instead and do range of timestamp
    ddb_response = dynamodb.get_item(TableName=os.environ["EVENT_MEDIA_CONTROL_TABLE"], Key={'event_id':{'S':'northeastern2024.schedule'}, 'key':{'S':str(timestamp)}})
    if "Item" in ddb_response:
        # each scheduled screen change is a Map in a List field in DDB
        return ddb_response["Item"]["changes"]["L"]
    else:
        # see if previous minute had any (in case of delayed function start)
        ddb_response = dynamodb.get_item(TableName=os.environ["EVENT_MEDIA_CONTROL_TABLE"], Key={'event_id':{'S':'northeastern2024.schedule'}, 'key':{'S':str(timestamp - 60000)}})
        if "Item" in ddb_response:
            # each scheduled screen change is a Map in a List field in DDB
            return ddb_response["Item"]["changes"]["L"]
        else:
            return

# authenticate 
def get_auth_jwt():
    url = "https://olrk6aszw4.execute-api.us-east-1.amazonaws.com/v1/session"
    payload = json.dumps({
        "access_code": os.environ["ADMIN_ACCESS_CODE"]
    })
    headers = {
        'Content-Type': 'application/json'
    }

    response = requests.request("POST", url, headers=headers, data=payload)
    try:
        data = response.json()
        return data['token']
    except JSONDecodeError:
        pass

# perform the screen media update
def execute(schedule_change, token):
    target_screen = schedule_change["M"]["target_screen_id"]["S"]
    target_media = schedule_change["M"]["target_media_id"]["S"]
    print(f"Updating {target_screen} to {target_media}")

    # url = f"https://olrk6aszw4.execute-api.us-east-1.amazonaws.com/v1/screens/{target_screen}/media"
    url = f"https://api.event-media-control.com/v1/screens/{target_screen}/media"
    payload = json.dumps({
        "new_media_id": target_media,

    })
    headers = {
        'Content-Type': 'application/json',
        'authorization': f"Bearer {token}"
    }

    response = requests.request("PUT", url, headers=headers, data=payload)
    try:
        data = response.json()
        return data
    except JSONDecodeError:
        pass

# we want to update the next schedule information for a screen so it can update in realtime
def update_current_screen_state(dynamodb, schedule_change):
    # TODO: relies on the scheduler always adding info about next (even if blank); update to check for key
    target_screen = schedule_change["M"]["target_screen_id"]["S"]
    next_media = schedule_change["M"]["next_media_id"]["S"]
    next_schedule_timestamp = schedule_change["M"]["next_scheduled_change"]["N"]

    try:
        response = dynamodb.update_item(
            TableName=os.environ["EVENT_MEDIA_CONTROL_TABLE"],
            Key={"event_id": {"S": "northeastern2024"}, "key": {"S": f"screen.{target_screen}"}},
            UpdateExpression="set next_media_id=:v1, next_scheduled_change=:v2",
            ExpressionAttributeValues={":v1": {"S": str(next_media)}, ":v2": {"N": str(next_schedule_timestamp)}}
        )
    except ClientError as err:
        print(
            "Couldn't update screen '%s' schedule information because: %s: %s",
            target_screen,
            err.response["Error"]["Code"],
            err.response["Error"]["Message"],
        )
        pass


def handler(event, context):
    config = Config(region_name = os.environ["APP_REGION"])
    dynamodb = boto3.client('dynamodb', config=config)

    token = get_auth_jwt()
    if token:
        schedule_changes_to_execute = get_scheduled_changes(dynamodb)
        
        if schedule_changes_to_execute:
            print(
                f"Found {len(schedule_changes_to_execute)} screen(s) that need to be updated")
            for schedule_change in schedule_changes_to_execute:
                response = execute(schedule_change, token)
                if response["message"] == "Unauthorized":
                    logging.error("Unauthorized")
                    return {
                        'statusCode': 403,
                        'body': json.dumps('Unauthorized')
                    }
                if response["status"] == 200:
                    print("Success")
                    update_current_screen_state(dynamodb, schedule_change)
                    return {
                        'statusCode': 200,
                        'body': json.dumps('Success')
                    }
        else:
            print(f"Found 0 screen(s) that need to be updated")

            return {
                'statusCode': 200,
                'body': json.dumps('No updates')
            }
    return {
        'statusCode': 200,
        'body': json.dumps('No auth token')
    }


if __name__ == "__main__":
    handler(None, None)
