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
        const searchQuery = await SearchRepository.getQuery("Shared Queries/Automation/Templater");
        let wiql = searchQuery.wiql;

        // TODO
        // Change the wiql statement to use selectedId instead of hardcoded ID.

        console.log("Perform query");

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
        let workItemPatchDocument:JsonPatchDocument;
        let originalId:number;
        let currentWorkItem:WorkItem;
        let idMapping:Map<number, WorkItem> = new Map();   
        const arrayOfIds:number[] = [];
        let currentIdx = 0;
        let total = items.length;
        const projectName = await ProjectService.getProjectName();

        // TODO
        // For loop to build an array of IDs

        // TODO
        // Request the data .. Note a maximum array size of 200 is allowed, so if the 
        // array size exceeds 200, you'll need to break up the array to get the data 
        // through multiple calls to below and merge the result arrays.
        // @see https://docs.microsoft.com/en-us/rest/api/azure/devops/wit/work-items/get-work-items-batch?view=azure-devops-rest-7.1&tabs=HTTP

        // Delete this line as used it to test it works
        arrayOfIds.push(19);

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
            console.log("Working on " + currentIdx + " out of " + total);

            // TODO:
            // Do the save
            // https://docs.microsoft.com/en-us/rest/api/azure/devops/wit/work-items/create?view=azure-devops-rest-7.1&tabs=HTTP
            // 
            // You will need to build the map with a for loop by looping over item.fields and appending to the workItemPatchDocument array.
            // Example of what the content of the array would look like
            workItemPatchDocument = [
                {
                "op": Operation.Add,
                "path": "/fields/System.Title",
                "from": null,
                "value": "Sample task"
                }
            ];

            const savedItem = await CommonRepositories.WIT_API_CLIENT.createWorkItem(
                workItemPatchDocument, projectName, item.fields[Constants.WIT_FIELD_TYPE], false, true, true);
            console.log("Saved item " + currentIdx + " out of " + total + " as ID " + savedItem.id);
            
            this.cloneDialog.updateProgress("Creating ...", savedItem, currentIdx, total);
            // The savedItem ID should not equal original ID, if it does, your doing something wrong in the patch document.
            // Make sure you skip the "ID" field in there.

            idMapping.set(originalId, savedItem);
        }

        workItemPatchDocument = {}
        currentIdx = 0;
        console.log("----- Start Related section --------");
        
        // Force return for now unless your ready to create relationship items.
        return;

        // Do the relationships based off the ID map.
        for (const item of results) {
            currentIdx++;
            // Rebuild your update and this time do updates to create the relationships
            console.log("Working on " + currentIdx + " out of " + total);

            currentWorkItem = idMapping.get(item.id) as WorkItem;

            // Example for one relation:
            workItemPatchDocument = [
                {
                "op": Operation.Add,
                "Path": "/relations/-",
                "Value": {
                    // System.LinkTypes.Hierarchy-Forward is for Child
                    // System.LinkTypes.Hierarchy-Reverse is for Parent
                    // @see https://docs.microsoft.com/en-us/azure/devops/boards/queries/link-type-reference?view=azure-devops
                    "rel": "System.LinkTypes.Hierarchy-Forward",

                    // This should not be URL as it needs to map to the newly associated ID.
                    "url": item.url
                }               
                } 
            ];

            // call update
            await CommonRepositories.WIT_API_CLIENT.updateWorkItem(                
                workItemPatchDocument, currentWorkItem.id, projectName, false, true, true);
            this.cloneDialog.updateProgress("Relationship ...", currentWorkItem, currentIdx, total);
            console.log("Updated item " + currentIdx + " out of " + total + " as ID " + currentWorkItem.id);

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
        
    }
    
}