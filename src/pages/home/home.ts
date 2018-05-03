import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RestapiServiceProvider } from '../../providers/restapi-service/restapi-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  animu:any;

  constructor(
    public navCtrl: NavController,
    public restApi: RestapiServiceProvider) {

      this.restApi.getUsers().then(data=>{
        this.animu = data;
        console.log(this.animu);
        // this.animu.data.forEach(element => {
        //   console.log(element.attributes.canonicalTitle);
        // });
      });
  }

}
