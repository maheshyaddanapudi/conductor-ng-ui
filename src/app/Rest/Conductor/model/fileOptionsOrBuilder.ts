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
import { UninterpretedOption } from './uninterpretedOption';
import { UninterpretedOptionOrBuilder } from './uninterpretedOptionOrBuilder';
import { UnknownFieldSet } from './unknownFieldSet';

export interface FileOptionsOrBuilder { 
    deprecated?: boolean;
    javaStringCheckUtf8?: boolean;
    uninterpretedOptionList?: Array<UninterpretedOption>;
    uninterpretedOptionOrBuilderList?: Array<UninterpretedOptionOrBuilder>;
    uninterpretedOptionCount?: number;
    javaPackage?: string;
    javaPackageBytes?: ByteString;
    javaOuterClassname?: string;
    javaOuterClassnameBytes?: ByteString;
    javaMultipleFiles?: boolean;
    javaGenerateEqualsAndHash?: boolean;
    optimizeFor?: FileOptionsOrBuilder.OptimizeForEnum;
    goPackage?: string;
    goPackageBytes?: ByteString;
    ccGenericServices?: boolean;
    javaGenericServices?: boolean;
    pyGenericServices?: boolean;
    phpGenericServices?: boolean;
    ccEnableArenas?: boolean;
    objcClassPrefix?: string;
    objcClassPrefixBytes?: ByteString;
    csharpNamespace?: string;
    csharpNamespaceBytes?: ByteString;
    swiftPrefix?: string;
    swiftPrefixBytes?: ByteString;
    phpClassPrefix?: string;
    phpClassPrefixBytes?: ByteString;
    phpNamespace?: string;
    phpNamespaceBytes?: ByteString;
    phpMetadataNamespace?: string;
    phpMetadataNamespaceBytes?: ByteString;
    rubyPackage?: string;
    rubyPackageBytes?: ByteString;
    defaultInstanceForType?: Message;
    initializationErrorString?: string;
    allFields?: { [key: string]: any; };
    descriptorForType?: Descriptor;
    unknownFields?: UnknownFieldSet;
    initialized?: boolean;
}
export namespace FileOptionsOrBuilder {
    export type OptimizeForEnum = 'SPEED' | 'CODE_SIZE' | 'LITE_RUNTIME';
    export const OptimizeForEnum = {
        SPEED: 'SPEED' as OptimizeForEnum,
        CODESIZE: 'CODE_SIZE' as OptimizeForEnum,
        LITERUNTIME: 'LITE_RUNTIME' as OptimizeForEnum
    };
}