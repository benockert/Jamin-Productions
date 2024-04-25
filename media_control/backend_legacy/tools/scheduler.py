import pymysql
import requests
import json
from json import JSONDecodeError
import logging
from datetime import datetime, timedelta

logging.basicConfig(
    format='%(asctime)s %(levelname)-8s %(message)s',
    level=logging.INFO,
    datefmt='%Y-%m-%d %H:%M:%S')


def connect_to_mysql():
    connection_attempt = 0
    while connection_attempt < 3:
        try:
            connection = pymysql.connect(host='event-media-control-mysql.cahvamjokoa1.us-east-1.rds.amazonaws.com',
                                         user='admin',
                                         password='idMElWiVmMgz4oSV8BH5',
                                         database='event_media_control',
                                         connect_timeout=10,
                                         write_timeout=10)

            print("Successfully connected to mysql db {}".format('symbols'))
            return connection
        except pymysql.Error as e:
            print("[Attempt {}] Error connecting to mysql: {}".format(
                connection_attempt, e))

        connection_attempt += 1


def execute_r_obj_mysql_query(connection, query, values):
    with connection.cursor() as cursor:
        try:
            cursor.execute(query, (values))
            connection.commit()
            return cursor.fetchall()
        except pymysql.err.IntegrityError as e:
            print("Skipping duplicate: {}".format(values))
            return
        except pymysql.err.OperationalError as e:
            print("Operational error - {}".format(e))


def get_non_fired_events_from_past_two_minutes(connection):
    now = datetime.now()
    t1 = now.strftime("%Y-%m-%d %H:%M:00")
    t2 = (now + timedelta(minutes=-1)).strftime("%Y-%m-%d %H:%M:00")
    logging.info(f"Looking for screens that need updating at '{t1}' or '{t2}'")

    query = """SELECT screen_url_name, media_url_name, id FROM (SELECT s.url_name AS screen_url_name, m.url_name AS media_url_name, sch.time AS time, sch.has_been_fired as hbf, sch.id as id FROM event_media_control.schedule sch INNER JOIN event_media_control.screens s on s.id = sch.screen_id INNER JOIN event_media_control.media m ON m.id = sch.target_media_id) AS t1 WHERE (t1.time = %s OR t1.time = %s) AND NOT hbf;"""
    return execute_r_obj_mysql_query(connection, query, (t1, t2))


def get_auth_jwt():
    url = "http://54.197.13.71:5002/api/v1/session"

    payload = json.dumps({
        "access_code": "ben23"
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


def update_media(screen, media, token):
    logging.info(f"Updating {screen} to {media}")
    url = "http://54.197.13.71:5002/api/v1/screens/update_media"

    payload = json.dumps({
        "screen": screen,
        "media": media
    })

    headers = {
        'Content-Type': 'application/json',
        'authorization': f"Bearer {token}"
    }

    response = requests.request("POST", url, headers=headers, data=payload)
    try:
        data = response.json()
        return data['message']
    except JSONDecodeError:
        pass


def update_schedule_to_fired(connection, id):
    query = """UPDATE event_media_control.schedule SET has_been_fired = 1 WHERE (id = %s);"""
    execute_r_obj_mysql_query(connection, query, id)


def lambda_handler(event, context):
    connection = connect_to_mysql()
    token = get_auth_jwt()
    if token:
        events_to_fire = get_non_fired_events_from_past_two_minutes(connection)
        if events_to_fire:
            logging.info(
                f"Found {len(events_to_fire)} screen(s) that need to be updated")

            for event in events_to_fire:
                message = update_media(event[0], event[1], token)
                if message == "success":
                    logging.info("Success")
                    update_schedule_to_fired(connection, event[2])
                    return {
                        'statusCode': 200,
                        'body': json.dumps('Success')
                    }
                elif message == "Unauthorized":
                    logging.error("Unauthorized")
                    return {
                        'statusCode': 403,
                        'body': json.dumps('Unauthorized')
                    }
        else:
            logging.info(f"Found 0 screen(s) that need to be updated")

            return {
                'statusCode': 200,
                'body': json.dumps('No updates')
            }
    return {
        'statusCode': 200,
        'body': json.dumps('No auth token')
    }


if __name__ == "__main__":
    lambda_handler(None, None)
