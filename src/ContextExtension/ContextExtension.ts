//import { Panel } from "@fluentui/react";
import {
  CommonServiceIds,
  IHostPageLayoutService,
  PanelSize,
} from "azure-devops-extension-api";
import * as SDK from "azure-devops-extension-sdk";
import { CloneDialog } from "../CloneDialog/CloneDialog";

SDK.register("Context-Add-Template", () => {
  return {
    execute: async (context: any) => {
      /**
       * When selecting Work Items to copy, we want the user to only select
       * the parent item. All children items underneath the parent will be copied
       * without having to directly copy them as well.
       */
      
      let selectedItem: number = context.workItemIds.length;

      if (selectedItem != 1) {
        alert("Error, cannot select more than one item at a time");
      }

      if (selectedItem == 1) {
        const dialogService = await SDK.getService<IHostPageLayoutService>(
          CommonServiceIds.HostPageLayoutService
        );

        dialogService.openPanel<ICloneDialogState>(
          SDK.getExtensionContext().id + "." + CloneDialog.REL_CONTRIBUTION_ID,
          {
            title: "Template Clone",
            size: PanelSize.Large,
            // Options
            onClose: (result) => {
              if (result !== undefined) {
                // TODO: Highlight the created entry
              }
            },
          }
        );
      }
    },
  };
});
