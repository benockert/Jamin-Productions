#!/bin/bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash && . ~/.nvm/nvm.sh && nvm install --lts
npm install pm2@latest -g
wget https://dev.mysql.com/get/mysql80-community-release-el9-1.noarch.rpm
dnf install mysql80-community-release-el9-1.noarch.rpm -y
dnf install mysql-community-server -y