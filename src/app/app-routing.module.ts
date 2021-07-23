import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {BaseLayoutComponent} from './Layout/base-layout/base-layout.component';
import {PagesLayoutComponent} from './Layout/pages-layout/pages-layout.component';

import { WorkflowDashboardComponent } from './Pages/Dashboards/workflow-dashboard/workflow-dashboard.component';
import { RuntimeConfigurationComponent } from './Pages/Admin/runtime-configuration/runtime-configuration.component';
import { QueuesAndPollDataComponent } from './Pages/Admin/queues-and-poll-data/queues-and-poll-data.component';
import { TaskDefinitionsComponent } from './Pages/View/task-definitions/task-definitions.component';
import { WorkflowDefinitionsComponent } from './Pages/View/workflow-definitions/workflow-definitions.component';
import { WorkflowExecutionsComponent } from './Pages/Reports/workflow-executions/workflow-executions.component';
import { BufferComponent } from './Pages/buffer/buffer.component';
import { WorkflowExecutionDetailComponent } from './Pages/View/workflow-execution-detail/workflow-execution-detail.component';
import { ViewMermaidWorkflowDiagramComponent } from './Pages/Diagrams/view-mermaid-workflow-diagram/view-mermaid-workflow-diagram.component';
import { ViewMermaidWorkflowExecutionDiagramComponent } from './Pages/Diagrams/view-mermaid-workflow-execution-diagram/view-mermaid-workflow-execution-diagram.component';
import { InitializingComponent } from './Pages/initializing/initializing.component';
import { IndividualWorkflowRunningExecutionsComponent } from './Pages/View/individual-workflow-running-executions/individual-workflow-running-executions.component';
import { WorkflowDetailComponent } from './Pages/View/workflow-detail/workflow-detail.component';
import { HomeComponent } from './Pages/home/home.component';
import { IndividualWorkflowExecutionsComponent } from './Pages/View/individual-workflow-executions/individual-workflow-executions.component';
import { NewTaskDefinitionComponent } from './Pages/Create/new-task-definition/new-task-definition.component';
import { TaskDefinitionDetailComponent } from './Pages/View/task-definition-detail/task-definition-detail.component';
import { UpdateTaskDefinitionComponent } from './Pages/Update/update-task-definition/update-task-definition.component';
import { DisplayJsonComponent } from './Pages/Display/display-json/display-json.component';
import { DisplayBranchesListComponent } from './Pages/Display/Components/display-branches-list/display-branches-list.component';
import { LoginComponent } from './Pages/login/login.component';
import { UserInfoComponent } from './Pages/User/user-info/user-info.component';
import { 
  RouteGuardService as RouteGuard 
} from './Services/Guards/route-guard.service'
import { InitiateNewWorkflowDefinitionComponent } from './Pages/Create/SimpleWorkflow/initiate-new-workflow-definition/initiate-new-workflow-definition.component';
import { DefineNewWorkflowDefinitionComponent } from './Pages/Create/SimpleWorkflow/define-new-workflow-definition/define-new-workflow-definition.component';
import { LogAggregationDashboardComponent } from './Pages/Dashboards/log-aggregation-dashboard/log-aggregation-dashboard.component';
import { WireNewWorkflowDefinitionComponent } from './Pages/Create/SimpleWorkflow/wire-new-workflow-definition/wire-new-workflow-definition.component';
import { ConfirmNewWorkflowDefinitionComponent } from './Pages/Create/SimpleWorkflow/confirm-new-workflow-definition/confirm-new-workflow-definition.component';
import { DiagramComponent } from './Pages/Diagrams/diagram/diagram.component';
import { MinioClientComponent } from './Pages/Test/minio-client/minio-client.component';


const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [

      // Home

      {path: '', component: InitializingComponent, data: {extraParameter: ''}, canActivate: [RouteGuard]},

      {path: 'buffer', component: BufferComponent, data: {extraParameter: ''}, canActivate: [RouteGuard]},

      {path: 'home', component: HomeComponent, data: {extraParameter: ''}, canActivate: [RouteGuard]},

      // User

      {path: 'user/user-info', component: UserInfoComponent, data: {extraParameter: ''}, canActivate: [RouteGuard]},

      // Dashboads

      {path: 'dashboard/workflow-dashboard', component: WorkflowDashboardComponent, data: {extraParameter: 'dashboardsMenu'}, canActivate: [RouteGuard]},
      {path: 'dashboard/log-aggregation-dashboard', component: LogAggregationDashboardComponent, data: {extraParameter: 'dashboardsMenu'}, canActivate: [RouteGuard]},

      // Display

      {path: 'display/json', component: DisplayJsonComponent, data: {extraParameter: ''}, canActivate: [RouteGuard]},
      {path: 'display/workflow/task-branches', component: DisplayBranchesListComponent, data: {extraParameter: ''}, canActivate: [RouteGuard]},
      
      // Events


      // View

      {path: 'view/task-definitions', component: TaskDefinitionsComponent, data: {extraParameter: 'viewDefinitionsMenu'}, canActivate: [RouteGuard]},
      {path: 'view/workflow-definitions', component: WorkflowDefinitionsComponent, data: {extraParameter: 'viewDefinitionsMenu'}, canActivate: [RouteGuard]},

      {path: 'view/task-definition-detail', component: TaskDefinitionDetailComponent, data: {extraParameter: 'viewDefinitionsMenu'}, canActivate: [RouteGuard]},
      {path: 'view/workflow-detail', component: WorkflowDetailComponent, data: {extraParameter: ''}, canActivate: [RouteGuard]},
      {path: 'view/workflow-execution-detail', component: WorkflowExecutionDetailComponent, data: {extraParameter: ''}, canActivate: [RouteGuard]},

      {path: 'view/individual-workflow-running-executions', component: IndividualWorkflowRunningExecutionsComponent, data: {extraParameter: ''}, canActivate: [RouteGuard]},
      {path: 'view/individual-workflow-executions', component: IndividualWorkflowExecutionsComponent, data: {extraParameter: ''}, canActivate: [RouteGuard]},

      // Diagram

      // Workflow Details
      { path: "view/workflow-diagram", component: ViewMermaidWorkflowDiagramComponent , data: {extraParameter: ''}, canActivate: [RouteGuard]},

      // Workflow Execution Details
      { path: "view/workflow-execution-diagram", component: ViewMermaidWorkflowExecutionDiagramComponent , data: {extraParameter: ''}, canActivate: [RouteGuard]},

      { path: "bpmn/diagram", component: MinioClientComponent , data: {extraParameter: ''}, canActivate: [RouteGuard]},


      // Create

      {path: 'create/new-task-definition', component: NewTaskDefinitionComponent, data: {extraParameter: 'createDefinitionsMenu'}, canActivate: [RouteGuard]},
      {path: 'create/new-workflow-definition', component: InitiateNewWorkflowDefinitionComponent, data: {extraParameter: 'createDefinitionsMenu'}, canActivate: [RouteGuard]},
      {path: 'create/define-new-workflow', component: DefineNewWorkflowDefinitionComponent, data: {extraParameter: ''}, canActivate: [RouteGuard]},
      {path: 'create/wire-new-workflow', component: WireNewWorkflowDefinitionComponent, data: {extraParameter: ''}, canActivate: [RouteGuard]},
      {path: 'create/confirm-new-workflow', component: ConfirmNewWorkflowDefinitionComponent, data: {extraParameter: ''}, canActivate: [RouteGuard]},


      // Update

      {path: 'update/update-task-definition', component: UpdateTaskDefinitionComponent, data: {extraParameter: 'createDefinitionsMenu'}, canActivate: [RouteGuard]},

      // Reports

      {path: 'reports/workflow-executions', component: WorkflowExecutionsComponent, data: {extraParameter: 'reportsMenu'}, canActivate: [RouteGuard]},

      // Admin

      {path: 'admin/runtime-configuration', component: RuntimeConfigurationComponent, data: {extraParameter: ''}, canActivate: [RouteGuard]},
      {path: 'admin/queues-and-poll-data', component: QueuesAndPollDataComponent, data: {extraParameter: ''}, canActivate: [RouteGuard]},

     

    ]

  },
  {
    path: '',
    component: PagesLayoutComponent,
    children: [

      // User Pages
      {path: 'login', component: LoginComponent, data: {extraParameter: ''}},
    
    ]
  },
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
