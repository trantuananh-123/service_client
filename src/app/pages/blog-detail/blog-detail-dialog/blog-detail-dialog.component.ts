import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/app/services/category.service';
import { CommentService } from 'src/app/services/comment.service';
import { FileService } from 'src/app/services/file.service';
import { PostService } from 'src/app/services/post.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { TagService } from 'src/app/services/tag.service';

@Component({
    selector: 'app-blog-detail-dialog',
    templateUrl: './blog-detail-dialog.component.html',
    styleUrls: ['./blog-detail-dialog.component.scss']
})
export class BlogDetailDialogComponent implements OnInit {

    constructor(private commentService: CommentService, private spinner: SpinnerService, private fileService: FileService, private fb: FormBuilder, private categoryService: CategoryService, private tagService: TagService, private postService: PostService, private toastr: ToastrService, private router: Router, public dialogRef: MatDialogRef<BlogDetailDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

    isSubmitted: boolean = false;

    postForm!: FormGroup;
    postList: any = [];
    selectedFile!: FileList;

    categoryList: any = [];
    tagList: any = [];
    tadIdList: any = [];

    stateList = [
        {
            name: 'Active',
            value: true,
        },
        {
            name: 'Disabled',
            value: false,
        }
    ]

    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: '350px',
        minHeight: '350px',
        maxHeight: 'auto',
        width: 'auto',
        minWidth: '0',
        translate: 'yes',
        enableToolbar: true,
        showToolbar: true,
        placeholder: 'Enter text here...',
        defaultParagraphSeparator: '',
        defaultFontName: 'times-new-roman',
        defaultFontSize: '',
        fonts: [
            { class: 'arial', name: 'Arial' },
            { class: 'times-new-roman', name: 'Times New Roman' },
            { class: 'calibri', name: 'Calibri' },
            { class: 'comic-sans-ms', name: 'Comic Sans MS' }
        ],
        sanitize: true,
        toolbarPosition: 'top',
    }

    ngOnInit(): void {
        if (this.data.name === 'Edit') {
            this.tadIdList = this.data.data.tags.map((tag: any) => tag.id);
        }
        this.initForm();
        this.postForm.patchValue(this.data.data);
        this.postForm.patchValue({ tags: this.tadIdList });
        this.getAllCategory();
        this.getAllTag();
    }

    getAllCategory() {
        this.categoryService.getAll().subscribe((data: any) => {
            this.categoryList = data.data.filter((cat: any) => cat.isActive);
        });
    }

    getAllTag() {
        this.tagService.getAll().subscribe((data: any) => {
            this.tagList = data.data.filter((tag: any) => tag.isActive);
        });
    }

    initForm() {
        this.postForm = this.fb.group({
            id: [null, Validators.required],
            title: [null, Validators.required],
            description: [null, Validators.required],
            content: [null, Validators.required],
            userId: [null, Validators.required],
            categoryId: [null, Validators.required],
            image: [null, Validators.required],
            rate: [null],
            createdDate: [null, Validators.required],
            isActive: [null, Validators.required],
            tags: [null]
        });
    }

    get form() {
        return this.postForm.controls;
    }
    selectFile(event: any) {
        this.selectedFile = event.target.files;
    }

    newTag = (term: String) => {
        const body = {
            name: '#' + term
        }
        this.tagService.save(body).subscribe((data: any) => {
            this.getAllTag();
            this.toastr.success("Add tag successfully", 'Success');
        })
    }

    delete() {
        const body = this.data.data;
        this.postService.delete(body).subscribe((data: any) => {
            this.toastr.success('Delete successfully', 'Success');
            this.dialogRef.close(true);
            this.router.navigateByUrl('/my-post');
        })
    }

    setBodyRequest() {
        return {
            id: this.postForm.value.id,
            title: this.postForm.value.title,
            description: this.postForm.value.description,
            content: this.postForm.value.content,
            userId: this.postForm.value.userId,
            image: this.postForm.value.image,
            categoryId: this.postForm.value.categoryId,
            tags: this.postForm.value.tags,
            rate: this.postForm.value.rate,
            createdDate: this.postForm.value.createdDate,
            isActive: this.postForm.value.isActive,
        }
    }

    edit() {
        this.spinner.show();
        let body = this.setBodyRequest();
        if (this.postForm.valid) {
            this.isSubmitted = true;
            if (this.selectedFile != null) {
                this.fileService.upload(this.selectedFile[0]).subscribe((data: any) => {
                    body["image"] = data.data.imageUrl;
                    this.postService.save(body).subscribe((data: any) => {
                        this.isSubmitted = false;
                        this.postForm.reset();
                        setTimeout(() => {
                            this.spinner.hide();
                        }, 1000);
                        this.toastr.success("Edit successfully", 'Success');
                    }, () => {
                        this.isSubmitted = false;
                        this.toastr.error("Edit failed", 'Error');
                    });
                }, () => {
                    this.isSubmitted = false;
                    this.toastr.error("Edit failed", 'Error');
                });
            } else {
                this.postService.save(body).subscribe((data: any) => {
                    this.isSubmitted = false;
                    this.postForm.reset();
                    setTimeout(() => {
                        this.spinner.hide();
                    }, 1000);
                    this.toastr.success("Edit successfully", 'Success');
                }, () => {
                    this.isSubmitted = false;
                    this.toastr.error("Edit failed", 'Error');
                });
            }
        }
        else {
            if (this.form.title.errors?.required) {
                this.toastr.warning('Title is required', 'Warning');
            } else if (this.form.description.errors?.required) {
                this.toastr.warning('Description is required', 'Warning');
            } else if (this.form.image.errors?.required) {
                this.toastr.warning('Post image is required', 'Warning');
            } else if (this.form.categoryId.errors?.required) {
                this.toastr.warning('Post category is required', 'Warning');
            } else if (this.form.content.errors?.required) {
                this.toastr.warning('Content is required', 'Warning');
            }
        }
    }

    deleteComment() {
        this.commentService.delete(this.data.data).subscribe((data: any) => {
            this.toastr.success('Delete successfully', 'Success');
            this.dialogRef.close(true);
        })
    }

}
