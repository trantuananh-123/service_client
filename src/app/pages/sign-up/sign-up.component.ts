import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

    isSubmitted: boolean = false;
    isAgreed: boolean = false;

    signUpForm!: FormGroup;
    isLoggedIn: boolean = false;

    constructor(private authService: AuthService, private fb: FormBuilder, private router: Router, private toastr: ToastrService) {
        this.isLoggedIn = this.authService.isLoggedIn();
    }

    ngOnInit(): void {
        this.initForm();
        if (this.isLoggedIn) {
            this.router.navigateByUrl('/');
        }
    }

    initForm() {
        this.signUpForm = this.fb.group({
            username: [null, [Validators.required, Validators.maxLength(255)]],
            email: [null, [Validators.required, Validators.email, Validators.maxLength(255)]],
            password: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(255)]],
            confirmPassword: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(255)]],
        });
    }

    get form() {
        return this.signUpForm.controls;
    }

    agree(event: any) {
        this.isAgreed = event.target.checked;
    }

    setBodyRequest() {
        return {
            name: this.signUpForm.value.username != null ? this.signUpForm.value.username : null,
            email: this.signUpForm.value.email != null ? this.signUpForm.value.email : null,
            password: this.signUpForm.value.password != null ? this.signUpForm.value.password : null,
            password_confirmation: this.signUpForm.value.confirmPassword != null ? this.signUpForm.value.confirmPassword : null,
        }
    }

    signUp() {
        this.isSubmitted = true;
        const body = this.setBodyRequest();
        if (this.signUpForm.valid) {
            this.authService.register(body).subscribe((data: any) => {
                if (data) {
                    this.toastr.success('Sign up successfully', 'Success');
                    setTimeout(() => {
                        this.router.navigateByUrl('/login');
                    }, 1000);
                }
            }, (error: any) => {
                if (error.error?.errors['email']) {
                    this.toastr.error(error.error.errors['email'][0], 'Error');
                }
            });
        } else {
            if (this.form.username.errors?.required) {
                this.toastr.warning("Username is required", "Warning");
            } else if (this.form.email.errors?.required) {
                this.toastr.warning("Email is required", "Warning");
            } else if (this.form.email.errors?.email) {
                this.toastr.warning("Email is invalid", "Warning");
            } else if (this.form.password.errors?.minLength) {
                this.toastr.warning("Password must longer than 8 characters", "Warning");
            } else if (this.form.confirmPassword.errors?.minLength) {
                this.toastr.warning("Password must longer than 8 characters", "Warning");
            } else {
                this.toastr.warning('Please fill all required fields', 'Warning');
            }
        }
    }

    checkConfirmPassword() {
        if (this.form.password.value != this.form.confirmPassword.value) {
            this.signUpForm.get('confirmPassword')?.setErrors({ notMatch: true });
        } else {
            this.signUpForm.get('confirmPassword')?.setErrors(null);
        }
    }
}
