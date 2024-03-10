cloudfront.id=E3I9E5F6EIDSR

deploy-frontend: 
	cd frontend && npm install && npm run build && aws s3 sync build/ s3://forms.jaminproductions.com
	aws cloudfront create-invalidation --distribution-id ${cloudfront.id} --paths "/*"

test-prod-build:
	cd frontend && npm run build && npx serve -s build

deploy-cloudfront:
	aws --region us-east-1 cloudformation deploy --template-file template.yaml --stack-name forms-jaminproductions-com --tags Category="Jamin Productions" Type="Forms site" AppManagerCFNStackKey="Jamin-Productions-forms"
