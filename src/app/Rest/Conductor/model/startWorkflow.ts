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
import { Any } from './any';


export interface StartWorkflow {
    name?: string;
    version?: number;
    correlationId?: string;
    input?: { [key: string]: any; };
    inputMessage?: Any;
    taskToDomain?: { [key: string]: string; };
}