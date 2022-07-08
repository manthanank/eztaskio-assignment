import { ErrorHandler, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {

  constructor() { }
  handleError(error: any) {
    console.log(error.messsage);
    try {
      throw error;
    }
    catch (e) {
      console.log(e);
    }
  }
}
