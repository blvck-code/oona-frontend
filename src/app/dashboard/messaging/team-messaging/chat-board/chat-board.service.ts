import { Injectable } from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatBoardService {
  sendStreamMessageWithFileURL = environment.oona + '/api/v1/message/stream/file';

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
