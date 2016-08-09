// angular
import {Injectable} from '@angular/core';
import {Http, Headers, Response, RequestOptionsArgs} from '@angular/http';

// rxjs
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

// app
import ContentTypes from '../helpers/content-types.helper';

@Injectable()
export class ApiService {
    private baseUrl = '/api/';
    
    public headers = new Headers({ 'Content-Type': ContentTypes.JSON });

    constructor(private _http: Http) {}

    get<T>(route: string, options?: RequestOptionsArgs): Promise<T|T[]> {

        options = this._applyDefaultOptions(options);

        const request: Promise<T> = this._http.get(`${this.baseUrl}${route}`, options).toPromise();

        return request.then(d => this._prepareResponse(d)).catch(this._handleErrors);
    }

    post<T>(route: string, body: T, options?: RequestOptionsArgs): Promise<T> {

        options = this._applyDefaultOptions(options);
        
        const request: Promise<T> = this._http.post(`${this.baseUrl}${route}`, body, options).toPromise();

        return request.then(d => this._prepareResponse(d)).catch(this._handleErrors);
    }

    put<T>(route: string, body: T, options?: RequestOptionsArgs): Promise<T> {

        options = this._applyDefaultOptions(options);

        const request: Promise<T> = this._http.put(`${this.baseUrl}${route}`, body, options).toPromise();

        return request.then(d => this._prepareResponse(d)).catch(this._handleErrors);
    }

    delete<T>(route: string, options?: RequestOptionsArgs): Promise<T> {

        const request: Promise<T> = this._http.delete(`${this.baseUrl}${route}`, options).toPromise();

        return request.then(d => this._prepareResponse(d)).catch(this._handleErrors);
    }

    file(route: string, file: File, options?: RequestOptionsArgs) {

        options = this._applyDefaultOptions(options);

        const headers = new Headers(this.headers);

        headers.delete('Content-Type');

        options.headers = headers;

        const formData = new FormData();

        formData.append('file', file);

        const request = this._http.post(`${this.baseUrl}${route}`, formData, options).toPromise();

        return request.then(d => this._prepareResponse(d)).catch(this._handleErrors);

    }

    private _prepareResponse(response: any) {
        if (!response) {
            console.log('Response Was Empty.');
            return;
        }
        let data = response.json().data;
        if (data) {
            return data;
        }
        return response;
    }

    private _handleErrors(response: Response) {
        let error = response.json();
        let msg = '';
        if (typeof error === 'string') {
            msg += error;
        } else if (error.message) {
            msg += error.message;
        } else if (error.error) {
            msg += error.error;
        } else {
            msg += JSON.stringify(error);
        }
        error = new Error(msg);
        Object.defineProperty(error, 'status', {
            value: response.status
        });
        console.error(error);
        return Promise.reject(error);
    }

    private _applyDefaultOptions(options) {
        let opts = { headers: this.headers };
        Object.assign(opts, options);
        return opts;
    }
}