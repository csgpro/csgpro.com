// angular
import {OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {URLSearchParams} from '@angular/http';

// framework
import {BaseComponent} from '../../framework';

// libs
import * as moment from 'moment';

// app
import ApiService from '../../services/api.service';

@BaseComponent({
    moduleId: 'PostsComponent',
    templateUrl: 'posts.html',
})
export class PostsComponent implements OnInit {

    posts: any[];

    search = new URLSearchParams('category=blog');

    formatDate(dateStr: string, format = 'M/D/YYYY') {
        return moment(dateStr).format(format);
    }

    editPost(id) {
        this._router.navigate(['/post', id])
    }

    constructor(private _title: Title, private _api: ApiService, private _router: Router) {}
    ngOnInit() {
        this._title.setTitle('Posts');
        this.search.set('publshed', 'true');
        // Get posts
        this._api.get('post', { search: this.search })
        .then((data: any) => {
            this.posts = data.rows;
        })
        .catch(e => {
        });
    }
}