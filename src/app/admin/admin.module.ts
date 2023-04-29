import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { PostManagementComponent } from './post-management/post-management.component';
import { ShareModule } from '../share/share.module';
import { PostCategoryManagementComponent } from './post-category-management/post-category-management.component';
import { PostCategoryDialogComponent } from './post-category-management/post-category-dialog/post-category-dialog.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserDialogComponent } from './user-management/user-dialog/user-dialog.component';
import { TagManagementComponent } from './tag-management/tag-management.component';
import { TagDialogComponent } from './tag-management/tag-dialog/tag-dialog.component';


@NgModule({
    declarations: [
        PostManagementComponent,
        PostCategoryManagementComponent,
        PostCategoryDialogComponent,
        UserManagementComponent,
        UserDialogComponent,
        TagManagementComponent,
        TagDialogComponent
    ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        ShareModule
    ]
})
export class AdminModule { }
