import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
import { CommentService } from 'src/app/services/comment.service';
import { GlobalService } from 'src/app/services/global.service';
import { PostService } from 'src/app/services/post.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UserService } from 'src/app/services/user.service';
import { BlogDetailDialogComponent } from './blog-detail-dialog/blog-detail-dialog.component';
import { UserStorageService } from 'src/app/services/user-storage.service';
import { environment } from 'src/environments/environment';
import { PaymentService } from 'src/app/services/payment.service';
import { InlineShareButtonsConfig } from 'sharethis-angular';
import Pusher from 'pusher-js';
@Component({
    selector: 'app-blog-detail',
    templateUrl: './blog-detail.component.html',
    styleUrls: ['./blog-detail.component.scss']
})
export class BlogDetailComponent implements OnInit {

    shareButtonConfig: InlineShareButtonsConfig = {
        alignment: "center", // alignment of buttons (left, center, right)
        color: "social", // set the color of buttons (social, white)
        enabled: true, // show/hide buttons (true, false)
        font_size: 16, // font size for the buttons
        labels: null, // button labels (cta, counts, null)
        language: "en", // which language to use (see LANGUAGES)
        networks: [
            // which networks to include (see SHARING NETWORKS)
            "reddit",
            "skype",
            "telegram",
        ],
        padding: 12, // padding within buttons (INTEGER)
        radius: 4, // the corner radius on each button (INTEGER)
        show_total: false,
        size: 40, // the size of each button (INTEGER)

        // OPTIONAL PARAMETERS
        url: new URL(window.location.href).toString(), // (defaults to current url)
    };

    avatar!: String;
    defaultAvatar: String = '../../../assets/img/default_avatar.png';

    postId!: any;
    post!: any;
    categoryName!: any;
    userId!: any;
    postOwnerId!: any;

    commentList: any[] = [];
    isEditComment: boolean = false;
    commentForm!: FormGroup;
    commentId!: any;
    endComment: number = 5;

    isAdmin: boolean = false;
    needSubscribe: boolean = false;

    constructor(
        private _cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private paymentService: PaymentService,
        private commentService: CommentService,
        private postService: PostService,
        private authService: AuthService,
        private userStorageService: UserStorageService,
        private spinner: SpinnerService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private globalService: GlobalService,
        private categoryService: CategoryService,
        private toastr: ToastrService,
        public dialog: MatDialog) {
        this.postId = this.activatedRoute.snapshot.params['id'];
        this.userId = JSON.parse(this.userStorageService.getUser()!).id;
        this.globalService.isAdmin.subscribe(isAdmin => {
            this.isAdmin = isAdmin;
        });
    }

    ngOnInit(): void {
        this.getPost();
        this.getAllComment();
        this.initForm();
        this.spinner.show();
        setTimeout(() => {
            this.spinner.hide();
        }, 1500);

        Pusher.logToConsole = false;

        const pusher = new Pusher('9828c604c6fe5f7d1400', {
            cluster: 'ap1'
        });

        const channel = pusher.subscribe('blog');
        channel.bind('comment_' + this.postId, (data: Array<any>) => {
            // this.messages.push(data);
            for (let i = 0; i < data.length; i++) {
                let commentIndex = this.commentList.findIndex(x => x.id == data[i]?.id);
                if (commentIndex == -1) {
                    this.commentList.unshift(data[i]);
                } else {
                    if (data[i]?.is_delete == true) {
                        this.commentList.splice(commentIndex, 1);
                    } else {
                        this.commentList[commentIndex] = data[i];
                    }
                }
            }
            // alert(JSON.stringify(data));
        });
    }

    getPost() {
        this.postService.getById(this.postId).subscribe((data: any) => {
            if (data.data == 'Subscribe to read more') {
                this.needSubscribe = true;
            } else {
                this.postOwnerId = data.data.id;
                console.log(data.data);
                this.post = data.data;
                this.authService.getById(data.data.user_id).subscribe((data: any) => {
                    this.avatar = data.data.avatar ? data.data.avatar : '../../../assets/img/default_avatar.png';
                });
                // const body = {
                //     "id": data.data.categoryId
                // }
                this.categoryService.getById(data.data.category_id).subscribe((data: any) => {
                    this.categoryName = data.data.name;
                });
            }
        });
    }

    subscribe() {
        this.spinner.show();
        this.paymentService.payRedirect({
            amount: environment.SUBSCRIBE_AMOUNT
        }).subscribe((data: any) => {
            this.spinner.show();
            window.location.href = data.data;
        });
    }

    getAllComment() {
        this.commentService.getAll(this.postId).subscribe((data: any) => {
            this.commentList = data.data;
            // this.commentList.forEach((comment: any) => {
            //     this.authService.getById(comment.userId).subscribe((data: any) => {
            //         comment["user"] = data.data;
            //     });
            // });
        });
    }

    delete() {
        const body = {
            "id": this.postId
        }
        const dialogRef = this.dialog.open(BlogDetailDialogComponent, {
            data: {
                name: "Delete",
                data: body
            },
            width: '500px',
            height: '172px',
            autoFocus: true,
            restoreFocus: false
        });
        dialogRef.afterClosed().toPromise().then((result: any) => {
            if (result) {
                this.router.navigateByUrl('/my-post');
            }
        });
    }

    async edit() {
        const body = this.post;
        const dialogRef = this.dialog.open(BlogDetailDialogComponent, {
            data: {
                name: "Edit",
                data: body
            },
            width: '800px',
            height: '600px',
            autoFocus: true,
            restoreFocus: false
        });
        dialogRef.afterClosed().toPromise().then((result: any) => {
            if (result) {
                this.spinner.show();
                setTimeout(() => {
                    this.getPost();
                    this._cdr.detectChanges();
                }, 500);
                setTimeout(() => {
                    this.spinner.hide();
                }, 1500);
            }
        });
    }

    initForm() {
        this.commentForm = this.fb.group({
            id: [null],
            body: [null, Validators.required],
            userId: [this.userId, Validators.required],
            postId: [this.postId, Validators.required],
            // createdDate: [null],
        });
    }

    get form() {
        return this.commentForm.controls;
    }

    enableEditComment(comment: any) {
        this.commentForm.patchValue({
            body: comment.body,
        })
        this.isEditComment = true;
        this.commentId = comment.id;
    }

    save(comment?: any) {
        if (comment != null) {
            this.commentForm.patchValue({
                id: comment.id != null ? comment.id : null,
                // createdDate: comment.createdDate,
            });
        }
        if (this.commentForm.valid) {
            this.commentService.save(this.commentForm.value).subscribe((data: any) => {
                this.spinner.show();
                // this.getAllComment();
                this.isEditComment = false;
                setTimeout(() => {
                    this.spinner.hide();
                }, 1000);
                this.cancel();
                this.scrollTop(data.id);
            });
        } else {
            if (this.form.userId.errors?.required) {
                this.toastr.warning("Log in to comment", "Warning");
            } else if (this.form.body.errors?.required) {
                this.toastr.warning('Comment body is required', 'Warning');
            }
        }
    }

    cancel() {
        this.isEditComment = false;
        this.commentId = null;
        this.commentForm.patchValue({
            id: null,
            body: null
        });
    }

    deleteComment(comment: any) {
        const body = {
            id: comment.id
        }
        const dialogRef = this.dialog.open(BlogDetailDialogComponent, {
            data: {
                name: "Delete comment",
                data: body
            },
            width: '500px',
            height: '172px',
            autoFocus: true,
            restoreFocus: false
        });
        dialogRef.afterClosed().toPromise().then((result: any) => {
            if (result === true) {
                this.spinner.show();
                // this.getAllComment();
                this.cancel();
                // this.scrollTop();Z
                setTimeout(() => {
                    this.spinner.hide();
                }, 1000);
            }
        });
    }

    loadMore() {
        this.endComment += 5;
    }

    loadLess() {
        this.endComment = 5;
    }

    scrollTo(el: Element) {
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    scrollTop(commentId?: any) {
        const firstElement = document.querySelector('.content-' + (commentId != null ? commentId : ''));
        this.scrollTo(firstElement!);
    }

}
