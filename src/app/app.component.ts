import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { SignupPage } from '../pages/signup/signup';
import { LoginPage } from '../pages/login/login';
import { CurrentWorkoutPage } from '../pages/currentWorkout/currentWorkout';
import { NewWorkoutsPage } from '../pages/newWorkouts/newWorkouts';
import { PastWorkoutsPage } from '../pages/pastWorkouts/pastWorkouts';
import { OldWorkoutPage } from '../pages/oldWorkout/oldWorkout';
import { SquatModePage } from '../pages/squatMode/squatMode';
import { ScanPage } from '../pages/scan/scan';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Signup', component: SignupPage },
      { title: 'Login', component: LoginPage },
      { title: 'Scan', component: ScanPage },
      { title: 'CurrentWorkout', component: CurrentWorkoutPage },
      { title: 'NewWorkouts', component: NewWorkoutsPage },
      { title: 'PastWorkouts', component: PastWorkoutsPage },
      { title: 'OldWorkout', component: OldWorkoutPage },
      { title: 'SquatMode', component: SquatModePage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  openSquatMode(){
     this.nav.push(SquatModePage);
  }

  openNewWorkouts(){
     this.nav.push(NewWorkoutsPage);
  }

  openPastWorkouts(){
     this.nav.push(PastWorkoutsPage);
  }

  openCurrentWorkout(){
     this.nav.setRoot(CurrentWorkoutPage);
  }

  appLogout(){
     this.nav.setRoot(LoginPage);
  }

}
