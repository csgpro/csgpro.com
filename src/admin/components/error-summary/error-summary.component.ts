// angular
import {Component, Input, OnChanges, SimpleChange} from '@angular/core';

@Component({
    selector: 'error-summary',
    templateUrl: 'error-summary.html'
})
export default class ErrorSummary {

    @Input() errors;

    constructor() { }

    // ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    //     debugger;
    // }
}