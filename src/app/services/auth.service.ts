import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    serviceUrl: string = '';

    constructor(private http: HttpClient) {
        this.serviceUrl = environment.BASE_URL + environment.PATH.AUTH_API
    }

    login(body: any): Observable<any> {
        return this.http.post<any>(`${this.serviceUrl}login`, body);
    }

    register(body: any): Observable<any> {
        return this.http.post<any>(`${this.serviceUrl}register`, body, httpOptions);
    }

    logout(body: any): Observable<any> {
        return this.http.post<any>(`${this.serviceUrl}logout`, body, httpOptions);
    }

    isLoggedIn(): boolean {
        return window.sessionStorage.getItem(environment.STORAGE.TOKEN_KEY) != null || window.localStorage.getItem(environment.STORAGE.TOKEN_KEY) != null;
    }

    getAll(): Observable<any> {
        return this.http.get(`${this.serviceUrl}get_all`);
    }

    getById(id: any): Observable<any> {
        return this.http.get(`${this.serviceUrl}get_by_id/${id}`);
    }

    upadte(body: any): Observable<any> {
        return this.http.post(`${environment.BASE_URL}/user/update`, body);
    }

    checkAdmin(id: String) {
        return this.http.get(`${environment.BASE_URL}/user/check-admin/${id}`);
    }

    isAdmin() {
        let userRoles = window.sessionStorage.getItem('user_role') != null ? window.sessionStorage.getItem('user_role') : window.localStorage.getItem('user_role');
        if (userRoles != null && userRoles.includes('ROLE_ADMIN')) {
            return true;
        } else return false;
    }

    getAllAuthors() {
        return this.http.get(`${environment.BASE_URL}/user/all-authors`);
    }

    getUserByUsername(username: string): Observable<any> {
        return this.http.get(`${environment.BASE_URL}/user/unique-name/${username}`);
    }

    getUserByEmail(email: string): Observable<any> {
        return this.http.get(`${environment.BASE_URL}/user/unique-email/${email}`);
    }

    delete(body: String): Observable<any> {
        return this.http.post(`${environment.BASE_URL}/user/delete`, body);
    }

    search(body: any): Observable<any> {
        return this.http.post(`${environment.BASE_URL}/user/search`, body);
    }

    forgotPassword(body: any): Observable<any> {
        return this.http.post(`${environment.BASE_URL}/user/forgot-password`, body);
    }
}
