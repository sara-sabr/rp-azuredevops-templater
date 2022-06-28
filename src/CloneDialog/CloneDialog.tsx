import "azure-devops-ui/Core/override.css";
import "./iconFont.css";
import "./CloneDialog.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as SDK from "azure-devops-extension-sdk";

import { Button } from "azure-devops-ui/Button";
import { ButtonGroup } from "azure-devops-ui/ButtonGroup";

export class CloneDialog extends React.Component<{}, ICloneDialogState> {
  /**
   * Relative extension ID without the [publisher].[extensionid] prefix.
   */
  static readonly REL_CONTRIBUTION_ID = "clone-template-dialog-wizard";

  constructor(props: {}) {
    super(props);
    this.state = {};
  }

  public componentDidMount() {
    SDK.init();
  }

  public render(): JSX.Element {
    return (
      <div className="flex-column flex-grow">
        Content goes here
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
