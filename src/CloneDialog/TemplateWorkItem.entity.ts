//Project Level
import { WorkItemBaseEntity } from "@esdc-it-rp/azuredevops-common";

/**
 * Template copy of work item.
 */
export class TemplateWorkItemEntity extends WorkItemBaseEntity {
  /**
   * The lower level work items associated with the particular item
   */
  successors: number[] = [];

  /**
   * The higher level work items associated with the particular item
   */
  predecessors: number[] = [];
}
