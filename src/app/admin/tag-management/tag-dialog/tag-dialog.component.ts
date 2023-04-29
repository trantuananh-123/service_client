import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CustomeDateValidators } from 'src/app/directive/after-date';
import { FileService } from 'src/app/services/file.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { TagService } from 'src/app/services/tag.service';
import { PostCategoryDialogComponent } from '../../post-category-management/post-category-dialog/post-category-dialog.component';

@Component({
    selector: 'app-tag-dialog',
    templateUrl: './tag-dialog.component.html',
    styleUrls: ['./tag-dialog.component.scss']
})
export class TagDialogComponent implements OnInit {

    @ViewChild('fileInput', { static: false }) myFileInput!: ElementRef;

    isSubmitted: boolean = false;
    tagForm!: FormGroup;
    selectedFile!: FileList;

    stateList = [
        {
            name: 'Active',
            value: true,
        },
        {
            name: 'Disabled',
            value: false,
        }
    ]

    constructor(private datePipe: DatePipe, private fb: FormBuilder, private fileService: FileService, private tagService: TagService, private spinner: SpinnerService, private toastr: ToastrService, public dialogRef: MatDialogRef<PostCategoryDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit(): void {
        this.initForm();
        if (this.data.name === 'Edit') {
            this.data.data.createdDate = this.datePipe.transform(this.data.data.createdDate.substring(0, 10), "MM/dd/YYYY");
            this.tagForm.patchValue(this.data.data);
        } else if (this.data.name === 'Delete') {
            this.tagForm.patchValue({ id: this.data.data.id });
        }
    }

    initForm() {
        this.tagForm = this.fb.group({
            id: [''],
            name: ['', Validators.required],
            createdDate: [{ value: new Date(), disabled: this.data.data != null ? true : false }, Validators.required],
            isActive: ['', Validators.required],
            image: ['']
        }, {
            validators: [
                CustomeDateValidators.startDate('createdDate'),
            ]
        });
    }

    get form() {
        return this.tagForm.controls;
    }

    setBodyRequest() {
        return {
            id: this.form.id.value,
            name: this.form.name.value,
            createdDate: new Date(this.form.createdDate.value),
            updatedDate: new Date(),
            isActive: this.form.isActive.value,
            image: this.form.image.value
        }
    }

    selectFile(event: any) {
        this.selectedFile = event.target.files;
    }

    save() {
        this.isSubmitted = true;
        const body = this.setBodyRequest();
        if (this.tagForm.valid) {
            this.spinner.show();
            if (this.selectedFile != null) {
                this.fileService.upload(this.selectedFile[0]).subscribe((data: any) => {
                    body["image"] = data.data.imageUrl;
                    this.tagService.save(body).subscribe((data: any) => {
                        this.toastr.success('Edit category successfully', 'Success');
                        this.dialogRef.close(true);
                    }, () => {
                        this.toastr.error('Edit category failed', 'Error');
                    });
                });
            } else {
                this.tagService.save(body).subscribe((data: any) => {
                    this.toastr.success('Edit category successfully', 'Success');
                    this.dialogRef.close(true);
                }, () => {
                    this.toastr.error('Edit category failed', 'Error');
                })
            }
        } else {
            this.toastr.warning('Please check all required field', 'Warning');
        }
        setTimeout(() => {
            this.spinner.hide();
        }, 1500);
    }

    delete() {
        this.isSubmitted = true;
        const body = { "id": this.tagForm.value.id };
        this.spinner.show();
        this.tagService.delete(body).subscribe((data: any) => {
            this.toastr.success('Delete category successfully', 'Success');
            this.dialogRef.close(true);
        }, () => {
            this.toastr.error('Delete category failed', 'Error');
        });
        setTimeout(() => {
            this.spinner.hide();
        }, 1500);
    }

}
