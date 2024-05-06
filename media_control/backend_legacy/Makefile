ec2.id=ec2-44-198-176-45

deploy-server:
	scp -i emc_key.pem ./server/package.json ec2-user@${ec2.id}.compute-1.amazonaws.com:/home/ec2-user/server/
	ssh -i emc_key.pem -f ec2-user@${ec2.id}.compute-1.amazonaws.com command "cd server && npm install"
	scp -i emc_key.pem -r ./server/src/ ec2-user@${ec2.id}.compute-1.amazonaws.com:/home/ec2-user/server/
	
copy-html:
	scp -i emc_key.pem -r ./server/src/html/5 ec2-user@${ec2.id}.compute-1.amazonaws.com:/home/ec2-user/server/src/html

ssh:
	ssh -i emc_key.pem ec2-user@${ec2.id}.compute-1.amazonaws.com

setup-server:
	ssh -i emc_key.pem -f ec2-user@${ec2.id}.compute-1.amazonaws.com command "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash && . ~/.nvm/nvm.sh && nvm install --lts"
