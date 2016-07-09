// angular
import {Injectable} from '@angular/core';

// rxjs
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class LoadingService {
    loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    on() {
        console.log('indicator on');
        this._toggleLoadingIndicator(true);
    }

    off() {
        console.log('indicator off');
        this._toggleLoadingIndicator(false);
    }

    private _toggleLoadingIndicator(name) {
        this.loading$.next(name);
    }
}