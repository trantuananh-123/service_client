import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
    selector: 'app-authors',
    templateUrl: './authors.component.html',
    styleUrls: ['./authors.component.scss']
})
export class AuthorsComponent implements OnInit {

    authorList: any = [];
    page: number = 0;

    constructor(private authService: AuthService, private spinner: SpinnerService) { }

    ngOnInit(): void {
        this.spinner.show();
        this.getAllAuthors();
    }

    getAllAuthors() {
        this.authService.getAllAuthors().subscribe((data: any) => {
            this.authorList = data.data;
            setTimeout(() => {
                this.spinner.hide();
            }, 1500);
        })
    }

    scrollTo(el: Element) {
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    scrollTop() {
        const firstElement = document.querySelector('.authors-single');
        this.scrollTo(firstElement!);
    }

}
