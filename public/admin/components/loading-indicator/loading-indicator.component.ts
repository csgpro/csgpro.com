// angular
import {Component} from '@angular/core';

// app
import {LoadingService} from '../../services/loading.service';

@Component({
    selector: 'loading-indicator',
    templateUrl: 'loading-indicator.html',
    styleUrls: ['loading-indicator.scss']
})
export class LoadingIndicatorComponent {
    constructor (public loadingService: LoadingService) {}
}