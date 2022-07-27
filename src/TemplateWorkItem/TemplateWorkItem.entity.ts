//Library Level
import { WorkItem } from "azure-devops-extension-api/WorkItemTracking";

//Project Level
import { WorkItemBaseEntity } from "@esdc-it-rp/azuredevops-common";

/**
 * Template copy of work item.
 */
export class TemplateWorkItemEntity extends WorkItemBaseEntity {
    /**
     * The higher level work items associated with the particular item 
     */
    successors: number[] = [];

    /**
     * The lower level work items associated with the particular item
     */
    predecessors: number[] = [];
}