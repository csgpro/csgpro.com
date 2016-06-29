// angular
import {Component, AnimationEntryMetadata, ViewEncapsulation, Type, ChangeDetectionStrategy} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

declare var Reflect: any;
const _reflect: any = Reflect;

export interface IComponentMetadata {
    selector?: string;
    inputs?: string[];
    outputs?: string[];
    properties?: string[];
    events?: string[];
    host?: {
        [key: string]: string;
    };
    providers?: any[];
    exportAs?: string;
    moduleId?: string;
    queries?: {
        [key: string]: any;
    };
    viewProviders?: any[];
    changeDetection?: ChangeDetectionStrategy;
    templateUrl?: string;
    template?: string;
    styleUrls?: string[];
    styles?: string[];
    animations?: AnimationEntryMetadata[];
    directives?: Array<Type | any[]>;
    pipes?: Array<Type | any[]>;
    encapsulation?: ViewEncapsulation;
    interpolation?: [string, string];
    init?: Function;
}

export class DecoratorUtils {
    public static getMetadata(metadata: IComponentMetadata = {}, customDecoratorMetadata?: IComponentMetadata) {

        /**
         * The following allows default component metadata to be configured
         * For instance, here we make `TNSFontIconPipe` available for all our components
         */
        // default directives
        let DIRECTIVES: any[] = [
            ROUTER_DIRECTIVES,
        ];
        // default pipes
        let PIPES: any[] = [];   
    
        // custom decorator options
        if (customDecoratorMetadata) {
            if (customDecoratorMetadata.directives) {
                DIRECTIVES = [...DIRECTIVES, ...customDecoratorMetadata.directives];
            }
            if (customDecoratorMetadata.pipes) {
                PIPES = [...PIPES, ...customDecoratorMetadata.pipes];
            }
        }

        metadata.directives = metadata.directives ? [...metadata.directives, ...DIRECTIVES] : DIRECTIVES;
        metadata.pipes = metadata.pipes ? [...metadata.pipes, ...PIPES] : PIPES;
    
        // initialize anything 
        if (metadata.init) {
            metadata.init();
        }

        return metadata;
    }

    public static annotateComponent(cls: any, metadata: any = {}, customDecoratorMetadata?: any) {
        let annotations = _reflect.getMetadata('annotations', cls) || [];
        annotations.push(new Component(DecoratorUtils.getMetadata(metadata, customDecoratorMetadata)));
        _reflect.defineMetadata('annotations', annotations, cls);
        return cls;
    }
}