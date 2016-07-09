// angular
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Location} from '@angular/common';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';

// libs
import * as _ from 'lodash';

// app
import {PostService, Post} from '../../models/post';
import {CategoryService, Category} from '../../models/category';
import {TopicService, Topic} from '../../models/topic';
import {UserService, User} from '../../models/user';
import {LoadingService} from '../../services/loading.service';
import {LoadingIndicatorComponent} from '../../components/loading-indicator/loading-indicator.component';
import {MarkdownService} from '../../services/markdown.service';

@Component({
    moduleId: 'PostComponent',
    templateUrl: 'post.html',
    directives: [LoadingIndicatorComponent]
})
export class PostComponent implements OnInit, OnDestroy {

    post = new Post();

    // selects
    authors: User[] = [];
    categories: Category[] = [];
    topics: Topic[] = [];

    private _paramsSubscription: any;

    constructor(private _postService: PostService, private _userService: UserService, private _categoryService: CategoryService, private _topicService: TopicService, public loadingService: LoadingService, private _route: ActivatedRoute, private _location: Location, public markdown: MarkdownService) {}

    onSubmit() {
        let request: Promise<any>;

        // prepare post
        const post: Post = Object.assign({}, this.post);

        // prepare topics
        const selectedTopics = this.topics.filter(topic => topic['selected'] === true);
        
        post.topics = selectedTopics;

        if (this.post.id) {
            request = this._postService.put(post);
        } else {
            request = this._postService.post(post);
        }

        request.then(() => {
            // TODO: Add Confirmation
            alert('Saved Post');
        }).catch(() => {
            alert('Trouble Saving Post');
        });

    }

    publish() {
        this.post.publishedAt = new Date();
        this.onSubmit();
    }

    unPublish() {
        this.post.publishedAt = null;
        this.onSubmit();
    }

    slugify(e: KeyboardEvent, title?: string) {
        let source = title || this.post.slug;
        this.post.slug = source.trim().replace(/[^a-z0-9]+/gi, '-').toLowerCase();
    }

    ngOnInit() {
        // Get post
        this.loadingService.on();
        this._paramsSubscription = this._route.params.subscribe(params => {
            let postId = +params['id'];

            let queue: Promise<any>[] = [];

            if (postId) {
                queue.push(this._postService.get(postId));
            } else {
                if (params['id'] !== 'new') {
                    // Navigate Back
                    this._location.back();
                }
                queue.push(<any>(() => {})()); // Need to look for another way to do this.
            }

            queue.push(this._categoryService.get());
            queue.push(this._topicService.get());
            queue.push(this._userService.get());

            Promise.all(queue).then(response => {
                const [post, categories, topics, users] = response;

                if (post) {
                    this.post = post;
                }
                this.categories = categories;
                this.topics = topics;
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

                // Set selected topics
                this.post.topics.forEach(topic => {
                    let topicIndex = _.findIndex(this.topics, { id: topic.id });
                    if (topicIndex > -1) {
                        this.topics[topicIndex]['selected'] = true;
                    }
                });
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