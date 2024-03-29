// Library Level

import {
  CommonRepositories,
  Constants,
  ProjectService,
  SearchRepository,
  SearchResultEntity,
  TreeNode,
} from "@esdc-it-rp/azuredevops-common";
import {
  JsonPatchDocument,
  Operation,
} from "azure-devops-extension-api/WebApi";
import {
  WorkItem,
  WorkItemErrorPolicy,
  WorkItemExpand,
  WorkItemTrackingServiceIds,
} from "azure-devops-extension-api/WorkItemTracking";
import { CloneSettings } from "./CloneSetting";
import { CloneDialog } from "./CloneDialog";
import { TemplateWorkItemEntity } from "./TemplateWorkItem.entity";

// Project Level

/**
 * Work Item fields to not be copied
 */
export class TemplateWorkItemService {
  static readonly SKIP_FIELDS = [
    "System.Id",
    "System.Rev",
    "System.AuthorizedDate",
    "System.RevisedDate",
    "System.State",
    "System.CreatedDate",
    "System.CreatedBy",
    "System.ChangedDate",
    "System.ChangedBy",
    "System.AuthorizedAs",
    "System.PersonId",
    "System.Watermark",
    "System.CommentCount",
    "Microsoft.VSTS.Common.StateChangeDate",
    "Microsoft.VSTS.Scheduling.TargetDate",
    "Microsoft.VSTS.Scheduling.StartDate",
    "System.IterationLevel2",
    "Microsoft.VSTS.Common.ActivatedDate",
    "Microsoft.VSTS.Common.ActivatedBy",
    "System.WorkItemType",
    "System.Parent",
    "System.History",
    "Microsoft.VSTS.Scheduling.RemainingWork",
    "System.BoardColumn",
    "System.BoardColumnDone",
  ];

  static cloneDialog: CloneDialog;

  /**
   * Loads in the selected work item from the query
   *
   * @param selectedId
   * @returns searchResults
   */
  static async loadSelectedWorkItemTree(
    selectedId: number
  ): Promise<TreeNode<TemplateWorkItemEntity, number>[]> {
    const searchQuery = await SearchRepository.getQuery(
      "Shared Queries/Automation/Template Copy Query"
    );
    let basewiql = searchQuery.wiql;

    /**
     * This statement will change the ID of the query in the WIQL statement
     * If you wish to look for a different work item,
     * please refer to CloneDialog.tsx under loadSelectedItem()
     */
    let wiql = basewiql.replace("4", String(selectedId));

    const searchResults: SearchResultEntity<TemplateWorkItemEntity, number> =
      await SearchRepository.executeQueryWiql(wiql, TemplateWorkItemEntity);

    return TreeNode.walkTreePreOrder(searchResults);
  }

  /**
   * From the selected work item, create a copy of the work tree
   *
   * @param item work item to be processed
   * @param cloneSettings copying parametres (Replace Text and/or Unassign All)
   */
  static async processItems(
    items: TreeNode<TemplateWorkItemEntity, number>[],
    cloneSettings: CloneSettings
  ) {
    let currentItem: TreeNode<TemplateWorkItemEntity, number>;
    let workItemPatchDocument = [];
    let originalId: number;
    let currentWorkItem: WorkItem;
    let idMapping: Map<number, WorkItem> = new Map();
    const arrayOfIds: number[] = [];
    let currentIdx = 0;
    let currentStage = 0;
    let total = items.length;
    let displayTotal = total + total;

    const projectName = await ProjectService.getProjectName();

    // For loop to build an array of IDs
    for (var i = 0; i < total; i++) {
      currentItem = items[i];
      if (currentItem.data) {
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
      errorPolicy: WorkItemErrorPolicy.Fail, // May need to flip this to omitt
    });

    // For loop to create new Work items from the original pulled Work items
    for (const item of results) {
      originalId = item.id;
      currentIdx++;
      currentStage++;
      this.applySettings(item, cloneSettings);

      // You will need to build the map with a for loop by looping over item.fields and appending to the workItemPatchDocument array.
      // Example of what the content of the array would look like
      const fields = item.fields;
      workItemPatchDocument = [];

      for (const f in fields) {
        if (TemplateWorkItemService.SKIP_FIELDS.indexOf(f) > -1) {
          continue;
        }

        workItemPatchDocument.push({
          op: Operation.Add,
          path: "/fields/" + f,
          from: null,
          value: fields[f],
        });
      }

      const savedItem = await CommonRepositories.WIT_API_CLIENT.createWorkItem(
        workItemPatchDocument,
        projectName,
        item.fields[Constants.WIT_FIELD_TYPE],
        false,
        true,
        true
      );
      let createMessage =
        "Saved item " +
        currentIdx +
        " out of " +
        total +
        " as ID " +
        savedItem.id;

      this.cloneDialog.updateProgress(
        "Creating " + createMessage,
        savedItem,
        currentStage,
        displayTotal
      );
      /**
       * When mapping the new work item tree to replicate the original work item tree.
       * We associate the new work items to the ID of the original work items in the mapping.
       */
      idMapping.set(originalId, savedItem);
    }

    currentIdx = 0;

    // For loop to build the relationships between the created Work Items
    for (const originalWorkItem of results) {
      currentIdx++;
      currentStage++;

      currentWorkItem = idMapping.get(originalWorkItem.id) as WorkItem;
      workItemPatchDocument = [];
      for (const relationship of originalWorkItem.relations) {
        //From the original Work Items, we break down the url to grab the relationship ID.
        //With the relationship ID, we refer back to idMapping and associate the current created work item to the other created work items

        let lastSlashIndex = relationship.url.lastIndexOf("/") + 1;
        let relationshipId = relationship.url.substring(lastSlashIndex);
        let associatedWorkItem = idMapping.get(Number(relationshipId));

        console.log(
          originalWorkItem.id + "/" + relationship.rel + "   " + relationshipId
        );
        if (associatedWorkItem != undefined) {
          workItemPatchDocument.push({
            op: Operation.Add,
            path: "/relations/-",
            from: null,
            value: {
              rel: relationship.rel,
              url: associatedWorkItem.url,
            },
          });
        }
      }

      // call update
      await CommonRepositories.WIT_API_CLIENT.updateWorkItem(
        workItemPatchDocument,
        currentWorkItem.id,
        projectName,
        false,
        true,
        true
      );
      let updateMessage =
        "Updated Relationship item " +
        currentIdx +
        " out of " +
        total +
        " as ID " +
        currentWorkItem.id;
      this.cloneDialog.updateProgress(
        updateMessage,
        currentWorkItem,
        currentStage,
        displayTotal
      );
    }
  }

  /**
   * Applies the user settings from the UI
   *
   * @param item work item to have settings applied to
   * @param cloneSettings copying parametres (Repace Text and/or Unassign All)
   */
  static applySettings(item: WorkItem, cloneSettings: CloneSettings): void {
    console.log(cloneSettings);

    // String replacements
    if (cloneSettings.replaceText()) {
      for (const f in item.fields) {
        if (typeof item.fields[f] == "string") {
          let stringReplacement = item.fields[f] as String;
          cloneSettings.replacements.forEach((value) => {
            stringReplacement = stringReplacement.replace(
              value.findText(),
              value.replaceText()
            );
          });

          item.fields[f] = stringReplacement;
        }
      }
    }

    if (cloneSettings.unassignAll()) {
      delete item.fields["System.AssignedTo"];
    }
  }
}
