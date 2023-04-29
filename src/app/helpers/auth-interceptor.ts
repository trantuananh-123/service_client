import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { TokenStorageService } from '../services/token-storage.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from '../services/global.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private globalService: GlobalService, private tokenService: TokenStorageService, private router: Router, private userService: UserService, private toastr: ToastrService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authReq = req;
        const token = this.tokenService.getToken();
        if (token != null) {
            authReq = req.clone({
                setHeaders: {
                    'Authorization': 'Bearer ' + `${token}`
                }
            });
        }

        return next.handle(authReq).pipe(
            catchError(
                (err: any) => {
                    if (err.status === 401) {
                        if (req.url.includes('/login')) {
                            this.toastr.error('Incorrect username or password', 'Error');
                        } else {
                            this.handleAuthError();
                        }
                        return of(err);
                    }
                    throw err;
                }
            )
        )
    }

    handleAuthError() {
        this.userService.logOut();
        this.toastr.warning('Please login to continue', 'Warning');
        this.router.navigateByUrl('/login');
    }
}



export const authProvider = [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];