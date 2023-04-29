import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { GlobalService } from 'src/app/services/global.service';
import { SocialService } from 'src/app/services/social.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserStorageService } from 'src/app/services/user-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    isSubmitted: boolean = false;
    isInit: boolean = false;

    googleUrl: string = '';
    facebookUrl: string = '';

    loginForm!: FormGroup;
    isLoggedIn: boolean = false;
    isrememberMe: boolean = false;

    constructor(
        private location: Location,
        private authService: AuthService,
        private tokenService: TokenStorageService,
        private socialService: SocialService,
        private userStorageService: UserStorageService,
        private globalService: GlobalService,
        private fb: FormBuilder,
        private router: Router,
        private toastr: ToastrService,
        private spinner: SpinnerService) {
        this.isLoggedIn = this.authService.isLoggedIn();
    }

    ngOnInit(): void {
        const queryParam = this.location.path().split('?')[1];
        if (queryParam == null || queryParam == undefined) {
            this.isInit = true;
            this.getGoogleLoginUrl();
            this.getFacebookLoginUrl();
            this.initForm();
            if (this.isLoggedIn) {
                this.router.navigateByUrl('/');
            }
        } else {
            if (queryParam.includes("google")) {
                this.socialService.googleLogin('?' + queryParam).subscribe(data => {
                    if (data) {
                        this.spinner.show();
                        this.saveUserInfo(data);
                        this.toastr.success('Login successfully', 'Success');
                        setTimeout(() => {
                            this.globalService.setUsername(data.user.name);
                            this.globalService.setAvatar(data.user.avatar ? data.user.avatar : '../../../assets/img/default_avatar.png');
                            this.globalService.setIsAdmin(data.user.isAdmin ? data.user.isAdmin : 0);
                            this.router.navigateByUrl('/home');
                            this.spinner.hide();
                        }, 1000);
                        this.router.navigate(['/']);
                    }
                })
            } else {

            this.socialService.facebookLogin('?' + queryParam).subscribe(data => {
                console.log(data);
                if (data) {
                    this.spinner.show();
                    this.saveUserInfo(data);
                    this.toastr.success('Login successfully', 'Success');
                    setTimeout(() => {
                        this.globalService.setUsername(data.user.name);
                        this.globalService.setAvatar(data.user.avatar ? data.user.avatar : '../../../assets/img/default_avatar.png');
                        this.globalService.setIsAdmin(data.user.isAdmin ? data.user.isAdmin : 0);
                        this.router.navigateByUrl('/home');
                        this.spinner.hide();
                    }, 1000);
                    this.router.navigate(['/']);
                }
            });
            }
        }
    }

    getGoogleLoginUrl() {
        this.socialService.getGoogleLoginUrl().subscribe(data => {
            this.googleUrl = data.url;
        })
    }

    getFacebookLoginUrl() {
        this.socialService.getFacebookLoginUrl().subscribe(data => {
            this.facebookUrl = data.url;
        })
    }

    initForm() {
        this.loginForm = this.fb.group({
            email: [null, Validators.required],
            password: [null, Validators.required],
        });
    }

    get form() {
        return this.loginForm?.controls;
    }

    setBodyRequest() {
        return {
            email: this.loginForm.value.email != null ? this.loginForm.value.email : null,
            password: this.loginForm.value.password != null ? this.loginForm.value.password : null,
        }
    }

    login() {
        this.isSubmitted = true;
        const body = this.setBodyRequest();
        if (this.loginForm.valid) {
            this.authService.login(body).subscribe((data: any) => {
                if (data) {
                    this.spinner.show();
                    this.saveUserInfo(data);
                    this.toastr.success('Login successfully', 'Success');
                    setTimeout(() => {
                        this.globalService.setUsername(data.user.name);
                        this.globalService.setAvatar(data.user.avatar ? data.user.avatar : '../../../assets/img/default_avatar.png');
                        this.globalService.setIsAdmin(data.user.isAdmin ? data.user.isAdmin : 0);
                        this.router.navigateByUrl('/home');
                        this.spinner.hide();
                    }, 1000);
                }
            }, (error: any) => {
                this.toastr.error(error.error.message, 'Error');
                setTimeout(() => {
                    this.spinner.hide();
                }, 1000)
            });
        } else {
            if (this.form.email.errors?.required || this.form.password.errors?.required) {
                this.toastr.warning('Please fill all required fields', 'Warning');
            } else {
                this.toastr.error('Incorrect email or password', 'Error');
            }
        }
    }

    saveUserInfo(data: any) {
        this.tokenService.saveToken(data.access_token, this.isrememberMe);
        this.userStorageService.saveUserStorage(JSON.stringify(data.user), this.isrememberMe);
    }

    rememberMe(event: any) {
        this.isrememberMe = event.target.checked;
    }

}
