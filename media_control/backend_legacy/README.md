## Backend (legacy)

Express server designed to be run on EC2 with RDS (MySQL) and a Firebase realtime database.

---

### Live Content Management Software

TODO: custom css page that each html page requires as a style sheet
TODO: fix response statuses
TODO: add model and types to API responses
TODO: add `require("crypto").randomBytes(35).toString("hex")` to build steps and set as env variable

Steps:

1. launch instance
2. open up SSH port 22 on security group of instace
3. ssh in and scp server files
4. install nvm and npm
5. open up rds to ec2 instance
6. run npm start

TODO:

- change user to https://www.digitalocean.com/community/tutorials/how-to-use-pm2-to-setup-a-node-js-production-environment-on-an-ubuntu-vps
- ask Tyler:
- screens media
- is there a banner image
- ask for floor plan of Hospitality Hub

1230 and 530 5/3
1230 530 930 5/4

Switch between

In Cabot:

- Tyler will give livestream iframe
- When celebrations are streaming, on livestream on all screens

- cabot stage with LED screen 16'
- 2 TVs inside cabot

- big screens livestream
- TVs in cabot, cycle through submission codes QR codes for all screens, then each media
- add in some fun slides and static images to cycle through off hours

- off hours, big screens just on main submission

Restore steps:

- restore mysql snapshot into event-media-control vpc
  - make publicaly accessible
- spin up new ec2 instance
  - emc vpc andsecurity group
  - us-east-1a
- connect ec2 to rds instance
- update makefile with ec2 instance name and cloudfront id
- ssh into server and create server directory
- install (pm2)[https://pm2.keymetrics.io/docs/usage/quick-start/]
- run `make deploy` with Git Bash!!!
- ssh to server and run `export NODE_ENV=production` and then `pm2 start index.js --name emc-server --watch`
- copy public IP of ec2 into api urls
- update read/write rules in firebase
- add playback = 0 to firebase under eventId
