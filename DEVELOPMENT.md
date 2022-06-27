# Development Information

This file lists all reference material that is of use during the development of this extension.

**Table of Contents**
- [Development Information](#development-information)
  - [Microsoft documentation](#microsoft-documentation)
  - [Sample code](#sample-code)

## Microsoft documentation

- [Overview of a Microsoft Extension](https://docs.microsoft.com/en-us/azure/devops/extend/overview?view=azure-devops)
This provies an overview of developing custom extensions and service-hooks.

- [Manifest Information](https://docs.microsoft.com/en-us/azure/devops/extend/develop/manifest?view=azure-devops)
The manifest provides the extension integration points into Azure DevOps and the Marketplace.

- [Contribution Targets](https://docs.microsoft.com/en-us/previous-versions/azure/devops/extend/reference/targets/overview#targets)
Lists all the locations (not exhaustive) in Azure DevOps that you can extend or attach to.

- [Shift from VSS SDK and Azure SDK](https://github.com/microsoft/azure-devops-extension-sdk/issues/10)
The latest SDK to use for an extension as Azure DevOps Extension SDK is promoted in favor of Visual Studio SDK.

- [UI Compontents](https://developer.microsoft.com/en-gb/azure-devops/components)
The Formula Design System provides common UI widgets for Azure DevOps extensions as well as design recommendations.

- [API Endpoints](https://docs.microsoft.com/en-us/previous-versions/azure/devops/integrate/previous-apis/overview)
Public API that are available for Azure DevOps.

- [Icon Names](https://uifabricicons.azurewebsites.net/)
Icon names available when using the ***icons*** such as ```iconName``` attributes in various UI components.

- [Process Migrator](https://github.com/microsoft/process-migrator)
Microsoft node program to import/export processes from Azure DevOps. If cannot update a proceess

- [Azure Boards Default Fieldss](https://docs.microsoft.com/en-us/azure/devops/boards/work-items/guidance/work-item-field?view=azure-devops)
List of all fields available, you can use view source in query to also get the field names by hovering over the dropdowns.

## Sample code

- [Azure DevOps Web Sample Extension](https://github.com/microsoft/azure-devops-extension-sample)
Repository of examples that leverage the Azure DevOps Extension SDK.

- [Azure DevOps Extension Hot Reload and Debug](https://github.com/microsoft/azure-devops-extension-hot-reload-and-debug)
How to create a hot reloable plugin for different environments. This extension leverages the configuration listed with some customizations.

- [Visual Studio Team Services (VSTS) Sample Extensions](https://github.com/microsoft/vsts-extension-samples)
Repository of examples which are better used as an idea of how to approach problems then actual code references as this uses the VSS SDK.

- [Azure DevOps Engineering Marketplace Extensions](https://github.com/microsoft/azure-devops-engineering-extensions)
Another one, has an example of emailing and PR. However, this is more of a pipeline task sending emails, which doesn't meet our use case.
