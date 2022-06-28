import {
  CommonServiceIds,
  IHostPageLayoutService,
} from "azure-devops-extension-api";
import * as SDK from "azure-devops-extension-sdk";
import { CloneDialog } from "../CloneDialog/CloneDialog";

SDK.register("Context-Add-Template", () => {
  return {
    execute: async (context: any) => {
      let selectedIds: number[] = context.workItemIds;

      // TODO: Only allow length of 1 array
      //  < 1 or > 1 Show error
      //  = 1 Show Window

      const dialogService = await SDK.getService<IHostPageLayoutService>(
        CommonServiceIds.HostPageLayoutService
      );

      dialogService.openCustomDialog<ICloneDialogState>(
        SDK.getExtensionContext().id + "." + CloneDialog.REL_CONTRIBUTION_ID,
        {
          title: "Template Clone",
          // Options
          onClose: (result) => {
            if (result !== undefined) {
              // TODO: Highlight the created entry
            }
          },
        }
      );
    },
  };
});
