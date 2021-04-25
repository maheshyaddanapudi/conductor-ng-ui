import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';


import { AdminResourceService } from './api/adminResource.service';
import { EventResourceService } from './api/eventResource.service';
import { HealthCheckResourceService } from './api/healthCheckResource.service';
import { MetadataResourceService } from './api/metadataResource.service';
import { QueueAdminResourceService } from './api/queueAdminResource.service';
import { TaskResourceService } from './api/taskResource.service';
import { WorkflowBulkResourceService } from './api/workflowBulkResource.service';
import { WorkflowResourceService } from './api/workflowResource.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: [
    AdminResourceService,
    EventResourceService,
    HealthCheckResourceService,
    MetadataResourceService,
    QueueAdminResourceService,
    TaskResourceService,
    WorkflowBulkResourceService,
    WorkflowResourceService ]
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders<any> {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
