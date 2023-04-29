import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CustomeDateValidators } from 'src/app/directive/after-date';
import { AuthService } from 'src/app/services/auth.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UserService } from 'src/app/services/user.service';
import { PostCategoryDialogComponent } from '../../post-category-management/post-category-dialog/post-category-dialog.component';

@Component({
    selector: 'app-user-dialog',
    templateUrl: './user-dialog.component.html',
    styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {

    selectedFile!: FileList;
    isSubmitted: boolean = false;
    userForm!: FormGroup;
    user!: any;

    statusList = [
        {
            name: 'Active',
            value: true,
        },
        {
            name: 'Disabled',
            value: false,
        }
    ]

    constructor(private fb: FormBuilder, private authService: AuthService, private userService: UserService, private spinner: SpinnerService, private toastr: ToastrService, public dialogRef: MatDialogRef<PostCategoryDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit(): void {
        this.initForm();
        this.getUser();
    }

    initForm() {
        this.userForm = this.fb.group({
            id: [null],
            firstName: [null],
            middleName: [null],
            lastName: [null],
            username: [null, Validators.required],
            email: [null, [Validators.required, Validators.email]],
            phone: [null],
            birthday: [null],
            avatar: [null],
            isActive: [null, Validators.required],
            type: [null],
            createdDate: [null],
            roles: [null]
        }, {
            validators: [
                CustomeDateValidators.startDate('birthday'),
            ]
        });
    }

    getUser() {
        this.userForm.patchValue(this.data.data);
    }

    get form() {
        return this.userForm.controls;
    }

    selectFile(event: any) {
        this.selectedFile = event.target.files;
    }

    delete() {
        const body = this.data.data;
        if (body.id == this.userService.getUserId()) {
            this.toastr.error("You can't delete your account");
        } else {
            this.authService.delete(body).subscribe((data: any) => {
                this.toastr.success('Delete user successfully');
                this.dialogRef.close(true);
            }, () => {
                setTimeout(() => {
                    this.spinner.hide();
                }, 1000);
            });
        }
    }

    setBodyRequest() {
        return {
            id: this.form.id.value,
            firstName: this.form.firstName.value,
            middleName: this.form.middleName.value,
            lastName: this.form.lastName.value,
            username: this.form.username.value,
            email: this.form.email.value,
            phone: this.form.phone.value,
            birthday: this.form.birthday.value,
            avatar: this.form.avatar.value,
            isActive: this.form.isActive.value,
            type: this.form.type.value,
            createdDate: this.form.createdDate.value,
            roles: this.form.roles.value,
        }
    }

    edit() {
        this.spinner.show();
        this.isSubmitted = true;
        const body = this.setBodyRequest();
        if (this.userForm.valid) {
            this.authService.upadte(body).subscribe((data: any) => {
                this.toastr.success('Updated successfully', 'Success');
                this.dialogRef.close(true);
                setTimeout(() => {
                    this.spinner.hide();
                }, 1000);
            });
        } else {
            setTimeout(() => {
                this.spinner.hide();
            }, 1000);
            this.toastr.warning('Please check your information', 'Warning');
        }
    }

    checkUser(evt: any) {
        if (evt.target.value != this.data.data.username) {
            this.authService.getUserByUsername(evt.target.value).subscribe((data: any) => {
                if (data.data == null) {
                    this.userForm.get('username')?.setErrors(null);
                } else {
                    this.userForm.get('username')?.setErrors({ unique: true });
                }
            });
        }
    }

    checkEmail(evt: any) {
        if (evt.target.value != this.data.data.email) {
            this.authService.getUserByEmail(evt.target.value).subscribe((data: any) => {
                if (data.data == null) {
                    this.userForm.get('email')?.setErrors(null);
                } else {
                    this.userForm.get('email')?.setErrors({ unique: true });
                }
            });
        }
    }


}
