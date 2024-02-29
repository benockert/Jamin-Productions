# Miscellaneous Event Forms

Made by and for 'Jamin Productions

## Requests

For event attendees to submit song requests

## Interactive

Various forms for accepting user submissions to interactive media applications

#### To-do

- [x] Add 404 page to root directory or redirect to main website once done
- [ ] Add cloud front distibution to serverless template
- [x] Create dashboard for viewing list of requests
- [x] Rewrite Form.js to make use of children props so SubmitRequest.js can handle the message compontents rather than passing info to Form.js
- [x] Create favicon and logos
- [ ] Route api gateway to custom domain
- [ ] Add routing to functions in serverless template i.e. /requests goes to request handler
- [ ] Standardize .json responses to always include status code and message
- [ ] Move get-playlists from Makefile to scripts/
- [ ] Replace `request` module with other option: https://stackoverflow.com/questions/6158933/how-is-an-http-post-request-made-in-node-js
- [ ] Remove hardcoded api gateway endpoint (once first event finished and migrate to new domain)
