import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { ReplacementBlock } from "./ReplacementBlock";

export class CloneSettings {
  /**
   * Stores boolean User Input from checkbox
   */
  observableReplaceText: ObservableValue<boolean> =
    new ObservableValue<boolean>(false);

  /**
   * Stores boolean User Input from checkbox
   */
  observableUnassignAll: ObservableValue<boolean> =
    new ObservableValue<boolean>(true);

  /**
   * To return the boolean of the ReplaceText checkbox
   *
   * @returns observableReplaceText
   */
  replaceText(): boolean {
    return this.observableReplaceText.value;
  }

  /**
   * To return the boolean of the UnassignAll checkbox
   *
   * @returns observableUnassignAll
   */
  unassignAll(): boolean {
    return this.observableUnassignAll.value;
  }

  /**
   * Array of all text replacement blocks
   */
  replacements: ReplacementBlock[] = [];
}
