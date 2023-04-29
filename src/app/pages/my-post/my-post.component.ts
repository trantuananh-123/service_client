import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
import { FileService } from 'src/app/services/file.service';
import { PostService } from 'src/app/services/post.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { TagService } from 'src/app/services/tag.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-my-post',
    templateUrl: './my-post.component.html',
    styleUrls: ['./my-post.component.scss']
})
export class MyPostComponent implements OnInit {

    @ViewChild('fileInput', { static: false }) myFileInput!: ElementRef;
    @ViewChild('ngSelect', { static: false }) ngSelect!: NgSelectComponent;

    page: number = 0;
    panelOpenState: boolean = false;

    isSubmitted: boolean = false;

    postForm!: FormGroup;
    postList: any = [];
    selectedFile!: FileList;

    categoryList: any = [];
    tagList: any = [];

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

    constructor(private postService: PostService, private categoryService: CategoryService, private tagService: TagService, private authService: AuthService, private fileService: FileService, private fb: FormBuilder, private userService: UserService, private toastr: ToastrService, private el: ElementRef, private spinner: SpinnerService) {
    }

    ngOnInit(): void {
        this.spinner.show();
        this.initForm();
        this.getAllPost();
        this.getAllCategory();
        this.getAllTag();
        setTimeout(() => {
            /** spinner ends after 5 seconds */
            this.spinner.hide();
        }, 1500);
    }

    getAllPost() {
        let body = {
            "userId": this.userService.getUserId()
        }
        this.postService.getAllByUserId(body).subscribe((data: any) => {
            this.postList = data.data;
        });
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
            title: [null, Validators.required],
            description: [null, Validators.required],
            content: [null, Validators.required],
            userId: [this.userService.getUserId()],
            categoryId: [null, Validators.required],
            tags: [null]
        });
    }

    get form() {
        return this.postForm.controls;
    }

    setBodyRequest() {
        return {
            title: this.postForm.value.title,
            description: this.postForm.value.description,
            content: this.postForm.value.content,
            userId: this.postForm.value.userId,
            image: '',
            categoryId: this.postForm.value.categoryId,
            tags: this.postForm.value.tags
        }
    }

    selectFile(event: any) {
        this.selectedFile = event.target.files;
    }

    post() {
        this.spinner.show();
        this.isSubmitted = true;
        let body = this.setBodyRequest();
        if (this.postForm.valid) {
            this.fileService.upload(this.selectedFile[0]).subscribe((data: any) => {
                body["image"] = data.data.imageUrl;
                this.postService.save(body).subscribe((data: any) => {
                    this.getAllPost();
                    this.isSubmitted = false;
                    this.postForm.reset();
                    this.myFileInput.nativeElement.value = '';
                    this.ngSelect.handleClearClick();
                    this.closePanel();
                    setTimeout(() => {
                        this.spinner.hide();
                    }, 1000);
                    this.toastr.success("Post successfully", 'Success');
                }, (error: any) => {
                    this.toastr.error(error.error.message, 'Error');
                });
            }, (error: any) => {
                this.toastr.error(error.error.message, 'Error');
                setTimeout(() => {
                    this.spinner.hide();
                }, 1000);
            });
        }
        else {
            this.scrollToError();
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
            setTimeout(() => {
                this.spinner.hide();
            }, 1000);
        }
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

    setState(state: boolean) {
        this.panelOpenState = state;
    }

    closePanel() {
        this.panelOpenState = false;
    }

    scrollTo(el: Element) {
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    scrollToError() {
        this.focusError();
        const firstElementWithError = document.querySelector('.ng-invalid[formControlName]');
        this.scrollTo(firstElementWithError!);
    }

    focusError() {
        for (const key of Object.keys(this.postForm.controls)) {
            if (this.postForm.controls[key].invalid) {
                const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
                invalidControl.focus();
                break;
            }
        }
    }

    scrollTop() {
        const firstElement = document.querySelector('.post-list');
        this.scrollTo(firstElement!);
    }

}
