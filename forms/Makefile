cloudfront.id=E3JNRGH6T24XB1

deploy-frontend: 
	cd frontend && npm run build && aws s3 sync build/ s3://requests.jaminproductions.com
	aws cloudfront create-invalidation --distribution-id ${cloudfront.id} --paths "/*"

deploy-backend:
	cd backend && serverless deploy --stage prod

deploy-prod: deploy-frontend deploy-backend

test-prod-build:
	cd frontend && npm run build && npx serve -s build

add-new-event:
	cd scripts && ./new_event.bat

get-playlists:
	curl --request GET --url https://api.spotify.com/v1/users/djbockert/playlists?limit=1 --header 'Authorization: Bearer {{auth token from ddb}}'