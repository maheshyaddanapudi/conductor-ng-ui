import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgReduxModule} from '@angular-redux/store';
import {NgRedux, DevToolsExtension} from '@angular-redux/store';
import {rootReducer, ArchitectUIState} from './ThemeOptions/store';
import {ConfigActions} from './ThemeOptions/store/config.actions';
import {AppRoutingModule} from './app-routing.module';
import {LoadingBarRouterModule} from '@ngx-loading-bar/router';

import {CommonModule, DatePipe} from '@angular/common';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {AppComponent} from './app.component';

// BOOTSTRAP COMPONENTS

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {PERFECT_SCROLLBAR_CONFIG} from 'ngx-perfect-scrollbar';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import {ChartsModule} from 'ng2-charts';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// LAYOUT

import {BaseLayoutComponent} from './Layout/base-layout/base-layout.component';
import {PagesLayoutComponent} from './Layout/pages-layout/pages-layout.component';
import {PageTitleComponent} from './Layout/Components/page-title/page-title.component';

// HEADER

import {HeaderComponent} from './Layout/Components/header/header.component';
import {SearchBoxComponent} from './Layout/Components/header/elements/search-box/search-box.component';
import {UserBoxComponent} from './Layout/Components/header/elements/user-box/user-box.component';

// SIDEBAR

import {SidebarComponent} from './Layout/Components/sidebar/sidebar.component';
import {LogoComponent} from './Layout/Components/sidebar/elements/logo/logo.component';

// FOOTER

import {FooterComponent} from './Layout/Components/footer/footer.component';

import { APIS, BASE_PATH } from './Rest/Conductor';
import { environment } from 'src/environments/environment';
import { WorkflowDashboardComponent } from './Pages/Dashboards/workflow-dashboard/workflow-dashboard.component';
import { RuntimeConfigurationComponent } from './Pages/Admin/runtime-configuration/runtime-configuration.component';
import { QueuesAndPollDataComponent } from './Pages/Admin/queues-and-poll-data/queues-and-poll-data.component';
import { TaskDefinitionsComponent } from './Pages/View/task-definitions/task-definitions.component';
import { WorkflowDefinitionsComponent } from './Pages/View/workflow-definitions/workflow-definitions.component';
import { WorkflowExecutionsComponent } from './Pages/Reports/workflow-executions/workflow-executions.component';
import { ToastrModule } from 'ng6-toastr-notifications';
import { BufferComponent } from './Pages/buffer/buffer.component';
import { WorkflowExecutionDetailComponent } from './Pages/View/workflow-execution-detail/workflow-execution-detail.component';
import { DisplayJsonComponent } from './Pages/Display/display-json/display-json.component';
import { DisplayTasksListComponent } from './Pages/Display/Components/display-tasks-list/display-tasks-list.component';
import { DisplayBranchesListComponent } from './Pages/Display/Components/display-branches-list/display-branches-list.component';
import { ViewMermaidWorkflowDiagramComponent } from './Pages/Diagrams/view-mermaid-workflow-diagram/view-mermaid-workflow-diagram.component';
import { ViewMermaidWorkflowExecutionDiagramComponent } from './Pages/Diagrams/view-mermaid-workflow-execution-diagram/view-mermaid-workflow-execution-diagram.component';
import { TokenInterceptor } from './Services/Interceptors/HTTP/token-interceptor.service';
import { InitializingComponent } from './Pages/initializing/initializing.component';
import { IndividualWorkflowRunningExecutionsComponent } from './Pages/View/individual-workflow-running-executions/individual-workflow-running-executions.component';
import { WorkflowDetailComponent } from './Pages/View/workflow-detail/workflow-detail.component';
import { HomeComponent } from './Pages/home/home.component';
import { IndividualWorkflowExecutionsComponent } from './Pages/View/individual-workflow-executions/individual-workflow-executions.component';
import { NewTaskDefinitionComponent } from './Pages/Create/new-task-definition/new-task-definition.component';
import { TaskDefinitionDetailComponent } from './Pages/View/task-definition-detail/task-definition-detail.component';
import { UpdateTaskDefinitionComponent } from './Pages/Update/update-task-definition/update-task-definition.component';
import { ConductorExecutionPieChartComponent } from './Pages/Dashboards/Components/conductor-execution-pie-chart/conductor-execution-pie-chart.component';
import { ConductorExecutionRadarChartComponent } from './Pages/Dashboards/Components/conductor-execution-radar-chart/conductor-execution-radar-chart.component';
import { ConductorExecutionPolarChartComponent } from './Pages/Dashboards/Components/conductor-execution-polar-chart/conductor-execution-polar-chart.component';
import { ConductorExecutionScatterChartComponent } from './Pages/Dashboards/Components/conductor-execution-scatter-chart/conductor-execution-scatter-chart.component';
import { LoginComponent } from './Pages/login/login.component';
import { UserInfoComponent } from './Pages/User/user-info/user-info.component';
import { InitiateNewWorkflowDefinitionComponent } from './Pages/Create/SimpleWorkflow/initiate-new-workflow-definition/initiate-new-workflow-definition.component';
import { DefineNewWorkflowDefinitionComponent } from './Pages/Create/SimpleWorkflow/define-new-workflow-definition/define-new-workflow-definition.component';
import { WireNewWorkflowDefinitionComponent } from './Pages/Create/SimpleWorkflow/wire-new-workflow-definition/wire-new-workflow-definition.component';
import { ConfirmNewWorkflowDefinitionComponent } from './Pages/Create/SimpleWorkflow/confirm-new-workflow-definition/confirm-new-workflow-definition.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SafePipe } from './Pipes/SafePipe';
import { LogAggregationDashboardComponent } from './Pages/Dashboards/log-aggregation-dashboard/log-aggregation-dashboard.component';
import { JwtModule } from "@auth0/angular-jwt";
import { DiagramComponent } from './Pages/Diagrams/diagram/diagram.component';
import { MinioClientComponent } from './Pages/Test/minio-client/minio-client.component';
import { MinioExt, MinioModule } from '@hapiness/minio'

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [

    // LAYOUT

    AppComponent,
    BaseLayoutComponent,
    PagesLayoutComponent,
    PageTitleComponent,

    // HEADER

    HeaderComponent,
    SearchBoxComponent,
    UserBoxComponent,

    // SIDEBAR

    SidebarComponent,
    LogoComponent,

    // FOOTER

    FooterComponent,

    WorkflowDashboardComponent,
    RuntimeConfigurationComponent,
    QueuesAndPollDataComponent,
    TaskDefinitionsComponent,
    WorkflowDefinitionsComponent,
    WorkflowExecutionsComponent,
    BufferComponent,
    WorkflowExecutionDetailComponent,
    DisplayJsonComponent,
    DisplayTasksListComponent,
    DisplayBranchesListComponent,
    ViewMermaidWorkflowDiagramComponent,
    ViewMermaidWorkflowExecutionDiagramComponent,
    InitializingComponent,
    IndividualWorkflowRunningExecutionsComponent,
    WorkflowDetailComponent,
    HomeComponent,
    IndividualWorkflowExecutionsComponent,
    NewTaskDefinitionComponent,
    TaskDefinitionDetailComponent,
    UpdateTaskDefinitionComponent,
    ConductorExecutionPieChartComponent,
    ConductorExecutionRadarChartComponent,
    ConductorExecutionPolarChartComponent,
    ConductorExecutionScatterChartComponent,
    LoginComponent,
    UserInfoComponent,
    InitiateNewWorkflowDefinitionComponent,
    DefineNewWorkflowDefinitionComponent,
    WireNewWorkflowDefinitionComponent,
    ConfirmNewWorkflowDefinitionComponent,
    SafePipe,
    LogAggregationDashboardComponent,
    DiagramComponent,
    MinioClientComponent,
  ],
  imports: [
    MinioModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgReduxModule,
    CommonModule,
    LoadingBarRouterModule,

    // Angular Bootstrap Components

    PerfectScrollbarModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    // Charts

    ChartsModule,
    DragDropModule,
    JwtModule.forRoot({
      config: {},
    }),

    ToastrModule.forRoot()
  ],
  providers: [
    DatePipe,
    APIS,
    { provide: BASE_PATH, useValue: environment.WF_SERVER },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    {
      provide:
      PERFECT_SCROLLBAR_CONFIG,
      // DROPZONE_CONFIG,
      useValue:
      DEFAULT_PERFECT_SCROLLBAR_CONFIG,
      // DEFAULT_DROPZONE_CONFIG,
    }, 
    ConfigActions, 
  ],
  bootstrap: [AppComponent, [
    MinioExt.setConfig(
      {
          connection: {
            endPoint: 'localhost',
            port: 9000,
            useSSL: false,
            accessKey: 'minioadmin',
            secretKey: 'minioadmin',
            region: 'us-east-1'
          },
      }
  )
  ]]
})

export class AppModule {
  constructor(private ngRedux: NgRedux<ArchitectUIState>,
              private devTool: DevToolsExtension) {

    this.ngRedux.configureStore(
      rootReducer,
      {} as ArchitectUIState,
      [],
      [devTool.isEnabled() ? devTool.enhancer() : f => f]
    );

  }
}
