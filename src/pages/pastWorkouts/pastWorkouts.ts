import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { OldWorkoutPage } from '../oldWorkout/oldWorkout';

import { Http } from '@angular/http';
import { Data } from '../../providers/data/data';

@Component({
  selector: 'page-pastWorkouts',
  templateUrl: 'pastWorkouts.html'
})
export class PastWorkoutsPage {

  pastWorkouts: any = [];
  itemExpandHeight: number = 1000;

  objectKeys = Object.keys;

data:any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: Data, public http: Http) {


     this.dataService.getUserID().then((userID) => {
        this.dataService.getWorkoutID().then((workoutID) => {
//           var link = 'http://localhost:80/api.php';
           var link = 'http://cgi.soic.indiana.edu/~shaykhok/api.php';
           var myData = JSON.stringify({action: "athletePastWorkouts", username: userID, workoutid: workoutID});
           this.http.post(link, myData).subscribe(data => {
              this.data.response = data["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response
              console.log(this.data.response);
              console.log(JSON.parse(this.data.response));
              this.pastWorkouts = JSON.parse(this.data.response);
              }, error => {
              console.log("Oooops!");
           });
        });
     });

//     this.pastWorkouts = [{expanded: false, workoutTitle: "Workout Title", workoutId: 1, instructorID: "instid", date: "8/13/2017", sets: 2, reps: 2,
  //                         workoutData: [{set: [{rep: "2"}, {rep: "1"}]}, {set: [{rep: "2"}, {rep: "0"}]}]
    //                       },
      //                    {expanded: false, workoutTitle: "Workout Title 2", workoutId: 2, instructorID: "instid 2", date: "8/13/2017", sets: 3, reps: 8,
        //                   workoutData: [{set: [{rep: "2"}, {rep: "1"}, {rep: "1"}, {rep: "1"}, {rep: "1"}, {rep: "1"}, {rep: "1"}, {rep: "1"}]},  
          //                               {set: [{rep: "2"}, {rep: "0"}, {rep: "0"}, {rep: "0"}, {rep: "0"}, {rep: "0"}, {rep: "0"}, {rep: "0"}]},
            //                             {set: [{rep: "0"}, {rep: "0"}, {rep: "0"}, {rep: "0"}, {rep: "0"}, {rep: "0"}, {rep: "0"}, {rep: "0"}, {rep: "0"}, {rep: "0"}, {rep: "0"}]}]
              //             }]; 

      this.data.response = '';
      this.http = http;


  }

  expandPastWorkout(pastWorkout){
     pastWorkout.expanded = !pastWorkout.expanded;
  }

  pastWorkoutTapped(event, pastWorkout) {
    this.navCtrl.push(OldWorkoutPage, {
      oldWorkout: pastWorkout,
    });
  }

}
