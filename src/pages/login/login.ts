import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

users:Array<any>
username:string = ''
password:string = ''

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public db: AngularFireDatabase) {
      this.db.database.ref('users').once('value').then(snapshot=>{
        this.users = snapshot;
      });
  }

  login(){
    let valid = false;
    this.users.forEach(user=>{
      console.log(user.val());
    });
  }
}
