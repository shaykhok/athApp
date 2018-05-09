import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { CurrentWorkoutPage } from '../pages/currentWorkout/currentWorkout';
import { NewWorkoutsPage } from '../pages/newWorkouts/newWorkouts';
import { PastWorkoutsPage } from '../pages/pastWorkouts/pastWorkouts';
import { OldWorkoutPage } from '../pages/oldWorkout/oldWorkout';
import { SquatModePage } from '../pages/squatMode/squatMode';
import { ScanPage } from '../pages/scan/scan';

import { IonicStorageModule } from '@ionic/storage';
import { ExpandableComponent } from '../components/expandable/expandable';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Data } from '../providers/data/data';

import { BLE } from '@ionic-native/ble';

import { HttpModule } from '@angular/http';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    CurrentWorkoutPage,
    NewWorkoutsPage,
    PastWorkoutsPage,
    OldWorkoutPage,
    SquatModePage,
    ScanPage,
    ExpandableComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    CurrentWorkoutPage,
    NewWorkoutsPage,
    PastWorkoutsPage,
    OldWorkoutPage,
    SquatModePage,
    ScanPage,
    SignupPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Data,
    BLE
  ]
})
export class AppModule {}
