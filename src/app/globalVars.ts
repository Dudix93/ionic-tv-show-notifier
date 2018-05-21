import {Injectable} from '@angular/core';

@Injectable()
export class GlobalVars {
  token:any;
  sound:boolean
  vibrate:boolean

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
getSound() {
  return this.sound;
}

setSound(value) {
  this.sound = value;
}
//-----------------------------------------------------------
getVibrate() {
  return this.vibrate;
}

setVibrate(value) {
  this.vibrate = value;
}
//-----------------------------------------------------------
}