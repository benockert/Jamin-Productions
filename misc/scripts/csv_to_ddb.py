import boto3
import csv
from botocore.config import Config

def batch_write(ddb, items, table_name):
    entries = []

    # events table
    for item in items:
        if "events" in table_name:
            entry = {
                'PutRequest': {
                    'Item': {
                        'event_id': {'S': str(item[0])},
                        'date': {'S': str(item[1])},
                        'name': {'S': str(item[2])},
                        'playlist_id': {'S': str(item[3])},
                        'request_limit': {'N': str(item[4])},
                    }
                }
            }
            entries.append(entry)
        elif "spotify" in table_name:
            entry = {
                'PutRequest': {
                    'Item': {
                        'app_name': {'S': str(item[0])},
                        'flow_type': {'S': str(item[1])},
                        'access_token': {'S': str(item[2])},
                        'expires': {'N': str(item[3])},
                        'refresh_token': {'S': str(item[4])},
                    }
                }
            }
            entries.append(entry)
        elif "requests" in table_name:
            entry = {
                'PutRequest': {
                    'Item': {
                        'event_name': {'S': str(item[0])},
                        'submission_timestamp': {'N': str(item[1])},
                        'artist_name': {'S': str(item[2])},
                        'notes': {'S': str(item[3])},
                        'requestor_name': {'S': str(item[4])},
                        'song_title': {'S': str(item[5])},
                    }
                }
            }
            entries.append(entry)
    
    if entries:
        request_items = {}
        request_items[table_name] = entries
        print(request_items)

        result = ddb.batch_write_item(
            RequestItems=request_items
        )
        print(result)

def csv_to_ddb(ddb, csv_filename, ddb_tablename):
    items_to_write = []
    with open(csv_filename, newline='') as csv_file:
        rows = csv.reader(csv_file, delimiter=',', quotechar='\"')

        # skip over column names
        next(rows, None)

        for row in rows:
            items_to_write.append(row)

            # can only write 25 per batch
            if len(items_to_write) >= 25:
                batch_write(ddb, items_to_write, ddb_tablename)

                # reset items list
                items_to_write = []
        
        # write remaining items in final batch
        if len(items_to_write):
            batch_write(ddb, items_to_write, ddb_tablename)
            items_to_write = []
    
    assert(len(items_to_write) == 0)

def main():
    ddb = boto3.client('dynamodb', config=Config(region_name="us-east-1"))

    # events_file = "./files/events.csv"
    # events_table = "jamin-productions-events-dev"
    # csv_to_ddb(ddb, events_file, events_table)

    # requests_file = "./files/requests.csv"
    # requests_table = "song-requests-form-submission-dev"
    # csv_to_ddb(ddb, requests_file, requests_table)

    events_file = "./files/events.csv"
    events_table = "jamin-productions-events-prod"
    csv_to_ddb(ddb, events_file, events_table)

    requests_file = "./files/requests.csv"
    requests_table = "song-requests-form-submission-prod"
    csv_to_ddb(ddb, requests_file, requests_table)

    spotify_file = "./files/spotify_auth.csv"
    spotify_table = "requests-spotify-auth"
    csv_to_ddb(ddb, spotify_file, spotify_table)  


if __name__ == "__main__":
    main()