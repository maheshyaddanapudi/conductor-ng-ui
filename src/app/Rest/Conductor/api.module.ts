import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Configuration } from './configuration';

import { AdminService } from './api/admin.service';
import { EventServicesService } from './api/eventServices.service';
import { HealthCheckService } from './api/healthCheck.service';
import { MetadataManagementService } from './api/metadataManagement.service';
import { TaskManagementService } from './api/taskManagement.service';
import { WorkflowBulkManagementService } from './api/workflowBulkManagement.service';
import { WorkflowManagementService } from './api/workflowManagement.service';

@NgModule({
  imports:      [ CommonModule, HttpClientModule ],
  declarations: [],
  exports:      [],
  providers: [
    AdminService,
    EventServicesService,
    HealthCheckService,
    MetadataManagementService,
    TaskManagementService,
    WorkflowBulkManagementService,
    WorkflowManagementService ]
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        }
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import your base AppModule only.');
        }
    }
}
