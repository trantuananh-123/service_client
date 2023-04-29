import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { HomepageComponent } from './homepage/homepage.component';
import { ShareModule } from '../share/share.module';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthorsComponent } from './authors/authors.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { BlogComponent } from './blog/blog.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { MyPostComponent } from './my-post/my-post.component';
import { HtmlPipe } from '../pipe/html-pipe';
import { TruncatePipe } from '../pipe/truncate-pipe';
import { BlogDetailDialogComponent } from './blog-detail/blog-detail-dialog/blog-detail-dialog.component';
import { ProfileComponent } from './profile/profile.component';
import { ForgotComponent } from './forgot/forgot.component';


@NgModule({
    declarations: [
        HomepageComponent,
        LoginComponent,
        SignUpComponent,
        NotFoundComponent,
        AuthorsComponent,
        ContactUsComponent,
        AboutUsComponent,
        BlogComponent,
        BlogDetailComponent,
        MyPostComponent,
        HtmlPipe,
        TruncatePipe,
        BlogDetailDialogComponent,
        ProfileComponent,
        ForgotComponent,
    ],
    imports: [
        CommonModule,
        PagesRoutingModule,
        ShareModule
    ]
})
export class PagesModule { }
