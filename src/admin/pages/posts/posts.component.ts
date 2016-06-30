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
import {PostService} from '../../models/post';
import {LoadingIndicatorComponent} from '../../components/loading-indicator/loading-indicator.component';
import {LoadingService} from '../../services/loading.service';

@BaseComponent({
    moduleId: 'PostsComponent',
    templateUrl: 'posts.html',
    directives: [LoadingIndicatorComponent]
})
export class PostsComponent implements OnInit {

    posts: any[];

    search = new URLSearchParams('category=blog&limit=all');

    formatDate(dateStr: string, format = 'M/D/YYYY') {
        return moment(dateStr).format(format);
    }

    editPost(id) {
        this._router.navigate(['/post', id])
    }

    constructor(private _title: Title, private _postService: PostService, private _router: Router, private _loadingService: LoadingService) {}
    ngOnInit() {
        this._title.setTitle('Posts');
        this.search.set('publshed', 'true');
        // Get posts
        this._loadingService.on();
        this._postService.get({ search: this.search })
        .then(posts => {
            this.posts = posts;
            this._loadingService.off()
        })
        .catch(e => {
            this._loadingService.off();
        });
    }
}