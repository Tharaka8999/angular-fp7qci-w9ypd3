import { DialogAllModule } from '@syncfusion/ej2-angular-popups';

import { DiagramAllModule, SymbolPaletteAllModule, OverviewAllModule } from '@syncfusion/ej2-angular-diagrams';

import { ListViewAllModule } from '@syncfusion/ej2-angular-lists';

import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';

import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';

import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';

import { NumericTextBoxModule, ColorPickerModule, UploaderModule, TextBoxModule } from '@syncfusion/ej2-angular-inputs';

import { DropDownButtonModule } from '@syncfusion/ej2-angular-splitbuttons';

import { ButtonModule, CheckBoxModule, RadioButtonModule } from '@syncfusion/ej2-angular-buttons';

import { HttpModule } from '@angular/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';

import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';
import { AppComponent } from '../app.component';
@NgModule({ declarations: [ AppComponent ], imports: [ DiagramAllModule, SymbolPaletteAllModule, OverviewAllModule, ButtonModule,       ColorPickerModule, CheckBoxModule, ToolbarModule, DropDownButtonModule, UploaderModule, DropDownListAllModule, ListViewAllModule,       DialogAllModule, TextBoxModule, RadioButtonModule,       MultiSelectModule, NumericTextBoxModule, BrowserModule], providers: [], bootstrap: [AppComponent]
})
export class AppModule { }
