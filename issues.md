## Solved Issues

1. `"Error: Cannot find module 'express'...`
   - missing dependency/node_modules, run `npm install`
1. `Resource handler returned message: "Unable to validate the following destination configurations`
   - added Lambda::Permission which enabled S3 to invoke Lambda
