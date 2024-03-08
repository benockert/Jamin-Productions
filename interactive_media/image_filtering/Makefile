package-lambda:
	zip -r lambda/packages/image_filtering_python_package.zip lambda/code

upload-package:
	aws s3 cp lambda/packages/ s3://jamin-productions-misc-code/image_filtering --recursive

upload-template: 
	aws s3 cp image_filtering.yaml s3://jamin-productions-misc-code/templates/

create-changeset:
	aws --region us-east-1 cloudformation create-change-set --capabilities CAPABILITY_NAMED_IAM --stack-name jp-image-filtering-stack-dev --change-set-type CREATE --change-set-name image-filtering-cs --template-url https://jamin-productions-misc-code.s3.amazonaws.com/templates/image_filtering.yaml