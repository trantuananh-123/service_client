import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CustomeDateValidators } from 'src/app/directive/after-date';
import { AuthService } from 'src/app/services/auth.service';
import { FileService } from 'src/app/services/file.service';
import { GlobalService } from 'src/app/services/global.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    @ViewChild('fileInput', { static: false }) myFileInput!: ElementRef;

    state: boolean = true;

    selectedFile!: FileList;
    isSubmitted: boolean = false;
    userForm!: FormGroup;
    user!: any;

    constructor(private fb: FormBuilder, private toastr: ToastrService, private spinner: SpinnerService, private authService: AuthService, private userService: UserService, private globalService: GlobalService, private fileService: FileService) { }

    ngOnInit(): void {
        this.spinner.show();
        this.initForm();
        this.getUser();
        setTimeout(() => {
            this.spinner.hide();
        }, 1000);
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
            isActive: [null],
            type: [null],
            createdDate: [null],
            roles: [null],
            password: [null]
        }, {
            validators: [
                CustomeDateValidators.startDate('birthday'),
            ]
        });
    }

    getUser() {
        this.authService.getById(this.userService.getUserId()!).subscribe((data: any) => {
            this.user = data.data;
            this.userForm.patchValue(data.data);
            this.userForm.patchValue({ password: null });
        });
    }

    get form() {
        return this.userForm.controls;
    }

    selectFile(event: any) {
        this.selectedFile = event.target.files;
    }

    upload() {
        this.spinner.show();
        this.userForm.patchValue(this.user);
        if (this.selectedFile != null) {
            this.fileService.upload(this.selectedFile[0]).subscribe((data: any) => {
                this.userForm.patchValue({
                    avatar: data.data.imageUrl
                });
                this.globalService.setAvatar(data.data.imageUrl ? data.data.imageUrl : '../../../assets/img/default_avatar.png');
                this.toastr.success('Uploaded successfully', 'Success');
                this.authService.upadte(this.userForm.value).subscribe((data: any) => {
                    this.getUser();
                    setTimeout(() => {
                        this.spinner.hide();
                    }, 1000);
                }, () => {
                    this.toastr.error('Something went wrong', 'Error');
                    setTimeout(() => {
                        this.spinner.hide();
                    }, 1000);
                });
            }, () => {
                this.toastr.error('Upload failed', 'Error');
                setTimeout(() => {
                    this.spinner.hide();
                }, 1000);
            });
        } else {
            this.toastr.warning('Please select file', 'Warning');
        }
    }

    save() {
        this.spinner.show();
        this.isSubmitted = true;
        if (this.userForm.valid) {
            this.authService.upadte(this.userForm.value).subscribe((data: any) => {
                this.toastr.success('Updated successfully', 'Success');
                this.getUser();
                setTimeout(() => {
                    this.spinner.hide();
                }, 1000);
            }, () => {
                this.toastr.error('Upload failed', 'Error');
                setTimeout(() => {
                    this.spinner.hide();
                }, 1000);
            });
        } else {
            this.toastr.warning('Please check your information', 'Warning');
            setTimeout(() => {
                this.spinner.hide();
            }, 1000);
        }
    }

    checkUser(evt: any) {
        this.authService.getUserByUsername(evt.target.value).subscribe((data: any) => {
            if (data.data == null) {
                this.userForm.get('username')?.setErrors(null);
            } else {
                this.userForm.get('username')?.setErrors({ unique: true });
            }
        });
    }

    checkEmail(evt: any) {
        this.authService.getUserByEmail(evt.target.value).subscribe((data: any) => {
            if (data.data == null) {
                this.userForm.get('email')?.setErrors(null);
            } else {
                this.userForm.get('email')?.setErrors({ unique: true });
            }
        });
    }

    changeState() {
        this.state = false;
        this.scrollTop();
    }

    scrollTo(el: Element) {
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    scrollTop() {
        const firstElement = document.querySelector('.form-control');
        this.scrollTo(firstElement!);
    }
}
