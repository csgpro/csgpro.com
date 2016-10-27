// angular
import { Component, Input } from '@angular/core';

@Component({
    selector: 'success-summary',
    templateUrl: 'success-summary.html'
})
export class SuccessSummary {
    @Input() message: any;
}