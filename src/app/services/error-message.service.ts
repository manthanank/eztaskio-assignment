import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessageService {

  constructor() { }
  errorMessage = {
    NOTMATCH: 'Columns does not match with the data',
    NOTFOUND: 'Columns not found',
  }
}
