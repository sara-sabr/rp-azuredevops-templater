import "azure-devops-ui/Core/override.css";
import "./iconFont.css";
import "./CloneDialog.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as SDK from "azure-devops-extension-sdk";

import { Button } from "azure-devops-ui/Button";
import { ButtonGroup } from "azure-devops-ui/ButtonGroup";

import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { Checkbox } from "azure-devops-ui/Checkbox";

const copyCheckbox = new ObservableValue<boolean>(false);
const replaceCheckbox = new ObservableValue<boolean>(false);
const unassignCheckbox = new ObservableValue<boolean>(false);

export class CloneDialog extends React.Component<{}, ICloneDialogState> {
  /**
   * Relative extension ID without the [publisher].[extensionid] prefix.
   */
  static readonly REL_CONTRIBUTION_ID = "clone-template-dialog-wizard";

  constructor(props: {}) {
    super(props);
    this.state = {
      screenNumber: 1,
    };
  }

  public componentDidMount() {
    SDK.init();
  }

  /**
   * Initial screen - Selection
   *
   * @returns JSX element
   */
  public renderScreenInitial(): JSX.Element {
    return (
      <div>
        {
          // TODO:
          // 1. Add the content for the inital screen.
          // 2. Move the button bar to the bottom (Hint CSS classname)
          // 3. On click of the Next button, it should NOT dismiss but update the screen number to 2.
        }
        <div className="rhythm-vertical-8 flex-column">
          <Checkbox
          onChange={(event, checked) => (copyCheckbox.value = checked)}
          checked={copyCheckbox}
          label="Copy Hierarchy"
          />
        </div>
        
        <div>
          <Checkbox
            onChange={(event, checked) => (replaceCheckbox.value = checked)}
            checked={replaceCheckbox}
            label="Replace Text"
          />
        </div>

        <div>
          <Checkbox
            onChange={(event, checked) => (unassignCheckbox.value = checked)}
            checked={unassignCheckbox}
            label="Unassign All"
          />
        </div>

        <div className="btn-right">
          <ButtonGroup className="btn btn-primary">
            <Button
              primary={true}
              text="Next"
              onClick={() => this.dismiss(true)}
            />
            <Button text="Cancel" onClick={() => this.dismiss(false)} />
          </ButtonGroup>
        </div>
      </div>
    );
  }

  /**
   * Progress screen.
   *
   * @returns JSX element
   */
  public renderScreenProgress(): JSX.Element {
    return (
      <div>
        Progress Screen
        {
          // TODO:
          // 1. Add the content for the progress screen.
          // 2. Move the button bar to the bottom (Hint CSS classname)
          // 3. On click of the Next button, it should dismiss only when the progress is complete, button should be disabled till it is.
          // 4. If cancel is clicked, it should stop the current activity.
        }
        <ButtonGroup className="">
          <Button
            primary={true}
            text="Next"
            onClick={() => this.dismiss(true)}
          />
          <Button text="Cancel" onClick={() => this.dismiss(false)} />
        </ButtonGroup>
      </div>
    );
  }

  public render(): JSX.Element {
    return (
      <div className="flex-column flex-grow">
        {this.state.screenNumber === 1 && this.renderScreenInitial()}
        {this.state.screenNumber === 2 && this.renderScreenProgress()}
      </div>
    );
  }

  private dismiss(useValue: boolean) {
    const config = SDK.getConfiguration();
    if (config.dialog) {
      config.dialog.close(true);
    } else if (config.panel) {
      config.panel.close(true);
    }
  }
}

ReactDOM.render(<CloneDialog />, document.getElementById("root"));
