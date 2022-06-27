import "es6-promise/auto";
import * as SDK from "azure-devops-extension-sdk";
import { CommonServiceIds, getClient, IHostPageLayoutService } from "azure-devops-extension-api";
import { BuildDefinition, BuildRestClient } from "azure-devops-extension-api/Build";
import * as React from "react";
import { Button } from "azure-devops-ui/Button";
import { Panel } from "azure-devops-ui/Panel";

SDK.register("Context-Add-Template", () => {
    return {
        execute: async (context: any) => {
            let selectedIds: number[]=context.workItemIds;
            // if length = 1, show the window. Otherwise, no window.
            if (context.workItemIds.length==1) {
                
            }
            console.log(selectedIds);
        }
    }
});

SDK.init();