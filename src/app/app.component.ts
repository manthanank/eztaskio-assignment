import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { DataPost } from './models/data.model';
import { DataService } from './services/data.service';
import { map, Observable, throwError } from 'rxjs';
import { getFirestore, doc, addDoc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  error: any;
  file: any;
  convertToJson: any;
  data = [];
  postedData: any;
  fileName = 'ExcelSheet.xlsx';
  excelData: any;
  header: any;
  columnName = [];
  leadTitle = ["leadTitle"];
  contactName = ["contactName"];
  leadSource = ["leadSource"];
  companyName = ["companyName"];
  product = ["product"];
  countryCode = ["countryCode"];
  email = ["email"];
  assignToTeamName = ['assignToTeamName'];
  assignToUserEmail = ['assignToUserEmail'];
  note = ['note'];
  address = ['address'];
  city = ['city'];
  state = ['state'];
  region = ['region'];
  postalCode = ['postalCode'];
  countryName = ['countryName'];
  Age = ["Age"];
  Salary = ["Salary"];


  fileForm = new FormGroup({
    file: new FormControl('', [Validators.required])
  });
  excelFileForm = new FormGroup({
    excelFile: new FormControl('', [Validators.required])
  });
  excelForm = new FormGroup({
    leadTitle: new FormControl('', [Validators.required]),
    contactName: new FormControl('', [Validators.required]),
    leadSource: new FormControl('', [Validators.required]),
    companyName: new FormControl('', [Validators.required]),
    product: new FormControl('', [Validators.required]),
    countryCode: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    assignToTeamName: new FormControl('', [Validators.required]),
    assignToUserEmail: new FormControl('', [Validators.required]),
    note: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    region: new FormControl('', [Validators.required]),
    postalCode: new FormControl('', [Validators.required]),
    countryName: new FormControl('', [Validators.required]),
    Age: new FormControl('', [Validators.required]),
    Salary: new FormControl('', [Validators.required])
  });

  constructor(private dataService: DataService, private firestore: Firestore, private _snackBar: MatSnackBar) {

  }
  ngOnInit() {
    this.getData();
  }

  getData() {
    this.dataService.getData().pipe(
      map(data => {
        this.postedData = data;
      })
    ).subscribe(data => {
      //this.postedData = data;
      console.log('data', this.postedData);
    },
      err => {
        console.log('error', err);
        this.error = err.error;
      });
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
      });
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
        const header = rowObject.shift();
        // console.log('header', header);
        // this.dataService.postData(header).subscribe(data => {
        //   for (let i = 0; i < rowObject.length; i++) {
        //     this.postedData = data;
        //     console.log('data', this.postedData);
        //   }
        // }, err => {
        //   console.log('error', err);
        //   this.error = err.error;
        // }
        // );
        for (let i = 0; i < rowObject.length; i++) {
          this.dataService.postData(rowObject[i]).subscribe(data => {
            console.log('dataPosted', data);
            this.getData();
          },
            err => {
              console.log('error', err);
            }
          );
        }
      });
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
  updateData(event: any) {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = () => {
      let workbook = XLSX.read(reader.result, { type: 'binary' });
      let sheetName = workbook.SheetNames;
      this.excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName[0]]);
      console.log('data', this.excelData);
    }
  }
}
