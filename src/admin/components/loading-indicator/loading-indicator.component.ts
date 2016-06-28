// angular
import {OnInit, OnDestroy, NgZone, ChangeDetectionStrategy} from '@angular/core';

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
export class LoadingIndicatorComponent implements OnInit, OnDestroy {  
    isLoading = false;

    private subscription: any;

    constructor (private _loadingService: LoadingService, private _ngZone: NgZone) {}

    showOrHideLoadingIndicator(loading: boolean) {
        this.isLoading = loading;
    }

    ngOnInit() {
        this.subscription = this._loadingService.loading$.subscribe((loading: any) => {
            this.showOrHideLoadingIndicator(loading);
        });
    }

    ngOnDestroy() {         
        this.subscription.unsubscribe();
    }
}