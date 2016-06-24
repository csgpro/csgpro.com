// angular
import {Component} from '@angular/core';
import {Title} from '@angular/platform-browser';

@Component({
    moduleId: 'DashboardComponent',
    templateUrl: 'dashboard.html'
})
export class DashboardComponent {
    title = 'Dashboard';
    constructor(private _title: Title) {
        this._title.setTitle(this.title);
    }
}