import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { CurrentWorkoutPage } from '../currentWorkout/currentWorkout';
import { Data } from '../../providers/data/data';
import { BLE } from '@ionic-native/ble';

import { Http } from '@angular/http';

@Component({
  selector: 'page-newWorkouts',
  templateUrl: 'newWorkouts.html'
})
export class NewWorkoutsPage {

  athleteAssignedWorkouts: any = [];
  objectKeys = Object.keys;

  bluefruit = {
      serviceUUID: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
      txCharacteristic: '6e400002-b5a3-f393-e0a9-e50e24dcca9e', // transmit is from the phone's perspective
      rxCharacteristic: '6e400003-b5a3-f393-e0a9-e50e24dcca9e'  // receive is from the phone's perspective
  };

  data:any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public dataService: Data, private ble: BLE, public http: Http) {
     this.data.response = '';
     this.http = http;

     this.dataService.getUserID().then((userID) => {
         // var link = 'http://localhost:80/api.php';
         var link = 'http://cgi.soic.indiana.edu/~shaykhok/api.php';
         var myData = JSON.stringify({action: "athleteAssignedWorkouts", username: userID});

         this.http.post(link, myData).subscribe(data => {
             this.data.response = data["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response
             this.athleteAssignedWorkouts = JSON.parse(this.data.response);
             }, error => {
             console.log("Oooops!");
         });
     });

//     this.athleteAssignedWorkouts = [                                                          
  //          {workoutid: 1, instructorname: "Instructor 1", title: "Workout Title 1", datecreated: "8/13/2017", sets: 2, reps: 6},
    //        {workoutid: 2, instructorname: "Instructor 2", title: "Workout Title 2", datecreated: "8/15/2017", sets: 3, reps: 8}
    // ];
  }

  
  startWorkout(workout){ //connect to arduino to tell it to reset 
     console.log(workout.workoutid);
     let prompt = this.alertCtrl.create({
         title: 'Starting a new workout will end your last workout. Are you sure you want to continue?',
         buttons: [
             {
                 text: 'Cancel'
             },
             {
                 text: 'Start Workout',
                 handler: data => {
                     var repsToAssign = (workout.sets * workout.reps);
                     
                     //get untrimmed workout string 
                     var workoutStringToSendUntrimmed = '0000' + repsToAssign;
                     console.log("Untrimmed: " + workoutStringToSendUntrimmed);
                     //get last four characters from untrimmed string (0 + reps to assign with preceding 0s). Ex. 0030. The first 0 means a new workout is being assigned. The 030 means there are 30 reps in the workout
                     var workoutStringToSend = workoutStringToSendUntrimmed.substr(workoutStringToSendUntrimmed.length - 4);
                     console.log("Sending Trimmed " + workoutStringToSend);

                     //send workout assignment to arduino via BLE
                     var assignmentToSend = this.stringToBytes(workoutStringToSend);
                     this.dataService.getDevice().then((device) => {
                        this.ble.write(device.id, this.bluefruit.serviceUUID, this.bluefruit.txCharacteristic, assignmentToSend).then(
                           () => console.log('Message sent'),
                           () => console.log('Error sending message to BLE')
                        );
                     });

                     //save workout id and sets and reps and title and instructor id and anything else relevant
                     this.dataService.saveWorkoutID(workout.workoutid);
                     this.dataService.saveWorkoutTitle(workout.title);
//                     this.dataService.saveInstructorID(workout.instructorname);
this.dataService.saveInstructorID(workout.username);
                     this.dataService.saveSetsAssigned(workout.sets);
//                     this.dataService.saveRepsAssigned(workout.reps);
                     this.dataService.saveWorkoutRepsPerSet(workout.reps);
                     this.dataService.saveRepsRemaining(repsToAssign);
                     this.dataService.saveSquatPositionsSet(0);
                     this.dataService.saveSquatModeBackground(0);

                     //reset all data on reps saved in the app
                     this.dataService.saveSetOfFivesOne("00000");
                     this.dataService.saveSetOfFivesTwo("00000");
                     this.dataService.saveSetOfFivesThree("00000");
                     this.dataService.saveSetOfFivesFour("00000");
                     this.dataService.saveSetOfFivesFive("00000");
                     this.dataService.saveSetOfFivesSix("00000");
                     this.dataService.saveSetOfFivesSeven("00000");
                     this.dataService.saveSetOfFivesEight("00000");
                     this.dataService.saveSetOfFivesNine("00000");
                     this.dataService.saveSetOfFivesTen("00000");
                     this.dataService.saveSetOfFivesEleven("00000");
                     this.dataService.saveSetOfFivesTwelve("00000");
                     this.dataService.saveSetOfFivesThirteen("00000");
                     this.dataService.saveSetOfFivesFourteen("00000");
                     this.dataService.saveSetOfFivesFifteen("00000");
                     this.dataService.saveSetOfFivesSixteen("00000");
                     this.dataService.saveSetOfFivesSeventeen("00000");
                     this.dataService.saveSetOfFivesEighteen("00000");
                     this.dataService.saveSetOfFivesNineteen("00000");
                     this.dataService.saveSetOfFivesTwenty("00000");

                     this.dataService.getUserID().then((userID) => {
                         //var link = 'http://localhost:80/api.php';
                         var link = 'http://cgi.soic.indiana.edu/~shaykhok/api.php';
                         var myData = JSON.stringify({action: "athleteStartedWorkout", username: userID, workoutId: workout.workoutid});

                         this.http.post(link, myData).subscribe(data => {
                             this.data.response = data["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response
                         }, error => {
                             console.log("Oooops!");
                         });
                     });

                     this.navCtrl.setRoot(CurrentWorkoutPage);

                 }
             }
         ]
     });

     prompt.present();
  }
  
   // ASCII only, converts the string that is being sent from the phone to bytes
  stringToBytes(string) {
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
        array[i] = string.charCodeAt(i);
    }
    return array.buffer;
  }

}
