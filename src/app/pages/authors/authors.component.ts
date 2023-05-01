import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UserStorageService } from 'src/app/services/user-storage.service';

@Component({
    selector: 'app-authors',
    templateUrl: './authors.component.html',
    styleUrls: ['./authors.component.scss']
})
export class AuthorsComponent implements OnInit {

    authorList: any = [];
    userId: any;
    page: number = 0;

    constructor(private authService: AuthService, private spinner: SpinnerService, private userStorageService: UserStorageService) {
        const user = JSON.parse(this.userStorageService.getUser()!);
        if (!(user == null || user == undefined)) {
            this.userId = user.id;
        }
    }

    ngOnInit(): void {
        this.getAllAuthors();
    }

    getAllAuthors() {
        this.spinner.show();
        this.authService.getAll().subscribe((data: any) => {
            this.authorList = data.data.filter((x: any) => x.id != this.userId);
            setTimeout(() => {
                this.spinner.hide();
            }, 1500);
        });
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
