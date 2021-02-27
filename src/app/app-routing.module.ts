import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { LandingComponent } from './Pages/landing/landing.component';
import { ViewTaskdefsComponent } from './Pages/View/Conductor/view-taskdefs/view-taskdefs.component';
import { CreateTaskdefComponent } from './Pages/Create/Conductor/create-taskdef/create-taskdef.component';
import { ViewWorkflowsComponent } from './Pages/View/Conductor/view-workflows/view-workflows.component';
import { ViewWorkflowDetailComponent } from './Pages/Details/Conductor/view-workflow-detail/view-workflow-detail.component';
import { ViewWorkflowExecutionsComponent } from './Pages/Reports/Conductor/view-workflow-executions/view-workflow-executions.component';
import { ViewMermaidWorkflowDiagramComponent } from './Pages/Diagram/Components/view-mermaid-workflow-diagram/view-mermaid-workflow-diagram.component';
import { UpdateTaskdefComponent } from './Pages/Update/Conductor/update-taskdef/update-taskdef.component';
import { ViewTaskDetailComponent } from './Pages/Details/Conductor/view-task-detail/view-task-detail.component';
import { ViewTasksInProgressComponent } from './Pages/Details/Conductor/ComponentPages/view-tasks-in-progress/view-tasks-in-progress.component';
import { ViewWorflowExecutionDetailComponent } from './Pages/Details/Conductor/view-worflow-execution-detail/view-worflow-execution-detail.component';
import { DisplayBranchesListComponent } from './Pages/Details/Conductor/ComponentPages/display-branches-list/display-branches-list.component';
import { DisplayJsonComponent } from './Pages/Details/Conductor/ComponentPages/display-json/display-json.component';
import { ViewConfigComponent } from './Pages/View/Conductor/view-config/view-config.component';
import { ViewQueuesAndPollDataComponent } from './Pages/View/Conductor/view-queues-and-poll-data/view-queues-and-poll-data.component';
import { ViewIndividualWorkflowExecutionsComponent } from './Pages/Reports/Conductor/view-individual-workflow-executions/view-individual-workflow-executions.component';
import { ViewIndividualWorkflowRunningExecutionsComponent } from './Pages/Reports/Conductor/view-individual-workflow-running-executions/view-individual-workflow-running-executions.component';
import { LoginComponent } from './Pages/login/login.component';
import { InitiateSimpleConductorWorkflowCreationComponent } from './Pages/Create/Conductor/SimpleConductorWorkflow/initiate-simple-conductor-workflow-creation/initiate-simple-conductor-workflow-creation.component';
import { DefineSimpleConductorWorkflowCreationComponent } from './Pages/Create/Conductor/SimpleConductorWorkflow/define-simple-conductor-workflow-creation/define-simple-conductor-workflow-creation.component';
import { WireSimpleConductorWorkflowCreationComponent } from './Pages/Create/Conductor/SimpleConductorWorkflow/wire-simple-conductor-workflow-creation/wire-simple-conductor-workflow-creation.component';

const routes: Routes = [
  //{ path: "", component: LandingComponent },
  { path: "", component: HomeComponent },
  { path: "home", component: HomeComponent },

  // View
    // Config
    { path: "view-config", component: ViewConfigComponent },

    // Queues and Poll Data
    { path: "view-queues-and-poll-data", component: ViewQueuesAndPollDataComponent },

    // Taskdefs
    { path: "view-taskdefs", component: ViewTaskdefsComponent },

    // TaskDef Details
    { path: "view-task-detail", component: ViewTaskDetailComponent },
      // Component Pages
        { path: "view-tasks-in-progress", component: ViewTasksInProgressComponent},

        // Sub Component Pages
          {path: 'display-branches-list', component: DisplayBranchesListComponent},
        
        { path: 'display-json', component: DisplayJsonComponent},

    // Workflows
    { path: "view-workflows", component: ViewWorkflowsComponent },

    // Workflow Details
    { path: "view-workflow-detail", component: ViewWorkflowDetailComponent },
    { path: "view-workflow-diagram", component: ViewMermaidWorkflowDiagramComponent },

    // Workflow Execution Details
    { path: "view-workflow-execution-detail", component: ViewWorflowExecutionDetailComponent },
    { path: "view-workflow-execution-diagram", component: ViewMermaidWorkflowDiagramComponent },

    

  // Create
    // Taskdef
    { path: "create-taskdef", component: CreateTaskdefComponent },

    // Simple Conductor Workflow
    { path: "initiate-simple-conductor-workflow-creation", component: InitiateSimpleConductorWorkflowCreationComponent },
    { path: "define-simple-conductor-workflow-creation", component: DefineSimpleConductorWorkflowCreationComponent },
    { path: "wire-simple-conductor-workflow-creation", component: WireSimpleConductorWorkflowCreationComponent },

  // Update
    // TaskDef
    { path: "update-taskdef", component: UpdateTaskdefComponent },

  // Reports
    // Workflow Executions
    { path: "view-workflow-executions", component: ViewWorkflowExecutionsComponent },
    { path: "view-individual-workflow-executions", component: ViewIndividualWorkflowExecutionsComponent },
    { path: "view-individual-workflow-running-executions", component: ViewIndividualWorkflowRunningExecutionsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
