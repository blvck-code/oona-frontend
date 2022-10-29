import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { environment as env } from '../../../environments/environment';
import {HotToastService} from '@ngneat/hot-toast';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  getUsersUrl: string = env.presentUsers;

  constructor(
    private http: HttpClient,
    private toast: HotToastService
  ) { }


  getUsers(): Observable<any>{
    console.log('URL ===>>>>', this.getUsersUrl);
    // @ts-ignore
    return this.http.get(this.getUserUrl);
  }

  showNotification(message: string, type: string): void {
    if (type === 'success') {
      this.toast.success(message);
    } else if (type === 'warning') {
      this.toast.warning(message);
    } else if (type === 'error') {
      this.toast.error(message);
    } else if (type === 'loading') {
      this.toast.loading(message);
    } else if(type === 'show') {
      this.toast.show(message);
    } else {
      this.toast.info(message);
    }
  }
}
