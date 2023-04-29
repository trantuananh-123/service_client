import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TokenStorageService {

    TOKEN_KEY = environment.STORAGE.TOKEN_KEY;

    constructor() { }

    saveToken(token: string, isRemmeber: any) {
        if (isRemmeber) {
            window.localStorage.removeItem(this.TOKEN_KEY);
            window.localStorage.setItem(this.TOKEN_KEY, token);
        }
        else {
            window.sessionStorage.removeItem(this.TOKEN_KEY);
            window.sessionStorage.setItem(this.TOKEN_KEY, token);
        }
    }

    getToken() {
        return window.sessionStorage.getItem(this.TOKEN_KEY) != null ? window.sessionStorage.getItem(this.TOKEN_KEY) : window.localStorage.getItem(this.TOKEN_KEY);
    }

}
