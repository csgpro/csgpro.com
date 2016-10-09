// angular
import {Injectable} from '@angular/core';
import {RequestOptionsArgs} from '@angular/http';

// app
import {ApiService} from '../../services/api.service';
import {Contact} from './contact.model';

@Injectable()
export class ContactService {
    constructor(private _apiService: ApiService) {}

    get(contactId?: number): Promise<Contact>;
    get(search?: RequestOptionsArgs): Promise<Contact[]>;
    get(search?: number|RequestOptionsArgs) {
        if (typeof search === 'number') {
            return this._apiService.get<Contact>(`contact/${search}`);
        }
        return this._apiService.get<Contact>('contact', search);
    }

    post(contact: Contact) {
        return this._apiService.post<Contact>(`contact`, contact);
    }

    put(contact: Contact) {
        return this._apiService.put<Contact>(`contact/${contact.id}`, contact);
    }
}