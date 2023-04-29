import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './about-us/about-us.component';
import { AuthorsComponent } from './authors/authors.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { BlogComponent } from './blog/blog.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { MyPostComponent } from './my-post/my-post.component';
import { ProfileComponent } from './profile/profile.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotComponent } from './forgot/forgot.component';

const routes: Routes = [
    {
        path: 'home',
        component: HomepageComponent
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'authors',
        component: AuthorsComponent
    },
    {
        path: 'about-us',
        component: AboutUsComponent
    },
    {
        path: 'blog',
        component: BlogComponent
    },
    {
        path: 'blog-detail/:id',
        component: BlogDetailComponent
    },
    {
        path: 'contact-us',
        component: ContactUsComponent
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'forgot-password',
        component: ForgotComponent,
    },
    {
        path: 'my-post',
        component: MyPostComponent
    },
    {
        path: 'sign-up',
        component: SignUpComponent
    },
    {
        path: 'profile',
        component: ProfileComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
