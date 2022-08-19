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
// import { TemplateCopyService } from "./TemplateCopy.service";

/**
 * Following variables that are associated with the various checkboxes
 * and text boxes in the design.
 */

export class CloneDialog extends React.Component<{}, ICloneDialogState> {

  private copyCheckbox = new ObservableValue<boolean>(false);
  private replaceCheckbox = new ObservableValue<boolean>(false);
  private unassignCheckbox = new ObservableValue<boolean>(false);
  
  // private findObservable1 = new ObservableValue<string>("");
  // private findObservable2 = new ObservableValue<string>("");
  // private findObservable3 = new ObservableValue<string>("");
  
  // private replaceObservable1 = new ObservableValue<string>("");
  // private replaceObservable2 = new ObservableValue<string>("");
  // private replaceObservable3 = new ObservableValue<string>("");

  private selectedWorkItem:TreeNode<TemplateWorkItemEntity, number>[] | undefined; 

  /**
   * Selected work item ID (root ID).
   */
  private selectedWorkItemId:number = -1;

  /**
   * Relative extension ID without the [publisher].[extensionid] prefix.
   */
  static readonly REL_CONTRIBUTION_ID = "clone-template-dialog-wizard";

  private workState: ICloneDialogState;

  constructor(props: {}) {
    super(props);

    this.workState = {
      screenNumber: -1,
      progress: 0,
      message: ""
    }; 
    this.state = this.workState;
  }

  public componentDidMount() {
    SDK.init();
    SDK.ready().then(() => {
      const configuration = SDK.getConfiguration();
      console.log(configuration);
      if (configuration.selectedWorkItemId) {
        // Mounting is loaded twice, so only load the rest if the ID is actually provided.
        this.selectedWorkItemId = configuration.selectedWorkItemId as number;        
        TemplateWorkItemService.cloneDialog = this;
        this.loadSelectedItem();   
      }
    });
  }

  /**
   * Pulls the data of the user selected Work Item and brings the user to page 1
   * 
   * @returns Promise<void>
   */
  private async loadSelectedItem():Promise<void> {
    this.selectedWorkItem = await TemplateWorkItemService.loadSelectedWorkItemTree(this.selectedWorkItemId);
    this.updatePage(1);
  }

  /**
   * Processes the User's inputs and changes the page to the progress screen
   * 
   * @returns void
   */
  private prcessRequest():void {
    this.updatePage(2);
    this.asyncProcessRequest();
  }

  private async asyncProcessRequest():Promise<void> {

    // TODO: Update the follow settings based upon the UI inputs

    const cloneSettings = new CloneSettings();
    cloneSettings.copyHierarchy = false;
    cloneSettings.replaceText = true;
    cloneSettings.unassignAll = this.unassignCheckbox.value;
    cloneSettings.replacements.set("##replace##", "Test 1");

    if (this.selectedWorkItem) {
      TemplateWorkItemService.processItems(this.selectedWorkItem, cloneSettings);
    }
  }

  private refreshPage = ()=> {
    this.dismiss(false);
    window.location.reload;
  }

  /**
   * Update the page number which will force a refresh.
   */
  private updatePage(pageNumber: number):void {
    this.workState.screenNumber =  pageNumber;
    this.setState(this.workState);
  }

  /**
   * 
   * Update the progress on screen for user
   * 
   * @param message
   * @param workItem 
   * @param currentIdx
   * @param total
   */
  public updateProgress(message:string, workItem:WorkItem, currentIdx:number, total:number):void {
    this.workState.progress = Math.trunc((currentIdx/total) * 100);
    this.workState.message = message;
    this.setState(this.workState);
  }

  /**
   * Initial screen - Selection
   *
   * @returns JSX element
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
          {/*
          <div className="flex-row">
            <Checkbox
              onChange={(event, checked) => (this.replaceCheckbox.value = checked)}
              checked={this.replaceCheckbox}
              label="Replace Text"
            />
          </div>
          <div className='flex-row rhythm-horizontal-8 padding-vertical-8 margin-left-16 padding-left-16'>
            <FormItem label="Find Text">
              <TextField
                prefixIconProps={{
                  render: className => <span className={className}></span>
                }}
                onChange={(e, newValue) => (this.findObservable1.value = newValue)}
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
            </FormItem>
          </div>
          */}

          <div className="flex-row">
            <Checkbox
              onChange={(event, checked) => (this.unassignCheckbox.value = checked)}
              checked={this.unassignCheckbox}
              label="Unassign All"
            />
          </div>
        </div>        
        
        <div className="padding-top-16 separator-line-top absolute full-width" style={{bottom: 20}}>
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
        <p>{this.state.message}</p>

        {/* For the progress bar, we are using a different module
        and can be found in this link: 
        https://www.npmjs.com/package/@ramonak/react-progress-bar */}

        <ProgressBar 
          completed={this.state.progress}
          labelClassName=""
        />
        
        <div className="padding-top-16 separator-line-top absolute full-width" style={{bottom: 20}}>
            <Button
              primary={true}
              text="Close"
              onClick={() => {
                this.dismiss(false);
                window.location.reload(true)}
              }
            />
        </div>
      </div>
    );
  }

  /**
   * Render function to display the panel and transition the screens
   * 
   * @returns Jsx.Element
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
