deploy-dev:
	npm install
	serverless deploy --stage dev 
	serverless deploy --stage dev --region us-west-2

deploy:
	npm install
	serverless deploy --stage prod 
	serverless deploy --stage prod --region us-west-2

get-playlists:
	curl --request GET --url https://api.spotify.com/v1/users/djbockert/playlists?limit=1 --header 'Authorization: Bearer {{auth token from ddb}}'