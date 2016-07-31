// angular
import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';

// rxjs
import 'rxjs/add/operator/toPromise';

// append
import {ApiService} from './api.service';

@Injectable()
export class UploadService {

    progress: any;
    progressObserver: any;

    public headers = new Headers();

    constructor(private _http: Http, private _api: ApiService) {}

    uploadFiles(files: File[]): Promise<{ filename: string; url: string; }> {
        // TODO: enable multiple file uploads through API
        let [file] = files;
        let data = new FormData();

        data.append('file', file);

        return this._api.post<any>('file', data, { headers: this.headers });

        // return this._http.post('/api/file', data, { headers: this.headers }).toPromise().then(response => {
        //     return JSON.parse(response._body);
        // });
    }
}