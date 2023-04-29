import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuardService {

    constructor(public authService: AuthService, public router: Router) { }

    canActivate() {
        if (!this.authService.isAdmin()) {
            this.router.navigateByUrl('/404');
            return false;
        }
        return true;
    }
}
