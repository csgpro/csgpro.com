// angular
import {ChangeDetectionStrategy} from '@angular/core';

// framework
import {BaseComponent} from '../../framework';

// app
import LoadingService from "../../services/loading.service";

@BaseComponent({
    selector: 'loading-indicator',
    templateUrl: 'loading-indicator.html',
    styleUrls: ['loading-indicator.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingIndicatorComponent {
    constructor (public loadingService: LoadingService) {}
}