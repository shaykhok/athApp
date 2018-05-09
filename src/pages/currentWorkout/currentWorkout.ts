import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Data } from '../../providers/data/data';
import { Events } from 'ionic-angular';
import { NgZone } from '@angular/core';
import { Platform } from 'ionic-angular';

import { Http } from '@angular/http';

@Component({
  selector: 'page-currentWorkout',
  templateUrl: 'currentWorkout.html'
})
export class CurrentWorkoutPage {

  currentWorkout = {};
  objectKeys = Object.keys;

noteData:any = [];
data:any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: Data, public events: Events, private zone: NgZone, public platform: Platform, public http: Http ) {

this.data.response = '';
this.http = http;


//notes... not sure how I'm planning on updating the notes yet though. perhaps put this function in to updateinfo and update the notes
// each time reps are sent to database?
     this.dataService.getUserID().then((userID) => {
     this.dataService.getWorkoutID().then((workoutID) => {
console.log(userID);
console.log(workoutID);
//        var link = 'http://localhost:80/api.php';
var link = 'http://cgi.soic.indiana.edu/~shaykhok/api.php';
        var myData = JSON.stringify({action: "athleteWorkoutNotes", username: userID, workoutid: workoutID});
        this.http.post(link, myData).subscribe(data => {
           this.data.response = data["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response
console.log("response: ");
           console.log(this.data.response);
           console.log(JSON.parse(this.data.response));
           this.noteData = JSON.parse(this.data.response);
           console.log(this.noteData[0]);
           }, error => {
              console.log("Oooops!");
        });
     });
     });
     

     this.zone = new NgZone({ enableLongStackTrace: false });

//     this.currentWorkout = {workoutTitle: "Squat Workout", instructorID: "Instructor 1", workoutData: [{set:[{rep: "2"}, {rep: "2"}, {rep: "1"}, {rep: "2"}, {rep: "2"}, {rep: "2"}, {rep: "1"}, {rep: "2"}, {rep: "1"}, {rep: "2"}]},
//				{set:[{rep: "2"}, {rep: "2"}, {rep: "1"}, {rep: "1"}, {rep: "1"}, {rep: "2"}, {rep: "2"}, {rep: "1"}, {rep: "2"}, {rep: "2"}]},
//				{set:[{rep: "2"}, {rep: "1"}, {rep: "2"}, {rep: "1"}, {rep: "2"}, {rep: "2"}, {rep: "1"}, {rep: "0"}, {rep: "0"}, {rep: "0"}]}
//				]};
  }

  ionViewDidLoad() {
     this.platform.ready().then(() => {
        this.updateInfo();
        console.log("view loaded");
        this.updateUI();
     });
  }

/*  change(){
     this.dataService.saveSetOfFivesOne("10211");
     console.log("saved");
     this.dataService.getSetOfFivesOne().then((data) => {
        console.log("print");
        console.log(data);
     });
  }*/

   updateUI(){
     this.events.subscribe('repReceived:event', (string) => {
        console.log("Event received");
        this.zone.run(() => {
           console.log("Zone: event received");
           this.updateInfo();
        });
     });
   }

   updateInfo(){
     this.dataService.getWorkoutTitle().then((title) => {
     this.dataService.getInstructorID().then((instid) => {
//     this.dataService.getRepsAssigned().then((reps) => {
this.dataService.getWorkoutRepsPerSet().then((reps) => {
     this.dataService.getSetsAssigned().then((sets) => {
     this.dataService.getSetOfFivesOne().then((setOfFivesOne) => {
     this.dataService.getSetOfFivesTwo().then((setOfFivesTwo) => {
     this.dataService.getSetOfFivesThree().then((setOfFivesThree) => {
     this.dataService.getSetOfFivesFour().then((setOfFivesFour) => {
     this.dataService.getSetOfFivesFive().then((setOfFivesFive) => {
     this.dataService.getSetOfFivesSix().then((setOfFivesSix) => {
     this.dataService.getSetOfFivesSeven().then((setOfFivesSeven) => {
     this.dataService.getSetOfFivesEight().then((setOfFivesEight) => {
     this.dataService.getSetOfFivesNine().then((setOfFivesNine) => {
     this.dataService.getSetOfFivesTen().then((setOfFivesTen) => {
     this.dataService.getSetOfFivesEleven().then((setOfFivesEleven) => {
     this.dataService.getSetOfFivesTwelve().then((setOfFivesTwelve) => {
     this.dataService.getSetOfFivesThirteen().then((setOfFivesThirteen) => {
     this.dataService.getSetOfFivesFourteen().then((setOfFivesFourteen) => {
     this.dataService.getSetOfFivesFifteen().then((setOfFivesFifteen) => {
     this.dataService.getSetOfFivesSixteen().then((setOfFivesSixteen) => {
     this.dataService.getSetOfFivesSeventeen().then((setOfFivesSeventeen) => {
     this.dataService.getSetOfFivesEighteen().then((setOfFivesEighteen) => {
     this.dataService.getSetOfFivesNineteen().then((setOfFivesNineteen) => {
     this.dataService.getSetOfFivesTwenty().then((setOfFivesTwenty) => {

        console.log("working on workout");

        var fullWorkout = "" + setOfFivesOne + setOfFivesTwo + setOfFivesThree + setOfFivesFour + setOfFivesFive + setOfFivesSix + setOfFivesSeven + setOfFivesEight + setOfFivesNine + setOfFivesTen + setOfFivesEleven + setOfFivesTwelve + setOfFivesThirteen + setOfFivesFourteen + setOfFivesFifteen + setOfFivesSixteen + setOfFivesSeventeen + setOfFivesEighteen + setOfFivesNineteen + setOfFivesTwenty;
console.log("Full Workout: " + fullWorkout);
        var workoutData = [];
        var i, j;
        for(i = 0; i != sets; ++i){
           var set = [];
           for(j = 0; j != reps; ++j){
              var totalRep = (i * reps) + j;
//              console.log(totalRep); 		
              var repVal = fullWorkout.charAt(totalRep);
              set.push({rep: repVal});
           }
           workoutData.push({set: set});
        }
//commented for change to instructorID
//        this.currentWorkout = {workoutTitle: title, instructorID: instid, workoutData: workoutData};
this.currentWorkout = {workoutTitle: title, username: instid, workoutData: workoutData};
        console.log(this.currentWorkout);

     });
     });
     });
     });
     });
     });
     });
     });
     });
     });
     });
     });
     });
     });
     });
     });
     });
     });
     });
     });
     });
     });   
     });
     });
   }

}
