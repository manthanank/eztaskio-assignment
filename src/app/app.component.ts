import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

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
  constructor(

  ) { }
  uploadFile() {
    console.log('submit');
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
