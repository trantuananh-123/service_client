import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {

  USER_KEY = environment.STORAGE.USER_KEY;
  constructor(
    private globalService: GlobalService
  ) { }

  saveUserStorage(user: any, isRemmeber: any) {
    if (isRemmeber) {
      window.localStorage.removeItem(this.USER_KEY);
      window.localStorage.setItem(this.USER_KEY, user);
    } else {
      window.sessionStorage.removeItem(this.USER_KEY);
      window.sessionStorage.setItem(this.USER_KEY, user);
    }
  }

  getUser(): string | null {
    const user = window.sessionStorage.getItem(this.USER_KEY) != null ? window.sessionStorage.getItem(this.USER_KEY) : window.localStorage.getItem(this.USER_KEY);
    return user;
  }

  logOut(): void {
    this.globalService.setUsername('');
    this.globalService.setAvatar('');
    this.globalService.setIsAdmin(false);
    window.sessionStorage.clear();
    window.localStorage.clear();
  }
}
