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

/**
 * Following variables that are associated with the various checkboxes
 * and text boxes in the design.
 */

export class CloneDialog extends React.Component<{}, ICloneDialogState> {

  private copyCheckbox = new ObservableValue<boolean>(false);
  private replaceCheckbox = new ObservableValue<boolean>(false);
  private unassignCheckbox = new ObservableValue<boolean>(false);
  
  private findObservable1 = new ObservableValue<string>("");
  private findObservable2 = new ObservableValue<string>("");
  private findObservable3 = new ObservableValue<string>("");
  
  private replaceObservable1 = new ObservableValue<string>("");
  private replaceObservable2 = new ObservableValue<string>("");
  private replaceObservable3 = new ObservableValue<string>("");

  private selectedWorkItem:TreeNode<TemplateWorkItemEntity, number>[] | undefined; 

  /**
   * Relative extension ID without the [publisher].[extensionid] prefix.
   */
  static readonly REL_CONTRIBUTION_ID = "clone-template-dialog-wizard";

  constructor(props: {}) {
    super(props);
    this.state = {
      screenNumber: 1,
      width: 1000,
      height: 1000,
    };
  }

  public componentDidMount() {
    SDK.init();
    TemplateWorkItemService.cloneDialog = this;
    this.loadSelectedItem();
  }

  /**
   * TODO
   */
  private async loadSelectedItem():Promise<void> {
    const selectedWorkItemId:number = 4;
    //console.log(selectedWorkItemId)
    this.selectedWorkItem = await TemplateWorkItemService.loadSelectedWorkItemTree(selectedWorkItemId);
  }

  /**
   * TODO
   */
  private prcessRequest():void {
    // console.log(this);

    this.setState({screenNumber: 2})
    this.asyncProcessRequest();
  }

  /**
   * TODO
   */
  private async asyncProcessRequest():Promise<void> {
    // TODO: First get the backend working
    //       Then don't do the below but use the UI clone setting binding (react).
    const cloneSettings = new CloneSettings();
    cloneSettings.copyHierarchy = false;
    cloneSettings.replaceText = true;
    cloneSettings.unassignAll = true;
    cloneSettings.replacements.set("##replace##", "Test 1");

    if (this.selectedWorkItem) {
      TemplateWorkItemService.processItems(this.selectedWorkItem, cloneSettings);
    }
  }

  /**
   * 
   * @param messge
   * @param workItem 
   * @param currentIdx
   * @param total
   */
  public updateProgress(message:string, workItem:WorkItem, currentIdx:number, total:number):void {
    // TODO update
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
        
        {/* In the following divs, we have separated all the different checkboxes
        and the textboxes to be filled. In the checkboxes, we have onChange functions'
        but they are not yet to be used and shall only be used in the backend programming
        section. 
        In the classnames, we are using the special conditions that align the different
        items on the screen.
        */}

        <div className="rhythm-vertical-8 flex-column">
          <Checkbox
            onChange={(event, checked) => (this.copyCheckbox.value = checked)}
            checked={this.copyCheckbox}
            label="Copy Hierarchy"
          />

          <Checkbox
            onChange={(event, checked) => (this.replaceCheckbox.value = checked)}
            checked={this.replaceCheckbox}
            label="Replace Text"
          />
        </div>

        <div className='parent'>
          <FormItem label="Find Text">
            <TextField
              prefixIconProps={{
                render: className => <span className={className}></span>
              }}
              onChange={(e, newValue) => (this.findObservable1.value = newValue)}
              width={TextFieldWidth.auto}
            />

            <TextField
              value=""
              onChange={(e, newValue) => (this.findObservable2.value = newValue)}
              width={TextFieldWidth.auto}
            />

            <TextField
              onChange={(e, newValue) => (this.findObservable3.value = newValue)}
              placeholder=""
              width={TextFieldWidth.auto}
            />
          </FormItem>

          <FormItem label="Replace Text">
            <TextField
              prefixIconProps={{
                render: className => <span className={className}></span>
              }}
              onChange={(e, newValue) => (this.replaceObservable1.value = newValue)}
              width={TextFieldWidth.auto}
            />

            <TextField
              value=""
              onChange={(e, newValue) => (this.replaceObservable2.value = newValue)}
              width={TextFieldWidth.auto}
            />

            <TextField
              value=""
              onChange={(e, newValue) => (this.replaceObservable3.value = newValue)}
              width={TextFieldWidth.auto}
            />
          </FormItem>
        </div>

        <div>
          <Checkbox
            onChange={(event, checked) => (this.unassignCheckbox.value = checked)}
            checked={this.unassignCheckbox}
            label="Unassign All"
          />
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

        {/* For the progress bar, we are using a different module
        and can be found in this link: 
        https://www.npmjs.com/package/@ramonak/react-progress-bar */}

        <ProgressBar 
          completed={60}
          labelClassName="Copying stuff"
        />
        
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
      <div className="flex-column flex-grow" style={{width: "500px", height: "500px"}}>
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
