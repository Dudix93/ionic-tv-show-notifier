import {Injectable} from '@angular/core';

@Injectable()
export class GlobalVars {
  token:any;


  constructor() {
  }

//-----------------------------------------------------------
  getToken() {
    return this.token;
  }

  setToken(value) {
    this.token = value;
  }
//-----------------------------------------------------------
}