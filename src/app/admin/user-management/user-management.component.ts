import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CustomeDateValidators } from 'src/app/directive/after-date';
import { AuthService } from 'src/app/services/auth.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UserDialogComponent } from './user-dialog/user-dialog.component';

@Component({
    selector: 'app-user-management',
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

    isSubmitted: boolean = false;
    displayedColumns: string[] = ['No', 'username', 'email', 'roles', 'createdDate', 'isActive', 'actions'];
    dataSource: any = [];

    userForm!: FormGroup;

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

    roleList = [
        {
            id: 1,
            name: "ROLE_ADMIN",
        },
        {
            id: 2,
            name: 'ROLE_USER',
        }
    ]

    constructor(private fb: FormBuilder, private toastr: ToastrService, private authService: AuthService, private spinner: SpinnerService, public dialog: MatDialog) { }

    ngOnInit(): void {
        this.spinner.show();
        this.initForm();
        this.getAll();
        setTimeout(() => {
            this.spinner.hide();
        }, 1000);
    }

    initForm() {
        this.userForm = this.fb.group({
            username: [null],
            email: [null, [Validators.email]],
            phone: [null],
            isActive: [null],
            roleId: [null],
            startDate: [null],
            endDate: [null],
        }, {
            validators: [
                CustomeDateValidators.fromToDate('startDate', 'endDate'),
                CustomeDateValidators.startDate('startDate'),
                CustomeDateValidators.endDate('endDate'),
            ]
        });
    }

    get form() {
        return this.userForm.controls;
    }

    getAll() {
        this.authService.getAll().subscribe((data: any) => {
            this.dataSource = data.data.sort((a: any, b: any) => {
                return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
            });
        });
    }

    async delete(row: any) {
        const dialogRef = this.dialog.open(UserDialogComponent, {
            data: {
                name: "Delete",
                data: row
            },
            width: '500px',
            height: '172px',
        });
        dialogRef.afterClosed().toPromise().then((result: any) => {
            if (result) {
                this.getAll();
            }
        });
    }

    async edit(row: any) {
        const dialogRef = this.dialog.open(UserDialogComponent, {
            data: {
                name: "Edit",
                data: row
            },
            width: '800px',
            height: '600px',
        });
        dialogRef.afterClosed().toPromise().then((result: any) => {
            if (result) {
                this.getAll();
            }
        });
    }

    setBodyRequest() {
        return {
            username: this.userForm.value.username != '' ? this.userForm.value.username : null,
            email: this.userForm.value.email != '' ? this.userForm.value.email : null,
            phone: this.userForm.value.phone != '' ? this.userForm.value.phone : null,
            isActive: this.userForm.value.isActive,
            roleId: this.userForm.value.roleId,
            startDate: this.userForm.value.startDate,
            endDate: this.userForm.value.endDate != null ? new Date(this.userForm.value.endDate.getTime() + 86400000) : null,
        }
    }

    search() {
        this.spinner.show();
        const body = this.setBodyRequest();
        if (this.userForm.valid) {
            this.authService.search(body).subscribe((data: any) => {
                this.dataSource = data.data.sort((a: any, b: any) => {
                    return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
                });
                setTimeout(() => {
                    this.spinner.hide();
                }, 1000);
            }, () => {
                setTimeout(() => {
                    this.spinner.hide();
                }, 1000);
            });
        } else {
            if (this.form.email.errors?.email) {
                this.toastr.error('Email is not valid', 'Error');
            }
            setTimeout(() => {
                this.spinner.hide();
            }, 1000);
        }
    }
}
