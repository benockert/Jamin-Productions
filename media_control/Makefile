ec2.id=ec2-44-198-176-45
webcloudfront.id=ELA3HAHUGMT3E
staticcloudfront.id=E3U0ZH1BFZK6SL

deploy-web:
	cd web && npm run build
	aws s3 sync web/build/ s3://event-media-control-front-end 
	aws cloudfront create-invalidation --distribution-id ${cloudfront.id} --paths "/*"

deploy-server:
	scp -i emc_key.pem ./server/package.json ec2-user@${ec2.id}.compute-1.amazonaws.com:/home/ec2-user/server/
	ssh -i emc_key.pem -f ec2-user@${ec2.id}.compute-1.amazonaws.com command "cd server && npm install"
	scp -i emc_key.pem -r ./server/src/ ec2-user@${ec2.id}.compute-1.amazonaws.com:/home/ec2-user/server/
	
deploy: deploy-web deploy-server

copy-html:
	scp -i emc_key.pem -r ./server/src/html/5 ec2-user@${ec2.id}.compute-1.amazonaws.com:/home/ec2-user/server/src/html

# make event=northeastern2024 sync-static
sync-static:
	aws s3 sync frontend/html/ s3://static.jaminproductions.com/emc/events/northeastern2024/html/
	aws s3 sync frontend/js/ s3://static.jaminproductions.com/emc/scripts/
	aws cloudfront create-invalidation --distribution-id ${staticcloudfront.id} --paths /emc/scripts/* /emc/events/northeastern2024/html/*

ssh:
	ssh -i emc_key.pem ec2-user@${ec2.id}.compute-1.amazonaws.com

setup-server:
	ssh -i emc_key.pem -f ec2-user@${ec2.id}.compute-1.amazonaws.com command "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash && . ~/.nvm/nvm.sh && nvm install --lts"
