import { ObservableValue } from "azure-devops-ui/Core/Observable";

export class ReplacementBlock {

    /**
     * To show what text is being seen by the observableFindText
     * 
     * @returns observableFindText
     */
    findText():string {
        return this.observableFindText.value as string;
    };

    /**
     * To show what text is being seen by the observableReplaceText
     * 
     * @returns observableReplaceText
     */
    replaceText():string {
        return this.observableReplaceText.value as string;
    };
    observableFindText:ObservableValue<string | undefined> = new ObservableValue<string | undefined>("");
    observableReplaceText:ObservableValue<string | undefined> = new ObservableValue<string | undefined>("");
}