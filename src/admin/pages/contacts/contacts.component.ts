// angular
import {OnInit, Component} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {URLSearchParams} from '@angular/http';

// libs
import * as moment from 'moment';

// app
import {ContactService, Contact} from '../../models/contact';
import {LoadingIndicatorComponent} from '../../components/loading-indicator/loading-indicator.component';
import {LoadingService} from '../../services/loading.service';

@Component({
    moduleId: module.id,
    templateUrl: 'contacts.html',
    directives: [LoadingIndicatorComponent]
})
export class ContactsComponent implements OnInit {

    contacts: Contact[];

    search = new URLSearchParams('limit=all');

    formatDate(dateStr: string, format = 'M/D/YYYY') {
        if (!dateStr) return;
        return moment(dateStr).format(format);
    }

    constructor(private _title: Title, private _contactService: ContactService, private _router: Router, private _loadingService: LoadingService) {}

    ngOnInit() {
        this._title.setTitle('Contacts');
        this.search.set('sort', 'DESC');
        // Get contacts
        this._loadingService.on();
        this._contactService.get({ search: this.search })
        .then(contacts => {
            this.contacts = contacts;
        })
        .then(() => {
            this._loadingService.off();
        })
        .catch(e => {
            this._loadingService.off();
        });
    }
}