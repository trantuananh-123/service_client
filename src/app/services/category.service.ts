import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    constructor(private http: HttpClient) { }

    getAll(): Observable<any> {
        return this.http.get(`${environment.BASE_URL}/post_category/get-all`);
    }

    getById(body: any): Observable<any> {
        return this.http.post(`${environment.BASE_URL}/post_category/get-by-id`, body);
    }

    save(body: any): Observable<any> {
        return this.http.post(`${environment.BASE_URL}/post_category/save`, body);
    }

    delete(body: any): Observable<any> {
        return this.http.post(`${environment.BASE_URL}/post_category/delete`, body);
    }
}
