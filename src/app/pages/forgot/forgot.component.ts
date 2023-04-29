import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { GlobalService } from 'src/app/services/global.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-forgot',
    templateUrl: './forgot.component.html',
    styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {

    isSubmitted: boolean = false;

    forgotForm!: FormGroup;
    isLoggedIn: boolean = false;

    constructor(private authService: AuthService, private userService: UserService, private globalService: GlobalService, private fb: FormBuilder, private router: Router, private toastr: ToastrService, private spinner: SpinnerService) {
        this.isLoggedIn = this.authService.isLoggedIn();
    }

    ngOnInit(): void {
        this.initForm();
        if (this.isLoggedIn) {
            this.router.navigateByUrl('/');
        }
    }

    initForm() {
        this.forgotForm = this.fb.group({
            username: [null, Validators.required],
            email: [null, Validators.email],
            phone: [null],
        });
    }

    get form() {
        return this.forgotForm.controls;
    }

    setBodyRequest() {
        return {
            username: this.forgotForm.value.username != null ? this.forgotForm.value.username : null,
            email: this.forgotForm.value.email != null ? this.forgotForm.value.email : null,
            phone: this.forgotForm.value.phone != null ? this.forgotForm.value.phone : null,
            sendingType: this.forgotForm.value.phone != null ? 2 : 1,
        }
    }

    reset() {
        this.isSubmitted = true;
        this.spinner.show();
        const body = this.setBodyRequest();
        console.log(body);
        if ((body.email != null || body.email == '') && (body.phone != null || body.phone == '')) {
            this.toastr.warning('Please enter either email or phone number');
            this.spinner.hide();
        } else if (this.forgotForm.valid && (body.sendingType == 1 || 2)) {
            this.authService.forgotPassword(body).subscribe((data: any) => {
                this.toastr.success('Please check your email to reset your password', 'Success');
                this.router.navigateByUrl('/login');
                this.isSubmitted = false;
                setTimeout(() => {
                    this.spinner.hide();
                }, 2000);
            }, () => {
                this.spinner.show();
                setTimeout(() => {
                    this.spinner.hide();
                }, 1000);
            });
        } else {
            this.toastr.warning('Please fill all required fields', 'Error');
            this.spinner.show();
            this.isSubmitted = false;
            setTimeout(() => {
                this.spinner.hide();
            }, 2000);
        }
    }

}
