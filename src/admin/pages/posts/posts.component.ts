// angular
import {OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';

// framework
import {BaseComponent} from '../../framework';

// app
import ApiService from '../../services/api.service';

@BaseComponent({
    moduleId: 'PostsComponent',
    templateUrl: 'posts.html',
})
export class PostsComponent implements OnInit {

    posts: any[];

    constructor(private _title: Title, private _api: ApiService) {}
    ngOnInit() {
        this._title.setTitle('Posts');
        // Get posts
        this._api.get('post')
        .then((data: any) => {
            this.posts = data.rows;
        })
        .catch(e => {
        });
    }
}