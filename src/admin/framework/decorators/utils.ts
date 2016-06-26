// angular
import {Component, ChangeDetectionStrategy} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

declare var Reflect: any;
const _reflect: any = Reflect;

export class DecoratorUtils {
  public static getMetadata(metadata: any = {}, customDecoratorMetadata?: any) {

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
        DIRECTIVES.push(...customDecoratorMetadata.directives); 
      }
      if (customDecoratorMetadata.pipes) {
        PIPES.push(...customDecoratorMetadata.pipes); 
      }
    }
    
    metadata.directives = metadata.directives ? metadata.directives.concat(DIRECTIVES) : DIRECTIVES;
    metadata.pipes = metadata.pipes ? metadata.pipes.concat(PIPES) : PIPES;
    
    // if (metadata.changeDetection) {
    //   metadata.changeDetection = metadata.changeDetection;
    // } else {
    //   // default OnPush
    //   metadata.changeDetection = ChangeDetectionStrategy.OnPush;
    // }
    
    if (metadata.encapsulation) {
      metadata.encapsulation = metadata.encapsulation;
    }
    
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