import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { DataPost } from './models/data';
import { DataService } from './services/data.service';
import { Observable } from 'rxjs';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { Data } from './data';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  file: any;
  convertToJson: any;
  fileForm = new FormGroup({
    file: new FormControl('', [Validators.required])
  });
  constructor(private dataService: DataService) { }
  ngOnInit() {

  }
  uploadFile() {
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(this.file);
    fileReader.onload = () => {
      let binaryString = fileReader.result;
      let workbook = XLSX.read(binaryString, { type: 'binary' });
      workbook.SheetNames.forEach((sheetName) => {
        let rowObject = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        console.log(rowObject);
        this.convertToJson = JSON.stringify(rowObject, undefined, 4);
      }
      );
      console.log(workbook);
    }

  }
  selectFile(event: any) {
    this.file = event.target.files[0];
    console.log(this.file);
  }
}
