import requests
import time

def main():
    requests_url = "https://t5cm4v4fol.execute-api.us-west-2.amazonaws.com/requests/bentleygala2024"
    song_requests = requests.get(requests_url).json()
    
    playlist_url = url = "https://t5cm4v4fol.execute-api.us-west-2.amazonaws.com/spotify/bentleygala2024/add_to_playlist"
    for song in song_requests:
        # payload = 'songTitle=Happy&artistName=Pharell%20Williams'
        # headers = {
        #     'Content-Type': 'application/x-www-form-urlencoded'
        # }
        data = {
            "songTitle": song['song_title'],
            "artistName": song['artist_name']
        }
        print(data)
        response = requests.request("POST", playlist_url, data=data).json()
        print(response['status'])
        time.sleep(1)


if __name__ == "__main__":
    main()