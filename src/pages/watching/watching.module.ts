import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WatchingPage } from './watching';

@NgModule({
  declarations: [
    WatchingPage,
  ],
  imports: [
    IonicPageModule.forChild(WatchingPage),
  ],
})
export class WatchingPageModule {}
