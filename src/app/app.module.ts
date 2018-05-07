import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { RestapiServiceProvider } from '../providers/restapi-service/restapi-service'
import { HttpModule } from '@angular/http';
import { GlobalVars } from '../app/globalVars';
import { DatePicker } from '@ionic-native/date-picker';

import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { BrowsePage } from '../pages/browse/browse';
import { WatchingPage } from '../pages/watching/watching';
import { InfoPage } from '../pages/info/info';
import { IonicStorageModule } from '@ionic/storage';

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
    IonicModule.forRoot(MyApp)
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
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
