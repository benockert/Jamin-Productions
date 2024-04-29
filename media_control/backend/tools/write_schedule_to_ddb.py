# NOTE: must run in timezone of event due to timestamp conversion
import json
import boto3
from pprint import pprint
from datetime import datetime
import math

dynamodb = boto3.client('dynamodb')

def date_to_timestamp(date, format=""):
    now = datetime.strptime(date, "%m/%d/%y %I:%M %p")
    timestamp = math.floor(datetime.timestamp(now.replace(second=0))) * 1000
    print(timestamp)

    return timestamp

def batch_write_to_ddb(items):
    table_name = "event-media-control-prod"
    request_items = {}
    request_items[table_name] = items
    pprint(request_items)

    result = dynamodb.batch_write_item(
        RequestItems=request_items
    )
    print(result)
    
def main(filename):
    f = open(filename)
    data = json.load(f)

    if not "event_id" in data:
        print(f"No event id specified, please add `event_id` to the top level of {filename}")
        exit(1)   
    event_id = data["event_id"]
    print(event_id)

    if not "schedule" in data:
        print(f"No schedule specified for event {event_id}, please add `schedule` to the top level of {filename}")
        exit(1)
    schedule = data["schedule"]

    # to accumualate a list of scheduled events at each timestamp
    # mapping of timestamp -> events that happen at that time
    events = {}

    for screen_id, screen_schedule in schedule.items():
        for i in range(len(screen_schedule)):
            # get the current schedule info
            schedule_change = screen_schedule[i]
            scheduled_time = str(date_to_timestamp(schedule_change["datetime"]))
            target_media = schedule_change["media"]

            item = {}
            item["target_media_id"] = {"S": target_media}
            item["target_screen_id"] = {"S": screen_id}

            # set to empty strings for now (will be updated if necessary)
            item["next_media_id"] = {"S": ""}
            item["next_scheduled_change"] = {"N": str(0)}

            # if we have next
            if i+1 < len(screen_schedule):
                next_change = screen_schedule[i+1]
                next_media = next_change["media"]
                next_timestamp = str(date_to_timestamp(next_change["datetime"]))
                item["next_media_id"] = {"S": next_media}
                item["next_scheduled_change"] = {"N": next_timestamp}

            # add this change to the list of other changes at this scheduled time, or make a new time entry
            if scheduled_time in events:
                changes_at_time = events[scheduled_time]
            else:
                changes_at_time = []

            changes_at_time.append({"M": item})
            events[scheduled_time] = changes_at_time

    items_to_write = []
    for scheduled_time, events in events.items():
        items_to_write.append({
                'PutRequest': {
                    'Item': {'event_id': {"S": f"{event_id}.schedule"}, "key": {"S": scheduled_time}, 'changes':{'L':events}}
                }
            })
        
        # can only write 25 per batch
        if len(items_to_write) >= 25:
            batch_write_to_ddb(items_to_write)

            # reset items list
            items_to_write = []
    
    # write remaining items in final batch
    if len(items_to_write):
        batch_write_to_ddb(items_to_write)
        items_to_write = []   

    assert(len(items_to_write) == 0)

    f.close()


if __name__ == "__main__":
    filename = "northeastern2024.json"
    print(f"Processing scheduled events in {filename}")
    main(filename)