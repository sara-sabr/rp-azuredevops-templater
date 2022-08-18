# Azure DevOps Extension - Boards - template-name

[![Development](https://github.com/sara-sabr/TreePlanting/actions/workflows/development.yml/badge.svg)](https://github.com/sara-sabr/TreePlanting/actions/workflows/development.yml)
[![Production](https://github.com/sara-sabr/rp-azuredevops-reports/actions/workflows/production.yml/badge.svg)](https://github.com/sara-sabr/TreePlanting/actions/workflows/production.yml)

This Azure Boards extension provides canned reporting capability for an Azure Project.

## End User Project Configuration Requirements

## Developer Prerequisites

Download and install the following tools

1. [Visual Studio Code](https://code.visualstudio.com/download)
2. [Firefox](https://www.mozilla.org/firefox/) (because the VS Code Debugger for Chrome extension [doesn't support iframes](https://github.com/microsoft/vscode-chrome-debug/issues/786) yet)
3. [Node LTS](https://nodejs.org/en/download/) (make sure its Node LTS - tested with Node 16)
4. The [Debugger for Firefox](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-firefox-debug) VS Code extension
5. The [tfx-cli](https://www.npmjs.com/package/tfx-cli) npm package
6. The [webpack](https://www.npmjs.com/package/webpack) npm package
7. The [webpack-dev-server](https://www.npmjs.com/package/webpack-dev-server) npm package
8. The [progress-bar](https://www.npmjs.com/package/@ramonak/react-progress-bar) npm package

> If you would prefer not to install the npm packages globally, you can add them to devDependencies in your `package.json` file and invoke them with scripts. You can use the [package.json](./package.json) in this repo as a template for scripts and to ensure you have the correct versions of packages in your extension.

## Instructions

### Setup dependencies

```
npm install
```

### Preparing to publish (Local and PROD)

1. Follow [instructions](https://docs.microsoft.com/en-us/azure/devops/extend/publish/command-line?view=azure-devops)
    - Acquire a Personal Access Token (PAT)

### How to use template

1. Find all instances of and change it:
    - ```template-id```: Lower case only extension ID name with if needed "." as separators 
    - ```template-name```: English name of extension
    - ```template-name-english```: English name of extension
    - ```template-project```: SABR GitHub project name

2. Update ```azure-devops-extension.json``` with any changes needed not tied to "contributions"
3. For each contributions, you can use ```src/Template``` as an example. Do rename all "Template" including the file names to what you need. 

Once your ready to test, perform the following:

1. Publish the package to the marketplace. You will be prompted for your PAT.
   ```npm run publish:dev```.
2. Bring up the local environment.
   ```npm run start:dev```
3. Open Firefox
4. Ensure you have installed your extension for your organization.
5. Browse to the project/organzation.
6. In your organization you must create a Query with the following settings then save: !/rp-azuredevops-templater/blob/main/documentation/QuerySettings.png
7. Create a Folder in Shared Queries, called "Automation," then move the saved query into the newly created folder: https://github.com/sara-sabr/rp-azuredevops-templater/blob/main/documentation/QueryLocation.png




### Publishing Production

1. Publish the package to the marketplace. You will be prompted for your PAT.
   ```npm run publish```.

## Acknowledgements

This extension is based upon [Azure DevOps Extension Hot Reload and Debug
](https://github.com/microsoft/azure-devops-extension-hot-reload-and-debug) and [Azure DevOps Web Sample Extension
](https://github.com/microsoft/azure-devops-extension-sample).
