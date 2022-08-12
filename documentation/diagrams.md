# Diagrams

## UML Class Diagrams

Not all members are shown as only the fields that is used in this diagram will be displayed. 

```mermaid
classDiagram
  class WorkItemBaseEntity {
    +id : number
    +parent : number
    +type : string
    +sourceWorkItem : WorkItem | undefined
    +title : string
    +populateFromWorkItem(WorkItem) void
  }
  <<abstract>> WorkItemBaseEntity   
  
  class TemplateWorkItemEntity {
    +successors : number[]
    +predecessors : number[]
  }
  WorkItemBaseEntity <|-- TemplateWorkItemEntity : Inheritance
  <<Entity>> TemplateWorkItemEntity   
  
  class CloneSetting {
    +copyHierarchy : boolan
    +replaceText : boolean
    +unassignAll: boolean    
    +replacements : Map~string,string~
  }
  
  class TemplateWorkItemService {
    -SKIP_FIELDS : String
    -dialog : CloneDialog
    +loadSelectedWorkItemTree(number : selectedId)$ Promise~List~
    +processItems(items: List~TemplateWorkItemEntity~, cloneSettings: CloneSettings)
    -applySettings(item: WorkItem, cloneSettings: CloneSettings)
    
  }
  <<service>> TemplateWorkItemService   

  class CloneDialog {
    -unassignCheckbox : ObservableObject<boolean>
    -selectedWorkItem : List~TemplateWorkItemEntity~
    -selectedWorkItemId : number
    +componentDidMount() void
    -loadSelectedItem() Promise~void~
    -prcessRequest() void
    -AsyncprocessRequest() Promise~void~
    -updatePage(number: pageNumber) void
    +updateProgress(string: message, workItem: WorkItem, number: currentIdx, total:number) void
    +renderScreenInitial() JSX.Element 
    +renderScreenProgress() JSX.Element
    +render() JSX.Element
    -dismiss(boolean: useValue)
  }
  <<controller>> CloneDialog   
```

## Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant HTML
    participant CloneDialog
    participant TemplateWorkItemService
    participant CloneSetting
    participant TemplateWorkItemEntity
    participant WorkItemTrackingRestClient 
    participant SearchRepository

    User->>HTML: Request Clone
    HTML->>CloneDialog: componentDidMount()
    Note over HTML,CloneDialog: React will call componentDidMount()
    CloneDialog->>CloneDialog: render
    CloneDialog->>TemplateWorkItemService: loadSelectedWorkItem()
    TemplateWorkItemService->>SearchRepository: getQuery()
    Note right of TemplateWorkItemService: Change the WIQL statement to use your selected ID
    TemplateWorkItemService->>SearchRepository:executeQueryWiql() 
    Note right of TemplateWorkItemService: Create a list of TemplateWorkItemEntity    
    CloneDialog->>HTML: view panel displayed
    User->>HTML: Fill in clone settings
    HTML->>CloneDialog:processRequest()
    par HTML to CloneDialog
      CloneDialog->>CloneDialog: renderScreenProgress()
      CloneDialog->>HTML: Show progress    
    and Asychronous call from processRequest()
      CloneDialog->>TemplateWorkItemService: processItem()
        loop items
          TemplateWorkItemService->>TemplateWorkItemService: Create ID array of items to copy
        end
        TemplateWorkItemService->>WorkItemTrackingRestClient: Azure Devops API workitemsbatch
        loop results
          TemplateWorkItemService->>TemplateWorkItemService: applySettings()
          Note right of TemplateWorkItemService: Apply all requested settings to the work item (replacement, unassignment, etc...)
          activate TemplateWorkItemService        
          Note right of TemplateWorkItemService: Clear out ID to create a new item
          Note right of TemplateWorkItemService: Clear out the relationship (to be done later)
          TemplateWorkItemService->>WorkItemTrackingRestClient: Azure DevOps API create
          Note right of TemplateWorkItemService: Save mapping of source ID to created ID
          TemplateWorkItemService->>CloneDialog: updateProgress()
          deactivate TemplateWorkItemService
        end
        loop result
          Note right of TemplateWorkItemService: Based off sourec, remake the new relationships by consulting the map above
          TemplateWorkItemService->>WorkItemTrackingRestClient: Azure DevOps API update
          TemplateWorkItemService->>CloneDialog: updateProgress()
        end                                
    end
    
```