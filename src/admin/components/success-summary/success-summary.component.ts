// angular
import {Component, Input} from '@angular/core';

@Component({
    selector: 'success-summary',
    templateUrl: 'success-summary.html'
})
export default class ErrorSummary {
    @Input() message;
}