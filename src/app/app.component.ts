import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { DataPost } from './models/data.model';
import { DataService } from './services/data.service';
import { map, Observable, throwError } from 'rxjs';
import { getFirestore, doc, addDoc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ErrorMessageService } from './services/error-message.service';
import { HttpErrorResponse } from '@angular/common/http';
interface Item {
  name: string
};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  error: any;
  errMsgs = this.errorMessages.errorMessage;
  file: any;
  convertToJson: any;
  item$: any = Observable<Item[]>;
  data = [];
  postedData: any;
  postDatas: any;
  fileName = 'ExcelSheet.xlsx';
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  fileForm = new FormGroup({
    file: new FormControl('', [Validators.required])
  });
  excelForm = new FormGroup({
    excel: new FormControl('', [Validators.required])
  });

  constructor(private dataService: DataService, private firestore: Firestore, private _snackBar: MatSnackBar, private errorMessages: ErrorMessageService) {

  }
  ngOnInit() {
    this.dataService.getData().pipe(
      map(data => {
        this.postedData = data;
      })
    ).subscribe(data => {
      //this.postedData = data;
      console.log('data', this.postedData);
    }, err => {
      console.log('error', err);
      this.error = err.error;
    }
    );
  }

  uploadFile() {
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(this.file);
    fileReader.onload = () => {
      let binaryString = fileReader.result;
      let docs = XLSX.read(binaryString, { type: 'binary' });
      docs.SheetNames.forEach(async (sheetName) => {
        let rowObject = XLSX.utils.sheet_to_json(docs.Sheets[sheetName]);
        console.log('rowObject', rowObject);
        for (let i = 0; i < rowObject.length; i++) {
          const newCityRef = doc(collection(this.firestore, "data"));
          await setDoc(newCityRef, (Object.assign({}, (rowObject[i]))));
          console.log('data changed', rowObject[i]);
        }
      }
      );
      console.log('string', docs);
    }
  }

  uploadFileData() {
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(this.file);
    fileReader.onload = () => {
      let binaryString = fileReader.result;
      let docs = XLSX.read(binaryString, { type: 'binary' });
      docs.SheetNames.forEach(async (sheetName) => {
        let rowObject = XLSX.utils.sheet_to_json(docs.Sheets[sheetName]);
        console.log('rowObject', rowObject);
        let data = Object.assign({}, (rowObject));
        console.log('data', data);
        for (let i = 0; i < rowObject.length; i++) {
          this.dataService.postData(rowObject[i]).subscribe(data => {
            console.log('data', data);
            this.postDatas = data;
          },
            err => {
              console.log('error', err);
              this.error = this.errMsgs['NOTMATCH'];
            }
          );
        }
      }
      );
      console.log('string', docs);
    }
  }
  selectFile(event: any) {
    this.file = event.target.files[0];
    console.log(this.file);
  }
  // onFileSubmit(event: any) {
  //   const target: DataTransfer = <DataTransfer>(event.target);
  //   if (target.files.length !== 1) {
  //     throw new Error('Cannot use multiple files');
  //   }
  //   const reader: FileReader = new FileReader();
  //   reader.readAsBinaryString(target.files[0]);
  //   reader.onload = async (e: any) => {
  //     const bstr: string = e.target.result;
  //     const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
  //     const wsname: string = wb.SheetNames[0];
  //     const ws: XLSX.WorkSheet = wb.Sheets[wsname];
  //     console.log('string', ws);
  //     this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));
  //     let dataObtained = JSON.stringify(this.data.toString());
  //     console.log('dataObtained', dataObtained);
  //     console.log('data obtained', Object.assign({}, this.data));
  //     for (let i = 0; i < this.data.length; i++) {
  //       const newCityRef = doc(collection(this.firestore, "data"));
  //       await setDoc(newCityRef, (Object.assign({}, (this.data[i]))));
  //       console.log('data changed', this.data[i]);
  //     }
  //   }
  // }
  exportexcel() {
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }

  openSnackBar() {
    this._snackBar.open('Cannonball!!', '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 1000
    });
  }
}
