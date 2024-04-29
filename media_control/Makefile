ec2.id=ec2-44-198-176-45
webcloudfront.id=E3LAHEE9CXO5O4
staticcloudfront.id=E3U0ZH1BFZK6SL

deploy-server:
	scp -i emc_key.pem ./server/package.json ec2-user@${ec2.id}.compute-1.amazonaws.com:/home/ec2-user/server/
	ssh -i emc_key.pem -f ec2-user@${ec2.id}.compute-1.amazonaws.com command "cd server && npm install"
	scp -i emc_key.pem -r ./server/src/ ec2-user@${ec2.id}.compute-1.amazonaws.com:/home/ec2-user/server/
	
deploy: deploy-web deploy-server

copy-html:
	scp -i emc_key.pem -r ./server/src/html/5 ec2-user@${ec2.id}.compute-1.amazonaws.com:/home/ec2-user/server/src/html


ssh:
	ssh -i emc_key.pem ec2-user@${ec2.id}.compute-1.amazonaws.com

setup-server:
	ssh -i emc_key.pem -f ec2-user@${ec2.id}.compute-1.amazonaws.com command "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash && . ~/.nvm/nvm.sh && nvm install --lts"

sync-static-dev:
	aws s3 sync frontend/html/dev/ s3://static.jaminproductions.com/dev/media_control/events/northeastern2024/html/
	aws s3 sync frontend/js/dev/ s3://static.jaminproductions.com/dev/media_control/scripts/
	aws cloudfront create-invalidation --distribution-id ${staticcloudfront.id} --paths /dev/media_control/scripts/* /dev/media_control/events/northeastern2024/html/*

# make event=northeastern2024 sync-static
sync-static-prod:
	aws s3 sync frontend/html/prod/ s3://static.jaminproductions.com/prod/media_control/events/northeastern2024/html/
	aws s3 sync frontend/js/prod/ s3://static.jaminproductions.com/prod/media_control/scripts/
	aws cloudfront create-invalidation --distribution-id ${staticcloudfront.id} --paths /prod/media_control/scripts/* /prod/media_control/events/northeastern2024/html/*

deploy-emc-site-stack:
	aws --region us-east-1 cloudformation deploy --template-file frontend/template.yaml --stack-name event-media-control-com --tags Category="Jamin Productions" Type="Event media control" AppManagerCFNStackKey="Jamin-Productions-emc"

deploy-web:
	cd frontend && npm run build
	aws s3 sync frontend/build/ s3://event-media-control.com
	aws cloudfront create-invalidation --distribution-id ${webcloudfront.id} --paths "/*"