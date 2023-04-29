import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PostService {

    constructor(private http: HttpClient) { }

    getAll(): Observable<any> {
        return this.http.get(`${environment.BASE_URL}/post/get-all`);
    }

    getTop4ByRate(): Observable<any> {
        return this.http.get(`${environment.BASE_URL}/post/get-by-rate`);
    }

    getAllByUserId(body: any): Observable<any> {
        return this.http.post(`${environment.BASE_URL}/post/get-all-by-user-id`, body);
    }

    getById(id: any): Observable<any> {
        return this.http.get(`${environment.BASE_URL}/post/${id}`);
    }

    save(body: any): Observable<any> {
        return this.http.post(`${environment.BASE_URL}/post/save`, body);
    }

    delete(body: any): Observable<any> {
        return this.http.post(`${environment.BASE_URL}/post/delete`, body);
    }

    search(body: any): Observable<any> {
        return this.http.post(`${environment.BASE_URL}/post/search`, body);
    }
}
