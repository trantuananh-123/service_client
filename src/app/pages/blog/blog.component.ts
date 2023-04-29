import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CustomeDateValidators } from 'src/app/directive/after-date';
import { CategoryService } from 'src/app/services/category.service';
import { PostService } from 'src/app/services/post.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { TagService } from 'src/app/services/tag.service';

@Component({
    selector: 'app-blog',
    templateUrl: './blog.component.html',
    styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

    isSubmitted: boolean = false;

    page: number = 0;

    postList: any = [];
    categoryList: any = [];
    tagList: any = [];
    topPostList: any = [];

    searchForm!: FormGroup;

    constructor(private fb: FormBuilder, private postService: PostService, private categoryService: CategoryService, private tagService: TagService, private spinner: SpinnerService, private toastr: ToastrService) { }

    ngOnInit(): void {
        this.spinner.show();
        this.initForm();
        this.getAllPost();
        this.getAllCategory();
        this.getAllTag();
        this.getTopPost();
        setTimeout(() => {
            this.spinner.hide();
        }, 1500);
    }

    initForm() {
        this.searchForm = this.fb.group({
            authorName: [null],
            categoryId: [null],
            tags: [null],
            startDate: [null],
            endDate: [null]
        }, {
            validator: [
                CustomeDateValidators.fromToDate('startDate', 'endDate'),
                CustomeDateValidators.startDate('startDate'),
                CustomeDateValidators.endDate('endDate'),
            ]
        });
    }

    get form() {
        return this.searchForm.controls;
    }

    getAllPost() {
        this.postService.getAll().subscribe((data: any) => {
            this.postList = data.data.filter((post: any) => post.isActive);;
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

    getTopPost() {
        this.postService.getTop4ByRate().subscribe((data: any) => {
            this.topPostList = data.data.filter((post: any) => post.isActive);
        });
    }

    scrollTo(el: Element) {
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    scrollTop() {
        const firstElement = document.querySelector('.post-list');
        this.scrollTo(firstElement!);
    }

    setBodyRequest() {
        return {
            authorName: this.form.authorName.value != '' ? this.form.authorName.value : null,
            categoryId: this.form.categoryId.value != null ? this.form.categoryId.value : null,
            tags: this.form.tags.value != null ? this.form.tags.value : null,
            startDate: this.form.startDate.value != null ? this.form.startDate.value : null,
            endDate: this.form.endDate.value != null ? this.form.endDate.value : null
        };
    }

    search() {
        this.isSubmitted = true;
        const body = this.setBodyRequest();
        if (this.isAllNull()) {
            this.spinner.show();
            this.getAllPost();
            this.scrollTop();
            this.isSubmitted = false;
            setTimeout(() => {
                this.spinner.hide();
            }, 1500);
        } else {
            if (this.searchForm.valid) {
                this.spinner.show();
                this.postService.search(body).subscribe((data: any) => {
                    this.postList = data.data.filter((post: any) => post.isActive);;
                    if (data.data.length > 0) {
                        this.scrollTop();
                    }
                    this.isSubmitted = false;
                    setTimeout(() => {
                        this.spinner.hide();
                    }, 1500);
                });
            } else {
                this.isSubmitted = false;
                this.toastr.error('From Date and Start Date is invalid', 'Error');
                setTimeout(() => {
                    this.spinner.hide();
                }, 1500);
            }
        }
    }

    isAllNull() {
        return this.form.authorName.value == null && this.form.categoryId.value == null && this.form.tags.value == null && this.form.startDate.value == null && this.form.endDate.value == null;
    }

}
