// framework
import {DecoratorUtils, IComponentMetadata} from './utils';

export function BaseComponent(metadata: IComponentMetadata = {}) {
  return function(cls: any ) {
    return DecoratorUtils.annotateComponent(cls, metadata);
  };
}