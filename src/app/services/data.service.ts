import { Injectable } from '@angular/core';
import { collection, addDoc } from "firebase/firestore";
import { HttpClient, HttpParams } from '@angular/common/http';
import { DataPost } from '../models/data';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private geturl = 'http://localhost:8080/api/filedatas';
  private posturl = 'http://localhost:8080/api/filedata';
  constructor(
    private http: HttpClient
  ) { }
  getData() {
    return this.http.get<DataPost[]>(this.geturl);
  }
  postData(data: any) {
    return this.http.post(this.posturl, data)
  }
}
