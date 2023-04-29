import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { GlobalService } from 'src/app/services/global.service';
import { UserStorageService } from 'src/app/services/user-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    avatar!: String;
    defaultAvatar: String = '../../../assets/img/default_avatar.png';
    username!: String;
    isAdmin: boolean = false;

    constructor(private userStorageService: UserStorageService, private authService: AuthService, private globalService: GlobalService, private router: Router) {
        if (this.userStorageService.getUser()) {
            const user = JSON.parse(this.userStorageService.getUser()!);
            this.username = user.name;
            this.isAdmin = user.isAdmin ? user.isAdmin : 0;
            this.avatar = user.avatar ? user.avatar : '../../../assets/img/default_avatar.png';
            this.globalService.setUsername(user.user.name);
            this.globalService.setAvatar(user.user.avatar ? user.user.avatar : '../../../assets/img/default_avatar.png');
            this.globalService.setIsAdmin(user.user.isAdmin ? user.user.isAdmin : 0);
        }
    }

    ngOnInit(): void {
        this.globalService.username.subscribe(username => {
            this.username = username;
        });
        this.globalService.isAdmin.subscribe(isAdmin => {
            this.isAdmin = isAdmin;
        });
        this.globalService.avatar.subscribe(avatar => {
            this.avatar = avatar;
        });
    }

    logOut() {
        this.userStorageService.logOut();
        if (this.router.url.includes('/home')) {
            window.location.reload();
        }
        this.router.navigateByUrl('/');
    }

}
