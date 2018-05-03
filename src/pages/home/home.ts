import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RestapiServiceProvider } from '../../providers/restapi-service/restapi-service';
import { Storage } from '@ionic/storage';
import { GlobalVars } from '../../app/globalVars';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  animu:any;
  response:any;

  // client_credentials:number = 403;
  // client_secret:string = 'gf66CF5kVIEhbyr5yKnweAVDxKxIZUmhuDQg8tTO';

  client_credentials:string = 'animunotifier-j0ybs';
  client_secret:string = 'UqdeljBAhwnTPoT5TPV';

  constructor(
    public navCtrl: NavController,
    public restApi: RestapiServiceProvider,
    public storage: Storage,
    public globalVars: GlobalVars) {

      this.restApi.authorize({grant_type:"client_credentials",client_id:this.client_credentials,client_secret:this.client_secret}).then(data=>{
        this.response = data;
        console.log("token: "+this.response.json().access_token);
        this.globalVars.setToken(this.response.json().access_token);
        this.getAnimes();
      });
  }

  getAnimes(){
    this.restApi.getUsers().then(data=>{
      this.animu = data;
      console.log(this.animu);
      // this.animu.data.forEach(element => {
      //   console.log(element.attributes.canonicalTitle);
      // });
    });
  }

}
