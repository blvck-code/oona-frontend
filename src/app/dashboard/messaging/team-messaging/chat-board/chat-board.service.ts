import { Injectable } from '@angular/core';
import { environment as env } from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatBoardService {
  sendStreamMessageWithFileURL = env.sendStreamMessageWithFileURL;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  sendStreamMessageWithFile(message: any): any{
    return this.http.post(
      this.sendStreamMessageWithFileURL,
      message,
      this.authService.getHeaders()
    );
  }
}
