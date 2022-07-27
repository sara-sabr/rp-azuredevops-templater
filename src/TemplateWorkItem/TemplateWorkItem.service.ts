// Library Level

import { SearchResultEntity } from "@esdc-it-rp/azuredevops-common";
import { TemplateWorkItemEntity } from "./TemplateWorkItem.entity";

// Project Level

export class TemplateWorkItemService {

    static async loadSelectedWorkItemTree(
        asOf?: Date
    ): Promise<List> {
        const SelectedWorkItemTree: SearchResultEntity<List> =
        await SearchRepository.executeQuery(
            TemplateWorkItemConfig.getQueryForLatest(),
            ProjectRoadmapTaskEntity,
            asOf
      );

        return SelectedWorkItemTree;
    }

    static async applySettings(
        item: TemplateWorkItemEntity, 
        cloneSettings: CloneSettings){

    }
    
}