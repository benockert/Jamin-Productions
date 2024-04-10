## Solved Issues

1. `"Error: Cannot find module 'express'...`
   - missing dependency/node_modules, run `npm install`
1. `Resource handler returned message: "Unable to validate the following destination configurations`
   - added Lambda::Permission which enabled S3 to invoke Lambda
1. `Unable to get object metadata from S3. Check object key, region and/or access permissions.`
   - s3-object-lambda:\* permissions to Lambda execution role

## Need-to-solve Issues

- `https://us-west-2.console.aws.amazon.com/cloudwatch/home?region=us-west-2#logsV2:log-groups/log-group/$252Faws$252Flambda$252Frequests-spotify-integration-prod/log-events/2024$252F03$252F13$252F$255B$2524LATEST$255Dddc9da51210e4908acffe7907de3ceb1`
- Mobile floating image padding
  - fixed 3/13 by adding custom vh css variable
- Pagination on scroll
  - commit 601613fe8d33f4220a0e9e92039f5a26c1f9a236
