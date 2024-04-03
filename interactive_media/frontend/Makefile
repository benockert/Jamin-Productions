cloudfront.id=E26W2PP0SPXHVS

deploy-media-site-stack:
	aws --region us-east-1 cloudformation deploy --template-file ../../forms/template.yaml --stack-name media-jaminproductions-com --parameter-overrides "DomainName=media.jaminproductions.com" --tags Category="Jamin Productions" Type="Interactive media display site" AppManagerCFNStackKey="Jamin-Productions-media"

deploy-media-site-web:
	npm install && npm run build && aws s3 sync build/ s3://media.jaminproductions.com
	aws cloudfront create-invalidation --distribution-id ${cloudfront.id} --paths "/*"
