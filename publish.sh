#!/bin/sh

# Need this to publish through github as PAT needs to be passed in securely.

npm install -g tfx-cli

if [ "$DEPLOY" = "production" ];
then
   echo "Deploying Production"
   tfx extension publish --manifest-globs azure-devops-extension.json src/**/azure-devops-extension.json --overrides-file configs/release.json --output-path out -t $AZURE_DEVOPS_EXT_PAT
else
   echo "Deploying Development"
   tfx extension publish --manifest-globs azure-devops-extension.json src/**/azure-devops-extension.json --overrides-file configs/dev.json --output-path out -t $AZURE_DEVOPS_EXT_PAT
fi