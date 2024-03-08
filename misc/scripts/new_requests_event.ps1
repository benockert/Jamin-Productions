aws dynamodb --region=us-west-2 put-item --table-name jamin-productions-events-prod --item "$(cat << EOF
{
  "event_id":
    {
      "S": "dadstestevent"
    },
  "name":
    {
      "S": "Mom and Dad in Seattle!! <3"
    },
  "date":
    {
      "S": "April 18th, 2024"
    },
  "request_limit":
    {
      "N": "5"
    },
  "playlist_id": {
    {
      "S": "2v9Xtr9N7E6gBc0sFerXVQ"
    }
  }
}
EOF
)"

# event_id needs to be all lowercase!!
# 