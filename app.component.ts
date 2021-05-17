import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { DiagramComponent } from '@syncfusion/ej2-angular-diagrams';
import {
  NodeModel,
  ConnectorModel,
  DiagramTools,
  Diagram,
  DataBinding,
  ComplexHierarchicalTree,
  SnapConstraints,
  SnapSettingsModel,
  LayoutModel,
  LayoutOrientation,
  UserHandleModel,
  SelectorModel,
  SelectorConstraints,
  ToolBase,
  MoveTool,
  cloneObject,
  MouseEventArgs,
  randomId,
  IElement
} from '@syncfusion/ej2-diagrams';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import {
  ChangeEventArgs,
  DropDownListComponent
} from '@syncfusion/ej2-angular-dropdowns';
import { DataManager } from '@syncfusion/ej2-data';
import * as Data from './diagram-data.json';
import { TextBoxComponent } from '@syncfusion/ej2-angular-inputs';
Diagram.Inject(DataBinding, ComplexHierarchicalTree);

export interface DataInfo {
  [key: string]: string;
}

/**
 * Default FlowShape sample
 */

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  @ViewChild('diagram', null)
  public diagram: DiagramComponent;

  @ViewChild('dialog', null)
  public dialog: DialogComponent;

  @ViewChild('textbox', null)
  public textbox: TextBoxComponent;

  public layoutData: Object[] = [];

  public getNodes(): Object[] {
    for (let i: number = 0; i < this.diagram.nodes.length; i++) {
      let node: NodeModel = this.diagram.nodes[i];
      let data: object = { Id: node.id, Name: (node.data as any).Name };
      this.layoutData.push(data);
    }
    return this.layoutData;
  }

  public fields: Object = { text: 'Name', value: 'Id' };
  public dlgButtons: Object[] = [
    {
      click: this.dlgButtonClick.bind(this),
      buttonModel: { content: 'Update', isPrimary: true }
    }
  ];
  public sourceID: string;
  public targetID: string;

  // custom code start
  public dlgButtonClick(evt: Event): void {
    let dialogHeader: string = this.dialog.header as string;
    let selectedItem: NodeModel | ConnectorModel;
    if (this.diagram.selectedItems.nodes.length > 0) {
      //update the node annotation
      this.diagram.selectedItems.nodes[0].annotations[0].content = this.textbox.value;
      this.diagram.dataBind();
      this.dialog.hide();
    }
  }

  public nodeDefaults(obj: NodeModel): NodeModel {
    obj.width = 60;
    obj.height = 60;
    obj.annotations = [
      {
        content: (obj.data as any).Name
      }
    ];
    //Initialize shape
    obj.shape = { type: 'Basic', shape: 'Rectangle', cornerRadius: 7 };
    return obj;
  }

  public data: Object = {
    id: 'Name',
    parentId: 'ReportingPerson',
    dataSource: new DataManager((Data as any).multiParentData),
    //binds the external data with node
    doBinding: (nodeModel: NodeModel, data: DataInfo, diagram: Diagram) => {
      /* tslint:disable:no-string-literal */
      nodeModel.style = {
        fill: data['fillColor'],
        strokeWidth: 1,
        strokeColor: data['border']
      };
    }
  };

  public connDefaults(connector: ConnectorModel): void {
    connector.type = 'Orthogonal';
    connector.cornerRadius = 7;
    connector.targetDecorator.height = 7;
    connector.targetDecorator.width = 7;
    connector.style.strokeColor = '#6d6d6d';
  }

  public getCustomTool: Function = this.getTool.bind(this);

  public snapSettings: SnapSettingsModel = {
    constraints: SnapConstraints.None
  };

  public layout: LayoutModel = {
    type: 'ComplexHierarchicalTree',
    horizontalSpacing: 40,
    verticalSpacing: 40,
    orientation: 'TopToBottom',
    margin: { left: 10, right: 0, top: 50, bottom: 0 }
  };

  //Defines the user handle collection for nodes in diagram
  public handles: UserHandleModel[] = [
    {
      name: 'orgEditHandle',
      pathColor: 'white',
      backgroundColor: '#7d7d7d',
      borderColor: 'white',
      pathData:
        'M 42.65 30.41 L 67.5 53.99 L 41.2 78.73 C 39.41 80.42 37.34 81.27 34.99 81.27 C 32.65 81.27 30.57 80.49 28.78 78.93 L 25.05 82.44 L 0 82.44 L 16.36 67.05 C 14.57 65.36 13.67 63.41 13.67 61.2 C 13.67 58.99 14.57 56.98 16.36 55.16 z M 78.42 25.49 C 78.57 0 78.73 0.01 78.88 0.01 C 81.09 -0.12 83.09 0.66 84.88 2.35 L 97.52 14.04 C 99.17 15.86 100 17.87 100 20.09 C 100 22.29 99.17 24.24 97.52 25.93 L 71.84 50.09 L 46.79 26.51 L 72.47 2.35 C 74.15 0.77 76.13 -0.02 78.42 25.49 z',
      side: 'Right',
      offset: 0,
      horizontalAlignment: 'Center',
      verticalAlignment: 'Center'
    }
  ];

  //define userhandles in selected items
  public selectedItems: SelectorModel = {
    constraints: SelectorConstraints.UserHandle,
    userHandles: this.handles
  };

  public getTool(action: string): ToolBase {
    console.log('ddd');
    let tool: ToolBase;
    if (action === 'orgEditHandle') {
      //this block executes while selecting a userhandle
      let orgEditTool: OrgEditHandleTool = new OrgEditHandleTool(
        this.diagram.commandHandler
      );
      orgEditTool.diagram = this.diagram;
      orgEditTool.dialog = this.dialog;
      orgEditTool.textbox = this.textbox;
      return orgEditTool;
    }
    return tool;
  }

  ngOnInit(): void {}
}

class OrgEditHandleTool extends ToolBase {
  public diagram: Diagram = null;
  public dialog: DialogComponent = null;
  public textbox: TextBoxComponent = null;
  public mouseDown(args: MouseEventArgs): void {
    this.inAction = true;
    super.mouseDown(args);
  }
  public mouseUp(args: MouseEventArgs): void {
    console.log('sss');
    if (this.inAction) {
      if (this.diagram.selectedItems.nodes.length > 0) {
        //set a node value in the textbox
        this.textbox.value = this.diagram.selectedItems.nodes[0].annotations[0].content;
        //open the dialog
        console.log('sss');
        this.dialog.show();
      }
    }
    super.mouseUp(args);
  }
}
