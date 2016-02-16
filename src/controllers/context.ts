'use strict';

export interface IContextComposer {
    (cb: IContextCallback): void;
}

export interface IContextCallback {
    (err: Error, context?: any): void;
}

export class Context {
    constructor(public template: string, public title: string, public description: string) {}
    addKey(key: string, value: string) {
        var self: any = this;
        self[key] = value;
        return self;
    }
    removeKey(key: string) {
        var self: any = this;
        delete self[key];
        return self;
    }
}