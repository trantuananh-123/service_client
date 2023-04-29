import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    serviceUrl: string = '';

    constructor(private http: HttpClient) {
        this.serviceUrl = environment.BASE_URL + environment.PATH.CATEGORY_API
    }

    getAll(): Observable<any> {
        return this.http.get(`${this.serviceUrl}`);
    }

    getById(id: any): Observable<any> {
        return this.http.get(`${this.serviceUrl}${id}`);
    }

    save(body: any): Observable<any> {
        return this.http.post(`${environment.BASE_URL}/post_category/save`, body);
    }

    delete(body: any): Observable<any> {
        return this.http.post(`${environment.BASE_URL}/post_category/delete`, body);
    }
}
