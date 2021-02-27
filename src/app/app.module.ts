import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {PERFECT_SCROLLBAR_CONFIG} from 'ngx-perfect-scrollbar';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms'; 
import {DatePipe} from '@angular/common';


import { HttpClientModule } from '@angular/common/http';

import { BackButtonDisableModule } from 'angular-disable-browser-back-button';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HeaderComponent } from './Pages/Layout/Components/header/header.component';
import { FooterComponent } from './Pages/Layout/Components/footer/footer.component';
import { HomeComponent } from './Pages/home/home.component';
import { LandingComponent } from './Pages/landing/landing.component';
import { ViewTaskdefsComponent } from './Pages/View/Conductor/view-taskdefs/view-taskdefs.component';
import { CreateTaskdefComponent } from './Pages/Create/Conductor/create-taskdef/create-taskdef.component';
import { ViewWorkflowsComponent } from './Pages/View/Conductor/view-workflows/view-workflows.component';
import { ApiModule, APIS, BASE_PATH } from './Rest/Conductor';
import { environment } from 'src/environments/environment';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewWorkflowDetailComponent } from './Pages/Details/Conductor/view-workflow-detail/view-workflow-detail.component';
import { ViewWorkflowExecutionsComponent } from './Pages/Reports/Conductor/view-workflow-executions/view-workflow-executions.component';
import { ViewGoJsWorkflowDiagramComponent } from './Pages/Diagram/Components/view-go-js-workflow-diagram/view-go-js-workflow-diagram.component';
import { ViewMermaidWorkflowDiagramComponent } from './Pages/Diagram/Components/view-mermaid-workflow-diagram/view-mermaid-workflow-diagram.component';
import { UpdateTaskdefComponent } from './Pages/Update/Conductor/update-taskdef/update-taskdef.component';
import { ViewTaskDetailComponent } from './Pages/Details/Conductor/view-task-detail/view-task-detail.component';
import { ViewTasksInProgressComponent } from './Pages/Details/Conductor/ComponentPages/view-tasks-in-progress/view-tasks-in-progress.component';
import { ViewMermaidWorlfowExecutionDiagramComponent } from './Pages/Diagram/Components/view-mermaid-worlfow-execution-diagram/view-mermaid-worlfow-execution-diagram.component';
import { ViewWorflowExecutionDetailComponent } from './Pages/Details/Conductor/view-worflow-execution-detail/view-worflow-execution-detail.component';
import { DisplayTasksListComponent } from './Pages/Details/Conductor/ComponentPages/SubComponentPages/display-tasks-list/display-tasks-list.component';
import { DisplayBranchesListComponent } from './Pages/Details/Conductor/ComponentPages/display-branches-list/display-branches-list.component';
import { DisplayJsonComponent } from './Pages/Details/Conductor/ComponentPages/display-json/display-json.component';
import { ViewConfigComponent } from './Pages/View/Conductor/view-config/view-config.component';
import { ViewQueuesAndPollDataComponent } from './Pages/View/Conductor/view-queues-and-poll-data/view-queues-and-poll-data.component';
import { LoaderComponent } from './Pages/Layout/Components/loader/loader.component';
import { ViewIndividualWorkflowExecutionsComponent } from './Pages/Reports/Conductor/view-individual-workflow-executions/view-individual-workflow-executions.component';
import { ViewIndividualWorkflowRunningExecutionsComponent } from './Pages/Reports/Conductor/view-individual-workflow-running-executions/view-individual-workflow-running-executions.component';
import { LoginComponent } from './Pages/login/login.component';
import { ToastrModule } from 'ng6-toastr-notifications';
import { InitiateSimpleConductorWorkflowCreationComponent } from './Pages/Create/Conductor/SimpleConductorWorkflow/initiate-simple-conductor-workflow-creation/initiate-simple-conductor-workflow-creation.component';
import { DefineSimpleConductorWorkflowCreationComponent } from './Pages/Create/Conductor/SimpleConductorWorkflow/define-simple-conductor-workflow-creation/define-simple-conductor-workflow-creation.component';
import { WireSimpleConductorWorkflowCreationComponent } from './Pages/Create/Conductor/SimpleConductorWorkflow/wire-simple-conductor-workflow-creation/wire-simple-conductor-workflow-creation.component';
import { ConfirmSimpleConductorWorkflowCreationComponent } from './Pages/Create/Conductor/SimpleConductorWorkflow/confirm-simple-conductor-workflow-creation/confirm-simple-conductor-workflow-creation.component';
import { DragDropModule } from "@angular/cdk/drag-drop";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LandingComponent,
    ViewTaskdefsComponent,
    CreateTaskdefComponent,
    ViewWorkflowsComponent,
    ViewWorkflowDetailComponent,
    ViewWorkflowExecutionsComponent,
    ViewGoJsWorkflowDiagramComponent,
    ViewMermaidWorkflowDiagramComponent,
    UpdateTaskdefComponent,
    ViewTaskDetailComponent,
    ViewTasksInProgressComponent,
    ViewMermaidWorlfowExecutionDiagramComponent,
    ViewWorflowExecutionDetailComponent,
    DisplayTasksListComponent,
    DisplayBranchesListComponent,
    DisplayJsonComponent,
    ViewConfigComponent,
    ViewQueuesAndPollDataComponent,
    LoaderComponent,
    ViewIndividualWorkflowExecutionsComponent,
    ViewIndividualWorkflowRunningExecutionsComponent,
    LoginComponent,
    InitiateSimpleConductorWorkflowCreationComponent,
    DefineSimpleConductorWorkflowCreationComponent,
    WireSimpleConductorWorkflowCreationComponent,
    ConfirmSimpleConductorWorkflowCreationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ApiModule,
    PerfectScrollbarModule,
    NgbModule,
    FormsModule,
    DragDropModule,
    ToastrModule.forRoot(),
    BackButtonDisableModule.forRoot({
      preserveScrollPosition: true
    })
  ],
  providers: [
    DatePipe,
    APIS,
    { provide: BASE_PATH, useValue: environment.WF_SERVER },
    {
      provide:
      PERFECT_SCROLLBAR_CONFIG,
      // DROPZONE_CONFIG,
      useValue:
      DEFAULT_PERFECT_SCROLLBAR_CONFIG,
      // DEFAULT_DROPZONE_CONFIG,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
