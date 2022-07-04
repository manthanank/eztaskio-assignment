import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { DataPost } from './models/data.model';
import { DataService } from './services/data.service';
import { Observable } from 'rxjs';
import { getFirestore, doc, addDoc, setDoc, getDoc } from 'firebase/firestore';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Data } from './data';
interface Item {
  name: string
};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  file: any;
  convertToJson: any;
  item$: any = Observable<Item[]>;
  data = [];
  postedData: any;
  fileName = 'ExcelSheet.xlsx';

  fileForm = new FormGroup({
    file: new FormControl('', [Validators.required])
  });
  excelForm = new FormGroup({
    excel: new FormControl('', [Validators.required])
  });
  constructor(private dataService: DataService, private firestore: Firestore) {

  }
  ngOnInit() {
    this.dataService.getData().subscribe(data => {
      console.log("getData", data);
      this.postedData = data;
    });
    //this.getData();
  }
  // async getData() {
  //   const docRef = collection(this.firestore, 'cities');
  //   const data = await collectionData(docRef);
  //   console.log("data", data);
  // }
  uploadFile() {
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(this.file);
    fileReader.onload = () => {
      let binaryString = fileReader.result;
      let strings = XLSX.read(binaryString, { type: 'binary' });
      strings.SheetNames.forEach(async (sheetName) => {
        let rowObject = XLSX.utils.sheet_to_json(strings.Sheets[sheetName]);
        console.log('string', rowObject);
        // this.dataService.postData(Object.assign({}, JSON.parse(JSON.stringify(rowObject)))).subscribe(data => {
        //   console.log("final data received", data);
        // })
        this.convertToJson = JSON.stringify(rowObject, undefined, 4);
        console.log('string obtained', JSON.stringify(JSON.parse(this.convertToJson.toString())));
        // this.dataService.postData(Object.assign({}, (JSON.parse(this.convertToJson)))).subscribe(data => {
        //   console.log("final data received", data);
        // })
        // this.dataService.postData(Object.assign({}, JSON.stringify(JSON.parse(this.convertToJson.toString())))).subscribe(data => {
        //   console.log("final data received", data);
        // })
        const result = await addDoc(collection(this.firestore, "data"), {
          id: JSON.stringify(JSON.parse(this.convertToJson.toString()))
        });
        console.log("result", this.data);

        // Add a new document with a generated id
        const newCityRef = doc(collection(this.firestore, "cities"));

        // later...
        await setDoc(newCityRef, Object.assign({}, (JSON.parse(this.convertToJson.toString()))));
      }
      );
      console.log('string', strings);
    }
  }
  selectFile(event: any) {
    this.file = event.target.files[0];
    console.log(this.file);
  }
  onFileSubmit(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = async (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      console.log('string', ws);
      this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));
      Object.assign(this.data, JSON.parse(JSON.stringify(this.data)));
      console.log('string', this.data);
      const newCityRef = doc(collection(this.firestore, "cities"));

      // later...
      await setDoc(newCityRef, Object.assign({}, Object.assign({}, this.data)));
    }
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
}
