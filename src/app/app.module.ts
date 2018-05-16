import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, Content } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { RestapiServiceProvider } from '../providers/restapi-service/restapi-service'
import { HttpModule } from '@angular/http';
import { GlobalVars } from '../app/globalVars';
import { DatePicker } from '@ionic-native/date-picker';
import { RlTagInputModule } from 'angular2-tag-input';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { BrowsePage } from '../pages/browse/browse';
import { WatchingPage } from '../pages/watching/watching';
import { InfoPage } from '../pages/info/info';
import { IonicStorageModule } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications'
import { PhonegapLocalNotification } from '@ionic-native/phonegap-local-notification'
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { FIREBASE_CONFIG } from './firebase.credentials';
import { UserService } from '../providers/user-service/user-service';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'animunotifier'
  },
  'push': {
    'sender_id': '160370676742',
    'pluginConfig': {
      'ios': {
        'badge': true,
        'sound': true
      },
      'android': {
        'iconColor': '#343434'
      }
    }
  }
};

@NgModule({
  declarations: [
    MyApp,
    BrowsePage,
    WatchingPage,
    InfoPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicStorageModule.forRoot(),
    RlTagInputModule,
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    BrowsePage,
    WatchingPage,
    InfoPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    RestapiServiceProvider,
    GlobalVars,
    DatePicker,
    LocalNotifications,
    PhonegapLocalNotification,
    Content,
    UserService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
