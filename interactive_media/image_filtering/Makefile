# package-lambda:
# 	zip -r lambda/packages/image_filtering_python_package.zip lambda/code

upload-package:
	aws s3 cp lambda/packages/ s3://jamin-productions-misc-code/packages/image_filtering --recursive

update_lambda-dev: upload-package
	aws --region us-east-1 lambda update-function-code --function-name "interactive-media-image-filtering-dev" --s3-bucket "jamin-productions-misc-code" --s3-key "packages/image_filtering/image_filtering_v4.zip"

update_lambda-prod: upload-package
	aws --region us-east-1 lambda update-function-code --function-name "interactive-media-image-filtering-prod" --s3-bucket "jamin-productions-misc-code" --s3-key "packages/image_filtering/image_filtering_v4.zip"

upload-template: 
	aws s3 cp image_filtering.yaml s3://jamin-productions-misc-code/templates/

create-changeset:
	aws --region us-east-1 cloudformation create-change-set --capabilities CAPABILITY_NAMED_IAM --stack-name jp-image-filtering-stack-dev --change-set-type CREATE --change-set-name image-filtering-cs --template-url https://jamin-productions-misc-code.s3.amazonaws.com/templates/image_filtering.yaml

# make sure to update package version if necessary!
deploy-filter-lambda-dev:
	aws --region us-east-1 cloudformation deploy --template-file image_filtering.yaml --capabilities CAPABILITY_NAMED_IAM --stack-name jp-image-filtering-stack-dev --parameter-overrides "LambdaCodePackageVersion=4" --tags Category="Jamin Productions" Type="Image filtering" AppManagerCFNStackKey="Jamin-Productions-interactive"

# make sure to update package version if necessary!
deploy-filter-lambda-prod:
	aws --region us-east-1 cloudformation deploy --template-file image_filtering.yaml --capabilities CAPABILITY_NAMED_IAM --stack-name jp-image-filtering-stack-prod --parameter-overrides "LambdaCodePackageVersion=4" "DeploymentStage=prod" --tags Category="Jamin Productions" Type="Image filtering" AppManagerCFNStackKey="Jamin-Productions-interactive"

deploy-filter-lambda: deploy-filter-lambda-dev deploy-filter-lambda-prod