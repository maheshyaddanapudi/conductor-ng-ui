/**
 * 
 * 
 *
 * 
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { WorkflowDef } from './workflowDef';


export interface SubWorkflowParams {
    name: string;
    version?: number;
    taskToDomain?: { [key: string]: string; };
    workflowDefinition?: WorkflowDef;
}
