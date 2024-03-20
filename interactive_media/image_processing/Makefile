upload-package:
	aws s3 cp lambda/packages/ s3://jamin-productions-misc-code/packages/image_processing --recursive

update_lambda-dev:
	aws --region us-east-1 lambda update-function-code --function-name "interactive-media-image-processing-dev" --s3-bucket "jamin-productions-misc-code" --s3-key "packages/image_processing/image_processing_v7.zip"

update_lambda-prod:
	aws --region us-east-1 lambda update-function-code --function-name "interactive-media-image-processing-prod" --s3-bucket "jamin-productions-misc-code" --s3-key "packages/image_processing/image_processing_v7.zip"

upload-template: 
	aws s3 cp image_processing.yaml s3://jamin-productions-misc-code/templates/

create-changeset:
	aws --region us-east-1 cloudformation create-change-set --capabilities CAPABILITY_NAMED_IAM --stack-name jp-image-processing-stack-dev --change-set-type CREATE --change-set-name image-processing-cs --template-url https://jamin-productions-misc-code.s3.amazonaws.com/templates/image_processing.yaml

# make sure to update package version if necessary!
deploy-image-process-lambda-dev:
	aws --region us-east-1 cloudformation deploy --template-file image_processing.yaml --capabilities CAPABILITY_NAMED_IAM --stack-name jp-image-processing-stack-dev --parameter-overrides "LambdaCodePackageVersion=5" --tags Category="Jamin Productions" Type="Image processing" AppManagerCFNStackKey="Jamin-Productions-interactive"

# make sure to update package version if necessary!
deploy-image-process-lambda-prod:
	aws --region us-east-1 cloudformation deploy --template-file image_processing.yaml --capabilities CAPABILITY_NAMED_IAM --stack-name jp-image-processing-stack-prod --parameter-overrides "LambdaCodePackageVersion=5" "DeploymentStage=prod" --tags Category="Jamin Productions" Type="Image processing" AppManagerCFNStackKey="Jamin-Productions-interactive"

deploy-image-process-lambda: deploy-image-process-lambda-dev deploy-image-process-lambda-prod

package-dependencies: 
	pip install --platform manylinux2014_x86_64 --target=lambda/layers --implementation cp --python-version 3.11 --only-binary=:all: --upgrade pillow

upload-pillow:
	aws s3 cp lambda/layers/pillow.zip s3://jamin-productions-misc-code/packages/layers/