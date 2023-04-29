import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FileService {

    constructor(private http: HttpClient) { }

    upload(file: File): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('file', file);
        return this.http.post(`${environment.BASE_URL}/file/upload`, formData);
    }
}
