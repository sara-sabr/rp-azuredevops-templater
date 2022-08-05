// Library Level

import { CommonRepositories, Constants, ProjectService, SearchRepository, SearchResultEntity, TreeNode } from "@esdc-it-rp/azuredevops-common";
import { JsonPatchDocument, Operation } from "azure-devops-extension-api/WebApi";
import { WorkItem, WorkItemErrorPolicy, WorkItemExpand, WorkItemTrackingServiceIds } from "azure-devops-extension-api/WorkItemTracking";
import { CloneSettings } from "./CloneSetting";
import { CloneDialog } from "./CloneDialog";
import { TemplateWorkItemEntity } from "./TemplateWorkItem.entity";

// Project Level

/**
 * 
 */
export class TemplateWorkItemService {

    static readonly SKIP_FIELDS = ["System.Id", "System.Rev", "System.AuthorizedDate", "System.RevisedDate",
                            "System.State", "System.CreatedDate", "System.CreatedBy", "System.ChangedDate",
                            "System.ChangedBy", "System.AuthorizedAs", "System.PersonId", "System.Watermark",
                            "System.CommentCount", "Microsoft.VSTS.Common.StateChangeDate", "Microsoft.VSTS.Scheduling.TargetDate",
                            "Microsoft.VSTS.Scheduling.StartDate", "System.IterationLevel2", "Microsoft.VSTS.Common.ActivatedDate", "Microsoft.VSTS.Common.ActivatedBy",
                            "System.WorkItemType", "System.Parent", "System.History", "Microsoft.VSTS.Scheduling.RemainingWork"];

    static cloneDialog:CloneDialog;

    /**
     * 
     * @param selectedId 
     * @returns 
     */
    static async loadSelectedWorkItemTree(selectedId:number
    ): Promise<TreeNode<TemplateWorkItemEntity, number >[]> {
    
        // Folder name + name of query 
        // Shared Queries/.../query
        const searchQuery = await SearchRepository.getQuery("Shared Queries/Automation/Template Copy Query");
        let basewiql = searchQuery.wiql;

        /**
         * This statement will change the ID of the query in the WIQL statement
         * If you wish to look for a different work item, 
         * please refer to CloneDialog.tsx under loadSelectedItem()
         */
        let wiql = basewiql.replace('4', String(selectedId));

        const searchResults: SearchResultEntity<TemplateWorkItemEntity, number> =
        await SearchRepository.executeQueryWiql(
            wiql,
            TemplateWorkItemEntity
        );

        return TreeNode.walkTreePreOrder(searchResults);
    }

   /**
     * 
     * @param item 
     * @param cloneSettings 
     */
    static async processItems(
        items: TreeNode<TemplateWorkItemEntity, number>[], 
        cloneSettings: CloneSettings){

        let currentItem: TreeNode<TemplateWorkItemEntity, number>;
        let workItemPatchDocument = [];
        let originalId:number;
        let currentWorkItem:WorkItem;
        let idMapping:Map<number, WorkItem> = new Map();   
        const arrayOfIds:number[] = [];
        let currentIdx = 0;
        let total = items.length;
        const projectName = await ProjectService.getProjectName();

        // For loop to build an array of IDs
        for (var i = 0; i < total; i++) {
            currentItem = items[i];
            if (currentItem.data){
                arrayOfIds.push(currentItem.data.id);
            }
        }

        // Request the data .. Note a maximum array size of 200 is allowed, so if the 
        // array size exceeds 200, you'll need to break up the array to get the data 
        // through multiple calls to below and merge the result arrays.
        // @see https://docs.microsoft.com/en-us/rest/api/azure/devops/wit/work-items/get-work-items-batch?view=azure-devops-rest-7.1&tabs=HTTP

        const results = await CommonRepositories.WIT_API_CLIENT.getWorkItemsBatch({
            ids: arrayOfIds,
            $expand: WorkItemExpand.All,
            fields: [],
            asOf: new Date(),
            errorPolicy: WorkItemErrorPolicy.Fail // May need to flip this to omitt
        });

        for (const item of results) {
            originalId = item.id;
            currentIdx++;
            this.applySettings(item, cloneSettings);

            // TODO:
            // Do the save
            // https://docs.microsoft.com/en-us/rest/api/azure/devops/wit/work-items/create?view=azure-devops-rest-7.1&tabs=HTTP
            // 
            // You will need to build the map with a for loop by looping over item.fields and appending to the workItemPatchDocument array.
            // Example of what the content of the array would look like
            const fields = item.fields;
            workItemPatchDocument = [];

            for (const f in fields) {
                //console.log(f + " = " + fields[f]);
                if(TemplateWorkItemService.SKIP_FIELDS.indexOf(f) > -1) {
                    continue;
                }
                    
                workItemPatchDocument.push({
                    "op": Operation.Add,
                    "path": "/fields/" + f,
                    "from": null,
                    "value": fields[f]
                });
            }

            const savedItem = await CommonRepositories.WIT_API_CLIENT.createWorkItem(
                workItemPatchDocument, projectName, item.fields[Constants.WIT_FIELD_TYPE], false, true, true);
            let currentMessage = "Saved item " + currentIdx + " out of " + total + " as ID " + savedItem.id;
            
            this.cloneDialog.updateProgress("Creating " + currentMessage, savedItem, currentIdx, total);
            // The savedItem ID should not equal original ID, if it does, your doing something wrong in the patch document.
            // Make sure you skip the "ID" field in there.

            idMapping.set(originalId, savedItem);
            console.log(idMapping);
        }

        workItemPatchDocument = []
        currentIdx = 0;
        console.log("----- Start Related section --------");
        
        // Force return for now unless your ready to create relationship items.


        // Do the relationships based off the ID map.
        for (const item of results) {
            currentIdx++;
            // Rebuild your update and this time do updates to create the relationships
            console.log("Working on " + currentIdx + " out of " + total);

            currentWorkItem = idMapping.get(item.id) as WorkItem;
            console.log(item.relations);
            for (const f of item.relations) {
                let lastSlashIndex = f.url.lastIndexOf("/") + 1;
                let relationshipId = f.url.substring(lastSlashIndex,);
                console.log(relationshipId);
                workItemPatchDocument.push({
                    "op": Operation.Add,
                    "path": "/relations/-",
                    "from": null,
                    "value": {
                        "rel": f.rel,
                        "url": f.url
                    }
                });
            }

            // Example for one relation:
            // workItemPatchDocument = [
            //     {
            //     "op": Operation.Add,
            //     "Path": "/relations/-",
            //     "Value": {
            //         // System.LinkTypes.Hierarchy-Forward is for Child
            //         // System.LinkTypes.Hierarchy-Reverse is for Parent
            //         // @see https://docs.microsoft.com/en-us/azure/devops/boards/queries/link-type-reference?view=azure-devops
            //         "rel": "System.LinkTypes.Hierarchy-Forward",

            //         // This should not be URL as it needs to map to the newly associated ID.
            //         "url": item.url
            //     }               
            //     } 
            // ];

            // // call update
            // await CommonRepositories.WIT_API_CLIENT.updateWorkItem(                
            //     workItemPatchDocument, currentWorkItem.id, projectName, false, true, true);
            // this.cloneDialog.updateProgress("Relationship ...", currentWorkItem, currentIdx, total);
            // console.log("Updated item " + currentIdx + " out of " + total + " as ID " + currentWorkItem.id);

        }        
    }
 


    /**
     * 
     * @param item 
     * @param cloneSettings 
     */
    static applySettings(
        item: WorkItem, 
        cloneSettings: CloneSettings):void{
        // Set what you want to do 
        // String replacements
        if(cloneSettings.replaceText){
            for (const f in item.fields) {
                if ((typeof item.fields[f]) == 'string') {
                let stringReplacement = item.fields[f] as String;
                cloneSettings.replacements.forEach((value, key) => {
                        stringReplacement = stringReplacement.replace(key, value);
                });
                    
                    item.fields[f] = stringReplacement;
                }
            }
        }

        if(cloneSettings.unassignAll){
            delete item.fields["System.AssignedTo"];
        }
        

        // Do the actual logic by referencing what clone setting provided.
    }
    
}