## Photo upload

- saves image to S3 bucket
- creates DDB entry with S3 url

## Page load

- Option 1
  - all pictures are downloaded and stored locally

# Message Board

## Page load

- Option 1
  - all pictures are downloaded and stored locally
  - requests returns a list of messages with their position
  - loads those images and those messages as needed
  - every minute, requests a list of messages and sends most recent timestamp, receives just the new messages (removed messages too) in REVERSE CHRONOLOGICAL ORDER
    - adds the assigned images to the page and

## Page itself

    - loads the photos and positions of the returned messages
    - on page load, displays the most recent X number submissions first, then random
    - each 2 minutes, displays all of the new messages in order, then random
    - backend processing will handle resizes
    - initial request will need to return screen dimensions and image sizes

From server:

- /installment_id
  - returns number of rows and columns
- /installment_id/messages
  - returns list of messages with positions row_col as key
  - returns timestamp of latest message
  - prefix of images, downloads them all and places at spot based on message key
- /installment_id/messages?last_timestap={timestamp}
  - returns just new messages since that last time
  - adds new photos to the chart, new position tuples to the queue

DDB:

- {client name}.message_board.min_percentage => minimum percentage we want the screen to be filled
- {client name}.message_board.
