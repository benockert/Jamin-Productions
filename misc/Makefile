deploy-static:
	aws --region us-east-1 cloudformation deploy --template-file static_content/jp_static.yaml --stack-name static-jaminproductions-com --tags Category="Jamin Productions" Type="Static content site" AppManagerCFNStackKey="Jamin-Productions-static"

deploy-misc-code-bucket:
	aws --region us-east-1 cloudformation deploy --template-file code_packages/code_package_bucket.yaml --stack-name jaminproductions-misc-code-packages --tags Category="Jamin Productions" Type="Misc code packages"

add-new-event:
	cd scripts && ./new_event.bat

sync-tiles:
	aws s3 cp scripts/files/split s3://static.jaminproductions.com/dev/interactive_media/photo_mosaic/northeastern2024/tiles/32x18 --recursive