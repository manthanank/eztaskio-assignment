import { Injectable } from '@angular/core';
import { collection, addDoc } from "firebase/firestore";
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private http: HttpClient
  ) { }
  postData(data: any) {
    return this.http.post('https://angular-firestore-3ed06-default-rtdb.firebaseio.com', data);
  }

}
