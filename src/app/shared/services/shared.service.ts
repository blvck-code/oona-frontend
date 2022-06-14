import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { environment as env } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  getUsersUrl: string = env.presentUsers;

  constructor(
    private http: HttpClient
  ) { }


  getUsers(): Observable<any>{
    console.log('URL ===>>>>', this.getUsersUrl);
    // @ts-ignore
    return this.http.get(this.getUserUrl);
  }
}
