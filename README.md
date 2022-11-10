# Azure DevOps Extension - Boards - template-name

[![Development](https://github.com/sara-sabr/TreePlanting/actions/workflows/development.yml/badge.svg)](https://github.com/sara-sabr/TreePlanting/actions/workflows/development.yml)
[![Production](https://github.com/sara-sabr/rp-azuredevops-reports/actions/workflows/production.yml/badge.svg)](https://github.com/sara-sabr/TreePlanting/actions/workflows/production.yml)

## End User Project Configuration Requirements

1. In your organization you must create a Query with the following settings: ![Query Settings](https://github.com/sara-sabr/rp-azuredevops-templater/blob/main/documentation/QuerySettings.png?raw=true)
2. In the same Query, change the Column settings by adding Parent: ![Column Settings](https://github.com/sara-sabr/rp-azuredevops-templater/blob/main/documentation/QueryColumnSettings.png?raw=true)
3. Create a Folder in Shared Queries, called "Automation," then move the saved query into the newly created folder:
![Query Location](https://github.com/sara-sabr/rp-azuredevops-templater/blob/main/documentation/QueryLocation.png?raw=true)

## Developer Prerequisites

Download and install the following tools

1. [Visual Studio Code](https://code.visualstudio.com/download)
2. [Firefox](https://www.mozilla.org/firefox/) (because the VS Code Debugger for Chrome extension [doesn't support iframes](https://github.com/microsoft/vscode-chrome-debug/issues/786) yet)
3. [Node LTS](https://nodejs.org/en/download/) (make sure its Node LTS - tested with Node 16)
4. The [Debugger for Firefox](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-firefox-debug) VS Code extension

## Instructions

### Setup dependencies

```
npm install
```

### Preparing to publish (Local and PROD)

1. Follow [instructions](https://docs.microsoft.com/en-us/azure/devops/extend/publish/command-line?view=azure-devops)
    - Acquire a Personal Access Token (PAT)

2. Publish the package to the marketplace. You will be prompted for your PAT.
   ```npm run publish:dev```.
3. Bring up the local environment.
   ```npm run start:dev```
3. Open Firefox
4. Ensure you have installed your extension for your organization.
5. Browse to the project/organization and apply end user settings project configuration requirements.
### Publishing Production

1. Publish the package to the marketplace. You will be prompted for your PAT.
   ```npm run publish```.

## Acknowledgements

This extension is based upon [Azure DevOps Extension Hot Reload and Debug
](https://github.com/microsoft/azure-devops-extension-hot-reload-and-debug) and [Azure DevOps Web Sample Extension
](https://github.com/microsoft/azure-devops-extension-sample).
