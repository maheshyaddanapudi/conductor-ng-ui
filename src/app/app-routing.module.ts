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


const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    canActivate: [RouteGuard],
    children: [

      // Home

      {path: '', component: InitializingComponent, data: {extraParameter: ''}},

      {path: 'buffer', component: BufferComponent, data: {extraParameter: ''}},

      {path: 'home', component: HomeComponent, data: {extraParameter: ''}},

      // User

      {path: 'user/user-info', component: UserInfoComponent, data: {extraParameter: ''}},

      // Dashboads

      {path: 'dashboard/workflow-dashboard', component: WorkflowDashboardComponent, data: {extraParameter: 'dashboardsMenu'}},
      {path: 'dashboard/log-aggregation-dashboard', component: LogAggregationDashboardComponent, data: {extraParameter: 'dashboardsMenu'}},

      // Display

      {path: 'display/json', component: DisplayJsonComponent, data: {extraParameter: ''}},
      {path: 'display/workflow/task-branches', component: DisplayBranchesListComponent, data: {extraParameter: ''}},
      
      // Events


      // View

      {path: 'view/task-definitions', component: TaskDefinitionsComponent, data: {extraParameter: 'viewDefinitionsMenu'}},
      {path: 'view/workflow-definitions', component: WorkflowDefinitionsComponent, data: {extraParameter: 'viewDefinitionsMenu'}},

      {path: 'view/task-definition-detail', component: TaskDefinitionDetailComponent, data: {extraParameter: 'viewDefinitionsMenu'}},
      {path: 'view/workflow-detail', component: WorkflowDetailComponent, data: {extraParameter: ''}},
      {path: 'view/workflow-execution-detail', component: WorkflowExecutionDetailComponent, data: {extraParameter: ''}},

      {path: 'view/individual-workflow-running-executions', component: IndividualWorkflowRunningExecutionsComponent, data: {extraParameter: ''}},
      {path: 'view/individual-workflow-executions', component: IndividualWorkflowExecutionsComponent, data: {extraParameter: ''}},

      // Diagram

      // Workflow Details
      { path: "view/workflow-diagram", component: ViewMermaidWorkflowDiagramComponent , data: {extraParameter: ''}},

      // Workflow Execution Details
      { path: "view/workflow-execution-diagram", component: ViewMermaidWorkflowExecutionDiagramComponent , data: {extraParameter: ''}},


      // Create

      {path: 'create/new-task-definition', component: NewTaskDefinitionComponent, data: {extraParameter: 'createDefinitionsMenu'}},
      {path: 'create/new-workflow-definition', component: InitiateNewWorkflowDefinitionComponent, data: {extraParameter: 'createDefinitionsMenu'}},
      {path: 'create/define-new-workflow', component: DefineNewWorkflowDefinitionComponent, data: {extraParameter: ''}},


      // Update

      {path: 'update/update-task-definition', component: UpdateTaskDefinitionComponent, data: {extraParameter: 'createDefinitionsMenu'}},

      // Reports

      {path: 'reports/workflow-executions', component: WorkflowExecutionsComponent, data: {extraParameter: 'reportsMenu'}},

      // Admin

      {path: 'admin/runtime-configuration', component: RuntimeConfigurationComponent, data: {extraParameter: ''}},
      {path: 'admin/queues-and-poll-data', component: QueuesAndPollDataComponent, data: {extraParameter: ''}},

     

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
