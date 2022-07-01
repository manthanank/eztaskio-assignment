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
  getData() {
    return this.http.get('http://localhost:8080/api/filedatas')
  }
  postData(data: any) {
    return this.http.post('http://localhost:8080/api/filedata', data)
  }
}
