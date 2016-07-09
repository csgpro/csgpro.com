// angular
import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {Router, ROUTER_DIRECTIVES} from '@angular/router';
import {URLSearchParams} from '@angular/http';

// libs
import * as moment from 'moment';

// app
import {PostService, Post} from '../../models/post';
import {CategoryService, Category} from '../../models/category';
import {LoadingIndicatorComponent} from '../../components/loading-indicator/loading-indicator.component';
import {LoadingService} from '../../services/loading.service';

@Component({
    moduleId: 'PostsComponent',
    templateUrl: 'posts.html',
    directives: [ROUTER_DIRECTIVES, LoadingIndicatorComponent]
})
export class PostsComponent implements OnInit {

    selectedCategory = '';

    posts: Post[];
    categories: Category[];

    search = new URLSearchParams('limit=all');

    formatDate(dateStr: string, format = 'M/D/YYYY') {
        if (!dateStr) return;
        return moment(dateStr).format(format);
    }

    editPost(id) {
        this._router.navigate(['/post', id])
    }

    onCategoryChange(categorySlug) {
        this.selectedCategory = categorySlug;
        this._loadingService.on();
        this.search.delete('category');
        this.search.set('category', this.selectedCategory || '');
        this._postService.get({ search: this.search }).then(posts => this.posts = posts).then(() => this._loadingService.off());
    }

    constructor(private _title: Title, private _postService: PostService, private _categoryService: CategoryService, private _router: Router, private _loadingService: LoadingService) {}

    ngOnInit() {
        this._title.setTitle('Posts');
        this.search.set('published', 'false');
        // Get posts
        this._loadingService.on();
        this._postService.get({ search: this.search })
        .then(posts => {
            this.posts = posts;
        })
        .then(() => {
            return this._categoryService.get({}).then(c => this.categories = c);
        })
        .then(() => {
            this._loadingService.off();
        })
        .catch(e => {
            this._loadingService.off();
        });
    }
}