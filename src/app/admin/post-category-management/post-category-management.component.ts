import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { PostCategoryDialogComponent } from './post-category-dialog/post-category-dialog.component';

@Component({
    selector: 'app-post-category-management',
    templateUrl: './post-category-management.component.html',
    styleUrls: ['./post-category-management.component.scss']
})
export class PostCategoryManagementComponent implements OnInit {

    displayedColumns: string[] = ['No', 'name', 'createdDate', 'isActive', 'actions'];
    dataSource: any = [];

    constructor(private categoryService: CategoryService, private spinner: SpinnerService, public dialog: MatDialog) { }

    ngOnInit(): void {
        this.spinner.show();
        this.getAll();
        setTimeout(() => {
            this.spinner.hide();
        }, 1000);
    }

    getAll() {
        this.categoryService.getAll().subscribe((data: any) => {
            this.dataSource = data.data.sort((a: any, b: any) => {
                return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
            });
        });
    }

    async add() {
        const dialogRef = this.dialog.open(PostCategoryDialogComponent, {
            data: {
                name: "Add"
            },
            width: '500px',
            height: '550px',
        });
        dialogRef.afterClosed().toPromise().then((result: any) => {
            if (result) {
                this.getAll();
            }
        });
    }

    async edit(row: any) {
        const dialogRef = this.dialog.open(PostCategoryDialogComponent, {
            data: {
                name: "Edit",
                data: row
            },
            width: '500px',
            height: '550px',
        });
        dialogRef.afterClosed().toPromise().then((result: any) => {
            if (result) {
                this.getAll();
            }
        });
    }

    async delete(row: any) {
        const dialogRef = this.dialog.open(PostCategoryDialogComponent, {
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
}
