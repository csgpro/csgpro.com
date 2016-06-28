// rxjs
import {Observable} from "rxjs/Observable";  
import {Observer} from "rxjs/Observer";
import {Subject} from "rxjs/Subject";
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/debounce';
import 'rxjs/add/operator/distinctUntilChanged';

export default class LoadingService {
    loading$: Observable<boolean>;

    constructor() {
        this.loading$ = new Subject<boolean>();
    }

    on() {
        console.log('indicator on');
        this._toggleLoadingIndicator(true);
    }

    off() {
        console.log('indicator off');
        this._toggleLoadingIndicator(false);
    }

    private _toggleLoadingIndicator(name) {
        this.loading$.debounce(400).next(name);
    }
}