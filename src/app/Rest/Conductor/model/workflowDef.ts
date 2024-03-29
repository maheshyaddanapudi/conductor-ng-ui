/**
 * OpenAPI definition
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { WorkflowTask } from './workflowTask';

export interface WorkflowDef { 
    ownerApp?: string;
    createTime?: number;
    updateTime?: number;
    createdBy?: string;
    updatedBy?: string;
    name: string;
    description?: string;
    version?: number;
    tasks: Array<WorkflowTask>;
    inputParameters?: Array<string>;
    outputParameters?: { [key: string]: any; };
    failureWorkflow?: string;
    schemaVersion?: number;
    restartable?: boolean;
    workflowStatusListenerEnabled?: boolean;
    ownerEmail?: string;
    timeoutPolicy?: WorkflowDef.TimeoutPolicyEnum;
    timeoutSeconds: number;
    variables?: { [key: string]: any; };
}
export namespace WorkflowDef {
    export type TimeoutPolicyEnum = 'TIME_OUT_WF' | 'ALERT_ONLY';
    export const TimeoutPolicyEnum = {
        TIMEOUTWF: 'TIME_OUT_WF' as TimeoutPolicyEnum,
        ALERTONLY: 'ALERT_ONLY' as TimeoutPolicyEnum
    };
}