import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CategoryService } from 'src/app/services/category.service';
import { PostService } from 'src/app/services/post.service';
import { TagService } from 'src/app/services/tag.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { InlineFollowButtonsConfig } from 'sharethis-angular';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {


    followButtonConfig: InlineFollowButtonsConfig = {
        networks: [
            // which networks to include (see FOLLOW NETWORKS)
            'twitter',
            'facebook',
            'instagram',
        ],
        profiles: {
            // social profile links for buttons
            twitter: 'tom18102001',
            facebook: 'tom18102001',
            instagram: 'tom18102001',
        },
    };

    page: number = 1;

    customOptions: OwlOptions = {
        loop: true,
        mouseDrag: true,
        touchDrag: false,
        pullDrag: false,
        dots: false,
        navSpeed: 700,
        navText: ['', ''],
        responsive: {
            0: {
                items: 1
            },
            400: {
                items: 1
            },
            740: {
                items: 1
            },
            940: {
                items: 1
            }
        },
        nav: true,
        autoplay: true,
        autoplayHoverPause: true,
        autoHeight: true
    }

    postList: any = [];
    topPostList: any = [];
    categoryList: any = [];
    tagList: any = [];

    constructor(private postService: PostService, private categoryService: CategoryService, private tagService: TagService, private spinner: SpinnerService) { }

    ngOnInit(): void {
        this.spinner.show();
        this.getAllPost();
        this.getAllCategory();
        // this.getTopPost();
        // this.getAllTag();
        setTimeout(() => {
            /** spinner ends after 5 seconds */
            this.spinner.hide();
        }, 1500);
    }

    getAllPost() {
        this.postService.search({
            userId: null,
            categoryId: null,
            startDate: null,
            endDate: null,
        }
        ).subscribe((data: any) => {
            this.postList = data.data;
        });
    }

    getAllCategory() {
        this.categoryService.getAll().subscribe((data: any) => {
            this.categoryList = data.data;
        });
    }

    getTopPost() {
        this.postService.getTop4ByRate().subscribe((data: any) => {
            this.topPostList = data.data.filter((post: any) => post.isActive);
        });
    }

    getAllTag() {
        this.tagService.getAll().subscribe((data: any) => {
            this.tagList = data.data.filter((tag: any) => tag.isActive);
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

}
