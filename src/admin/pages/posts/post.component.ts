// angular
import {Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {Location} from '@angular/common';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {DOCUMENT} from '@angular/platform-browser';

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
import {Modal} from '../../components/modal/modal.component';
import {ApiService} from '../../services/api.service';

@Component({
    moduleId: 'PostComponent',
    templateUrl: 'post.html',
    directives: [LoadingIndicatorComponent, Modal]
})
export class PostComponent implements OnInit, OnDestroy {

    post = new Post();

    // selects
    authors: User[] = [];
    categories: Category[] = [];
    topics: Topic[] = [];

    // File Upload
    private _imageToUpload = null;
    private _imagePreviewContainer: HTMLElement;

    setFile({ target: { files } } = <any>{}) {
        let imgPreviewContainer = this._imagePreviewContainer = this._document.getElementById('imagePreview');
        let [file] = files;
        this._imageToUpload = file;

        let reader = new FileReader();

        reader.onload = function (e: Event) {
            let img = new Image();
            img.src = reader.result;
            imgPreviewContainer.appendChild(img);
        }

        reader.readAsDataURL(file);
    }

    uploadImage() {
        if (this._imageToUpload) {
            this._api.file('file', this._imageToUpload)
                .then(data => {
                    let imageMarkdown = `![${data.filename}](${data.url})`;
                    this._insertTextAtLastPos('post', imageMarkdown);
                    this.closeImageUploadModal();
                })
                .catch(error => {
                    console.error(error);
                    alert('Unable to upload image.');
                });
        }
    }

    // File Upload Modal
    private _modal: Modal = null;

    bindModal(modal) {
        this._modal = modal;
    }

    openImageUploadModal() {
        this._modal.open();
    }

    closeImageUploadModal() {
        const imageForm: HTMLFormElement = <any>this._document.getElementById('imageUploadForm');
        imageForm.reset();
        this._imagePreviewContainer.innerHTML = null;
        this._modal.close();
    }

    private _paramsSubscription: any;

    constructor(private _postService: PostService, private _userService: UserService, private _categoryService: CategoryService, private _topicService: TopicService, public loadingService: LoadingService, private _route: ActivatedRoute, private _location: Location, public markdown: MarkdownService, private _api: ApiService, @Inject(DOCUMENT) private _document: Document) {}

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
                const [post, categories, topics, users] = <any>response;

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

    // http://bitly.com/1r7k9PX
    private _insertTextAtLastPos(targetId: string, text: string) {

        const textarea: HTMLInputElement = <any>this._document.getElementById(targetId);
        const scrollPosition = textarea.scrollTop;
        let stringPosition = 0;
        let br = ((textarea.selectionStart !== undefined) ?
            'ff' : (document['selection'] ? 'ie' : 'other' ) );

        if (br === 'ie') {
            textarea.focus();
            let range: TextRange = document['selection'].createRange();
            range.moveStart ('character', -textarea.value.length);
            stringPosition = range.text.length;
        } else if (br === 'ff') {
            stringPosition = textarea.selectionStart;
        }

        let before = (textarea.value).substring(0, stringPosition);
        let after = (textarea.value).substring(stringPosition, textarea.value.length);
        textarea.value = before + text + after;
        stringPosition = stringPosition + text.length;

        if (br === 'ie') {
            textarea.focus();
            let range: TextRange = document['selection'].createRange();
            range.moveStart ('character', -textarea.value.length);
            range.moveStart ('character', stringPosition);
            range.moveEnd ('character', 0);
            range.select();
        }
        else if (br === 'ff') {
            textarea.selectionStart = stringPosition;
            textarea.selectionEnd = stringPosition;
            textarea.focus();
        }
        
        textarea.scrollTop = scrollPosition;
        textarea.dispatchEvent(new Event('input'));
        textarea.dispatchEvent(new Event('change'));
    }
}