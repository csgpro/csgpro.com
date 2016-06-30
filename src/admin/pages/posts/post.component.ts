// angular
import {OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgForm}    from '@angular/common';

// libs
import * as _ from 'lodash';

// framework
import {BaseComponent} from '../../framework';

// app
import {PostService, Post} from '../../models/post';
import {CategoryService, Category} from '../../models/category';
import {UserService, User} from '../../models/user';
import {LoadingService} from '../../services/loading.service';
import {LoadingIndicatorComponent} from '../../components/loading-indicator/loading-indicator.component';
import {MarkdownService} from '../../services/markdown.service';

@BaseComponent({
    moduleId: 'PostComponent',
    templateUrl: 'post.html',
    directives: [LoadingIndicatorComponent]
})
export class PostComponent implements OnInit, OnDestroy {

    post = new Post();

    // selects
    authors: User[] = [];
    categories: Category[] = [];

    private _paramsSubscription: any;

    constructor(private _postService: PostService, private _userService: UserService, private _categoryService: CategoryService, public loadingService: LoadingService, private _route: ActivatedRoute, public markdown: MarkdownService) {}

    ngOnInit() {
        // Get post
        this.loadingService.on();
        this._paramsSubscription = this._route.params.subscribe(params => {
            let postId = +params['id'];

            let queue = [];

            queue.push(this._postService.get(postId));
            queue.push(this._categoryService.get());
            queue.push(this._userService.get());

            Promise.all(queue).then(response => {
                const [post, categories, users] = response;

                this.post = post;
                this.categories = categories;
                this.authors = users;
            })
            .then(() => {
                let currentAuthorIndex = _.findIndex(this.authors, { id: this.post.author.id });
                let currentCategoryIndex = _.findIndex(this.categories, { id: this.post.category.id });
                if (currentAuthorIndex > -1) {
                    this.post.author = this.authors[currentAuthorIndex];
                }
                if (currentCategoryIndex > -1) {
                    this.post.category = this.categories[currentCategoryIndex];
                }
            })
            .then(() => {
                // done
                this.loadingService.off();
            }).catch(() => {
                // done
                this.loadingService.off();
            });
        });
    }

    ngOnDestroy() {
        this._paramsSubscription.unsubscribe();
    }
}