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

import { TextField, TextFieldWidth } from "azure-devops-ui/TextField";
import { FormItem } from "azure-devops-ui/FormItem";

import ProgressBar from "@ramonak/react-progress-bar";
import { TemplateWorkItemService } from "./TemplateWorkItem.service";
import { TemplateWorkItemEntity } from "./TemplateWorkItem.entity";
import { CloneSettings } from "./CloneSetting";
import { TreeNode } from "@esdc-it-rp/azuredevops-common";
import { WorkItem } from "azure-devops-extension-api/WorkItemTracking";
import { ReplacementBlock } from "./ReplacementBlock";

/**
 * Following variables that are associated with the various checkboxes
 * and text boxes in the design.
 */

export class CloneDialog extends React.Component<{}, ICloneDialogState> {
  private cloneSettings = new CloneSettings();

  /**
   * Selected work item
   */
  private selectedWorkItem:
    | TreeNode<TemplateWorkItemEntity, number>[]
    | undefined;

  /**
   * Selected work item ID (root ID).
   */
  private selectedWorkItemId: number = -1;

  /**
   * Relative extension ID without the [publisher].[extensionid] prefix.
   */
  static readonly REL_CONTRIBUTION_ID = "clone-template-dialog-wizard";

  /**
   * Transition of states to manage flow of program.
   */
  private workState: ICloneDialogState;

  constructor(props: {}) {
    super(props);

    this.workState = {
      screenNumber: -1,
      progress: 0,
      message: "",
      replaceItems: 0,
    };
    this.state = this.workState;
  }

  /**
   * Initializes
   */
  public componentDidMount() {
    SDK.init();
    SDK.ready().then(() => {
      const configuration = SDK.getConfiguration();
      if (configuration.selectedWorkItemId) {
        this.selectedWorkItemId = configuration.selectedWorkItemId as number;
        TemplateWorkItemService.cloneDialog = this;
        this.loadSelectedItem();
      }
    });
  }

  /**
   * Pulls the data of selected Work Item and transitions to
   *  initial screen
   */
  private async loadSelectedItem(): Promise<void> {
    this.selectedWorkItem =
      await TemplateWorkItemService.loadSelectedWorkItemTree(
        this.selectedWorkItemId
      );
    this.updatePage(1);
  }

  /**
   * Processes the User's inputs and changes the page to the progress screen
   */
  private prcessRequest(): void {
    this.updatePage(2);
    this.asyncProcessRequest();
  }

  /**
   * Processes the user's inputs in the initial screen
   */
  private async asyncProcessRequest(): Promise<void> {
    if (this.selectedWorkItem) {
      TemplateWorkItemService.processItems(
        this.selectedWorkItem,
        this.cloneSettings
      );
    }
  }

  /**
   * Update the page number which will force a refresh.
   */
  private updatePage(pageNumber: number): void {
    this.workState.screenNumber = pageNumber;
    this.setState(this.workState);
  }

  /**
   * Update the progress on screen for user
   *
   * @param message, to displayed to the user
   * @param workItem that is being processed
   * @param currentIdx the current workItem ID that is being worked on
   * @param total, the total number of work items being worked on per process
   */
  public updateProgress(
    message: string,
    workItem: WorkItem,
    currentIdx: number,
    total: number
  ): void {
    this.workState.progress = Math.trunc((currentIdx / total) * 100);
    this.workState.message = message;
    this.setState(this.workState);
  }

  /**
   * Increases the number of text replacement fields
   */
  private incrementReplace(): void {
    this.workState.replaceItems++;
    this.setState(this.workState);
  }

  /**
   * Generates a text replacement block for the user to update
   *
   * @param index number of text fields to be created
   * @returns JSX.element returns the text field
   */
  private generateReplacementUI(index: number): JSX.Element {
    if (index >= this.cloneSettings.replacements.length) {
      this.cloneSettings.replacements.push(new ReplacementBlock());
    }
    var replacement = this.cloneSettings.replacements[index];
    return (
      <div className="flex-row rhythm-horizontal-8 padding-vertical-8 margin-left-16 padding-left-16">
        <FormItem className={index > 0 ? "hide-label" : ""} label="Find Text">
          <TextField
            value={replacement.observableFindText}
            onChange={(e, newValue) =>
              (replacement.observableFindText.value = newValue)
            }
            width={TextFieldWidth.auto}
          />
        </FormItem>

        <FormItem
          className={index > 0 ? "hide-label" : ""}
          label="Replace Text"
        >
          <TextField
            value={replacement.observableReplaceText}
            onChange={(e, newValue) =>
              (replacement.observableReplaceText.value = newValue)
            }
            width={TextFieldWidth.auto}
          />
        </FormItem>
      </div>
    );
  }

  /**
   * Creates all the text replacement fields to be generated
   *
   * @returns JSX.Element replace text fields to be generated
   */
  private generateAllReplacements(): JSX.Element[] {
    var widgets: JSX.Element[] = [];
    for (let index = 0; index < this.workState.replaceItems; index++) {
      widgets.push(this.generateReplacementUI(index));
    }
    return widgets;
  }

  /**
   * Assigns true of false to Unassign All
   *
   * @param event
   * @param checked
   */
  private eventUnassignCheckbox(
    event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
    checked: boolean
  ): void {
    this.cloneSettings.observableUnassignAll.value = checked;
  }

  /**
   * Assigns boolean value to Replace Text
   *
   * @param event
   * @param checked
   */
  private eventReplaceTextCheckbox(
    event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
    checked: boolean
  ): void {
    this.cloneSettings.observableReplaceText.value = checked;
    this.setState(this.workState);
  }

  /**
   * Initial screen - Selection
   *
   * @returns JSX.element
   */
  public renderScreenInitial(): JSX.Element {
    return (
      <div className="panel-window flex-grow">
        {/* In the following divs, we have separated all the different checkboxes
        and the textboxes to be filled. In the checkboxes, we have onChange functions'
        but they are not yet to be used and shall only be used in the backend programming
        section. 
        In the classnames, we are using the special conditions that align the different
        items on the screen.
        */}
        <div className="flex-grow padding-bottom-16">
          <div className="flex-row">
            <Checkbox
              onChange={this.eventReplaceTextCheckbox.bind(this)}
              checked={this.cloneSettings.observableReplaceText}
              label="Replace Text"
            />
            <Button
              className={
                this.cloneSettings.replaceText() ? "fadeIn" : "fadeOut"
              }
              text="Add Replacement"
              onClick={this.incrementReplace.bind(this)}
            />
          </div>

          {this.generateAllReplacements()}

          <div className="flex-row">
            <Checkbox
              onChange={this.eventUnassignCheckbox.bind(this)}
              checked={this.cloneSettings.observableUnassignAll}
              label="Unassign All"
            />
          </div>
        </div>

        <div
          className="padding-top-16 separator-line-top absolute full-width"
          style={{ bottom: 20 }}
        >
          <ButtonGroup className="btn btn-primary">
            <Button
              primary={true}
              text="Next"
              onClick={this.prcessRequest.bind(this)}
            />
            <Button text="Cancel" onClick={() => this.dismiss(false)} />
          </ButtonGroup>
        </div>
      </div>
    );
  }

  /**
   * Progress screen to be displayed
   *
   * @returns JSX.element, progress screen and the progress bar
   */
  public renderScreenProgress(): JSX.Element {
    return (
      <div>
        <p>{this.state.message}</p>

        {/* For the progress bar, we are using a different module
        and can be found in this link: 
        https://www.npmjs.com/package/@ramonak/react-progress-bar */}

        <ProgressBar completed={this.state.progress} labelClassName="" />

        <div
          className="padding-top-16 separator-line-top absolute full-width"
          style={{ bottom: 20 }}
        >
          <Button
            primary={true}
            text="Close"
            onClick={() => {
              this.dismiss(false);
              window.location.reload(true);
            }}
          />
        </div>
      </div>
    );
  }

  /**
   * Render function to display the panel and transition the screens
   *
   * @returns JSX.Element, the screens to be displayed
   */
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
