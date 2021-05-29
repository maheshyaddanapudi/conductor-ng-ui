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
import { ByteString } from './byteString';
import { Descriptor } from './descriptor';
import { Message } from './message';
import { MethodOptions } from './methodOptions';
import { MethodOptionsOrBuilder } from './methodOptionsOrBuilder';
import { UnknownFieldSet } from './unknownFieldSet';

export interface MethodDescriptorProtoOrBuilder { 
    options?: MethodOptions;
    inputType?: string;
    name?: string;
    outputType?: string;
    nameBytes?: ByteString;
    optionsOrBuilder?: MethodOptionsOrBuilder;
    clientStreaming?: boolean;
    serverStreaming?: boolean;
    inputTypeBytes?: ByteString;
    outputTypeBytes?: ByteString;
    initializationErrorString?: string;
    allFields?: { [key: string]: any; };
    descriptorForType?: Descriptor;
    unknownFields?: UnknownFieldSet;
    defaultInstanceForType?: Message;
    initialized?: boolean;
}