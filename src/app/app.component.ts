import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { DataPost } from './models/data.model';
import { DataService } from './services/data.service';
import { from, map, Observable, throwError } from 'rxjs';
import { getFirestore, doc, addDoc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

export interface Lead {
  leadId: string;
  leadTitle: string;
  actualLeadTitle: string;
  leadSource: string;
  currentLeadStage: string;
  contactName: string;
  contactId: string;
  companyName: string;
  contactPhone: string;
  contactEmail: string;
  companyId: string;
  owner: string;
  ownerId: string;
}

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
  sheet: any;
  sheetData: any;
  tabKey: any;
  tabValues: any;
  sheetDatas: any;
  sheetValues: any;
  sheetKey: any;

  selectFileForm = new FormGroup({
    selectfile: new FormControl('', Validators.required)
  });
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
    this.getRowData();
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
    this.dataService.getfromFirestore().pipe(
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
    console.log('files selected', this.file);
  }
  exportexcel() {
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }
  datasheet: any;
  updateData(event: any) {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = () => {
      let workbook = XLSX.read(reader.result, { type: 'binary' });
      let sheetName = workbook.SheetNames;
      this.excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName[0]]);
      console.log('data', Object(this.excelData));
      for (let i = 0; i < this.excelData.length; i++) {
        const sheet = Object.assign({}, this.excelData[i]);
        console.log('sheet', sheet);
        this.sheet = Object.keys(sheet);
        console.log('sheet', this.sheet);
        this.sheetData = Object.values(sheet);
        for (let j = 0; j <= this.sheet.length; j++) {
          this.excelForm.get('leadTitle').setValue(this.sheetData[0]);
          this.excelForm.get('contactName').setValue(this.sheetData[1]);
          this.excelForm.get('leadSource').setValue(this.sheetData[2]);
          this.excelForm.get('companyName').setValue(this.sheetData[3]);
          this.excelForm.get('product').setValue(this.sheetData[4]);
          this.excelForm.get('countryCode').setValue(this.sheetData[5]);
          this.excelForm.get('email').setValue(this.sheetData[6]);
          this.excelForm.get('assignToTeamName').setValue(this.sheetData[7]);
          this.excelForm.get('assignToUserEmail').setValue(this.sheetData[8]);
          this.excelForm.get('note').setValue(this.sheetData[9]);
          this.excelForm.get('address').setValue(this.sheetData[10]);
          this.excelForm.get('city').setValue(this.sheetData[11]);
          this.excelForm.get('state').setValue(this.sheetData[12]);
          this.excelForm.get('region').setValue(this.sheetData[13]);
          this.excelForm.get('postalCode').setValue(this.sheetData[14]);
          this.excelForm.get('countryName').setValue(this.sheetData[15]);
          this.excelForm.get('Age').setValue(this.sheetData[16]);
          this.excelForm.get('Salary').setValue(this.sheetData[17]);
        }
        // this.dataService.postData(this.excelForm.value).subscribe(data => {
        //   console.log('dataPosted', data);
        //   this.getData();
        // }
        // );
        this.dataService.posttoFirestore(this.excelForm.value).subscribe(data => {
          console.log('dataPosted', data);
          this.getData();
        }
        );
        // let lead: Lead = {
        //   leadId: this.excelForm.value.contactName,
        //   leadTitle: this.excelForm.value.contactName,
        //   actualLeadTitle: this.excelForm.value.leadSource,
        //   leadSource: this.excelForm.value.companyName,
        //   currentLeadStage: this.excelForm.value.product,
        //   contactName: this.excelForm.value.countryCode,
        //   contactId: this.excelForm.value.assignToTeamName,
        //   companyName: this.excelForm.value.assignToUserEmail,
        //   contactPhone: this.excelForm.value.address,
        //   contactEmail: this.excelForm.value.email,
        //   companyId: this.excelForm.value.state,
        //   owner: this.excelForm.value.postalCode,
        //   ownerId: this.excelForm.value.Salary,
        // }
        // console.log('lead', lead);
        // this.dataService.postData(lead).subscribe(data => {
        //   console.log('data', data);
        // });
      }
      this.excelFileForm.reset();
    }
  }
  updateExcel() {
    console.log(this.excelForm.value);
  }
  tabkey: any;
  tabValue: any;
  getRowData() {
    this.dataService.getData().subscribe(data => {
      data.forEach(element => {
        console.log('element', element);
        this.tabkey = Object.keys(element);
        console.log('tabkey', this.tabkey);
      });
    });
  }
  selectFileData(event: any) {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = () => {
      let workbook = XLSX.read(reader.result, { type: 'binary' });
      let sheetName = workbook.SheetNames;
      this.excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName[0]]);
      console.log('data', Object(this.excelData));
      for (let i = 0; i < this.excelData.length; i++) {
        const sheetDatas = Object.assign({}, this.excelData[i]);
        console.log('sheetData', sheetDatas);
        this.sheetKey = Object.keys(sheetDatas);
        console.log('sheetKey', this.sheetKey);
      }
      this.excelFileForm.reset();
    }
  }
}
