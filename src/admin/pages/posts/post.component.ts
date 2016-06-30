// angular
import {OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

// framework
import {BaseComponent} from '../../framework';

// app
import {PostService, Post} from '../../models/post';
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

    private _paramsSubscription: any;

    constructor(private _postService: PostService, public loadingService: LoadingService, private _route: ActivatedRoute, public markdown: MarkdownService) {}

    ngOnInit() {
        // Get post
        this.loadingService.on();
        this._paramsSubscription = this._route.params.subscribe(params => {
            let postId = +params['id'];
            this._postService.get(postId).then(post => {
                this.post = post;
                this.loadingService.off();
            });
        });
    }

    ngOnDestroy() {
        this._paramsSubscription.unsubscribe();
    }
}