webcloudfront.id=E3LAHEE9CXO5O4
staticcloudfront.id=E3U0ZH1BFZK6SL

sync-static-dev:
	aws s3 sync frontend/html/dev/ s3://static.jaminproductions.com/dev/media_control/events/northeastern2024/html/
	aws s3 sync frontend/js/dev/ s3://static.jaminproductions.com/dev/media_control/scripts/
	aws cloudfront create-invalidation --distribution-id ${staticcloudfront.id} --paths /dev/media_control/scripts/* /dev/media_control/events/northeastern2024/html/*

sync-static-prod:
	aws s3 sync events/northeastern2024/html/ s3://static.jaminproductions.com/prod/media_control/events/northeastern2024/html/
	aws s3 sync scripts/js/ s3://static.jaminproductions.com/prod/media_control/scripts/
	aws cloudfront create-invalidation --distribution-id ${staticcloudfront.id} --paths /prod/media_control/scripts/* /prod/media_control/events/northeastern2024/html/*

deploy-emc-site-stack:
	aws --region us-east-1 cloudformation deploy --template-file frontend/template.yaml --stack-name event-media-control-com --tags Category="Jamin Productions" Type="Event media control" AppManagerCFNStackKey="Jamin-Productions-emc"

deploy-web:
	cd frontend && npm run build
	aws s3 sync frontend/build/ s3://event-media-control.com
	aws cloudfront create-invalidation --distribution-id ${webcloudfront.id} --paths "/*"