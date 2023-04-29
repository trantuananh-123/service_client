import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShareRoutingModule } from './share-routing.module';
import { HeaderComponent } from '../share/header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { InstagramComponent } from './instagram/instagram.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';

const MATERIAL_MODULE = [MatFormFieldModule, MatCardModule, MatExpansionModule, MatTabsModule, MatProgressSpinnerModule, MatMenuModule, MatDatepickerModule, MatNativeDateModule, MatInputModule, MatTableModule, MatIconModule, MatButtonModule, MatChipsModule, MatDialogModule];
const FORM_MODULE = [ReactiveFormsModule, FormsModule];
const THIRD_MODULE = [AngularEditorModule, NgSelectModule, NgxPaginationModule];
@NgModule({
    declarations: [
        HeaderComponent,
        FooterComponent,
        InstagramComponent,
    ],
    imports: [
        CommonModule,
        ShareRoutingModule,
        ReactiveFormsModule,
        FORM_MODULE,
        MATERIAL_MODULE,
        THIRD_MODULE,
    ],
    exports: [
        HeaderComponent,
        FooterComponent,
        CarouselModule,
        InstagramComponent,
        FORM_MODULE,
        MATERIAL_MODULE,
        THIRD_MODULE,
    ]
})
export class ShareModule { }
