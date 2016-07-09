// angular
import {Component, Input} from '@angular/core';

@Component({
    selector: 'error-summary',
    templateUrl: 'error-summary.html'
})
export class ErrorSummary {
    @Input() errors;
}