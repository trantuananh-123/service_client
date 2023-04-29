import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service';
const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
    },
    {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
        canActivate: [AuthGuard]
    },
    {
        path: '404',
        component: NotFoundComponent
    },
    {
        path: '**',
        redirectTo: '404',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
