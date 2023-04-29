import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerService } from 'src/app/services/spinner.service';
import { TagService } from 'src/app/services/tag.service';
import { TagDialogComponent } from './tag-dialog/tag-dialog.component';

@Component({
    selector: 'app-tag-management',
    templateUrl: './tag-management.component.html',
    styleUrls: ['./tag-management.component.scss']
})
export class TagManagementComponent implements OnInit {

    displayedColumns: string[] = ['No', 'name', 'createdDate', 'isActive', 'actions'];
    dataSource: any = [];

    constructor(private tagService: TagService, private spinner: SpinnerService, public dialog: MatDialog) { }

    ngOnInit(): void {
        this.spinner.show();
        this.getAll();
        setTimeout(() => {
            this.spinner.hide();
        }, 1000);
    }

    getAll() {
        this.tagService.getAll().subscribe((data: any) => {
            this.dataSource = data.data.sort((a: any, b: any) => {
                return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
            });
        });
    }

    async add() {
        const dialogRef = this.dialog.open(TagDialogComponent, {
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
        const dialogRef = this.dialog.open(TagDialogComponent, {
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
        const dialogRef = this.dialog.open(TagDialogComponent, {
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
