//Project
import { CommonRepositories, Constants, ProjectService, SearchRepository, SearchResultEntity, TreeNode } from "@esdc-it-rp/azuredevops-common";
import { JsonPatchDocument, Operation } from "azure-devops-extension-api/WebApi";
import { WorkItem, WorkItemErrorPolicy, WorkItemExpand, WorkItemTrackingServiceIds } from "azure-devops-extension-api/WorkItemTracking";
import { CloneSettings } from "./CloneSetting";
import { CloneDialog } from "./CloneDialog";
import { TemplateWorkItemEntity } from "./TemplateWorkItem.entity";
import { TemplateWorkItemService } from "./TemplateWorkItem.service";

