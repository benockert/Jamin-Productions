cloudfront.id=E3JNRGH6T24XB1

deploy-frontend: 
	cd frontend && npm run build && aws s3 sync build/ s3://requests.jaminproductions.com
	aws cloudfront create-invalidation --distribution-id ${cloudfront.id} --paths "/*"

test-prod-build:
	cd frontend && npm run build && npx serve -s build