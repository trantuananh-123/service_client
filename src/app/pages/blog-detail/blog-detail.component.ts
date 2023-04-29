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

@Component({
    selector: 'app-blog-detail',
    templateUrl: './blog-detail.component.html',
    styleUrls: ['./blog-detail.component.scss']
})
export class BlogDetailComponent implements OnInit {

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

    constructor(private _cdr: ChangeDetectorRef, private fb: FormBuilder, private commentService: CommentService, private postService: PostService, private authService: AuthService, private userService: UserService, private spinner: SpinnerService, private activatedRoute: ActivatedRoute, private router: Router, private globalService: GlobalService, private categoryService: CategoryService, private toastr: ToastrService, public dialog: MatDialog) {
        this.postId = this.activatedRoute.snapshot.params['id'];
        this.userId = this.userService.getUserId();
        this.globalService.isAdmin.subscribe(isAdmin => {
            this.isAdmin = isAdmin;
            console.log(isAdmin);
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
    }

    getPost() {
        this.postService.getById(this.postId).subscribe((data: any) => {
            this.postOwnerId = data.data.id;
            this.post = data.data;
            this.authService.getById(data.data.userId).subscribe((data: any) => {
                this.avatar = data.data.avatar;
            });
            const body = {
                "id": data.data.categoryId
            }
            this.categoryService.getById(body).subscribe((data: any) => {
                this.categoryName = data.data.name;
            });
        });
    }

    getAllComment() {
        this.commentService.getAll(this.postId).subscribe((data: any) => {
            this.commentList = data.data.sort((a: any, b: any) => {
                return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
            });
            this.commentList.forEach((comment: any) => {
                this.authService.getById(comment.userId).subscribe((data: any) => {
                    comment["user"] = data.data;
                });
            });
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
            content: [null, Validators.required],
            userId: [this.userId, Validators.required],
            postId: [this.postId, Validators.required],
            createdDate: [null],
        });
    }

    get form() {
        return this.commentForm.controls;
    }

    enableEditComment(comment: any) {
        this.commentForm.patchValue({
            content: comment.content,
        })
        this.isEditComment = true;
        this.commentId = comment.id;
    }

    save(comment?: any) {
        if (comment != null) {
            this.commentForm.patchValue({
                id: comment.id != null ? comment.id : null,
                createdDate: comment.createdDate,
            });
        }
        if (this.commentForm.valid) {
            this.commentService.save(this.commentForm.value).subscribe((data: any) => {
                this.spinner.show();
                this.getAllComment();
                this.isEditComment = false;
                setTimeout(() => {
                    this.spinner.hide();
                }, 1000);
                this.cancel();
                this.scrollTop(data.data.id);
            });
        } else {
            if (this.form.userId.errors?.required) {
                this.toastr.warning("Log in to comment", "Warning");
            } else if (this.form.content.errors?.required) {
                this.toastr.warning('Comment content is required', 'Warning');
            }
        }
    }

    cancel() {
        this.isEditComment = false;
        this.commentId = null;
        this.commentForm.patchValue({
            id: null,
            content: null
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
                this.getAllComment();
                this.cancel();
                this.scrollTop();
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
