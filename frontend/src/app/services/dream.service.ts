import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DreamService {
  private env: string;

  constructor(private _http: HttpClient) {
    this.env = environment.APP_URL;
  }

  saveDream(dream: any) {
    return this._http.post<any>(this.env + 'dream/saveDream', dream);
  }

  saveDreamImg(dream: any) {
    return this._http.post<any>(this.env + 'dream/saveDreamImg', dream);
  }

  listDream() {
    return this._http.get<any>(this.env + 'dream/listDream');
  }

  updateDream(dream: any) {
    return this._http.put<any>(this.env + 'dream/updateDream', dream);
  }

  deleteDream(dream: any) {
    return this._http.delete<any>(this.env + 'dream/deleteDream/' + dream._id);
  }
}
