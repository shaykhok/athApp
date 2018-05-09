import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { NewWorkoutsPage } from '../newWorkouts/newWorkouts';
import { PastWorkoutsPage } from '../pastWorkouts/pastWorkouts';
import { CurrentWorkoutPage } from '../currentWorkout/currentWorkout';
import { ToastController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { Data } from '../../providers/data/data';

import { Events } from 'ionic-angular';
import { Http } from '@angular/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  peripheral: any = {};

  bluefruit = {
      serviceUUID: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
      txCharacteristic: '6e400002-b5a3-f393-e0a9-e50e24dcca9e', // transmit is from the phone's perspective
      rxCharacteristic: '6e400003-b5a3-f393-e0a9-e50e24dcca9e'  // receive is from the phone's persective
  };

  data:any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, private ble: BLE,
              private toastCtrl: ToastController, private ngZone: NgZone, public dataService: Data, public events: Events, public http: Http) {

this.dataService.getWorkoutID().then((workoutID) => {
   this.data.currentWorkoutID = workoutID;
   console.log(this.data.currentWorkoutID);
});

this.dataService.getDevice().then((device) => {

      if(device != null){
      this.ble.connect(device.id).subscribe(
         peripheral => this.onConnected(peripheral),
         peripheral => this.onDeviceDisconnected(peripheral)
    );
}

    });
  }

  onConnected(peripheral) {
    this.ngZone.run(() => {
      this.peripheral = peripheral;
      console.log(Object.keys(peripheral));
    });

    this.ble.startNotification(peripheral.id, this.bluefruit.serviceUUID, this.bluefruit.rxCharacteristic).subscribe(
      buffer => {
        var data = new Uint8Array(buffer);
        console.log('Received Notification: ' + data);
        var receivedmsg = String.fromCharCode.apply(null, new Uint8Array(buffer));
        console.log(receivedmsg);

if(receivedmsg.length > 4){ //sometimes BLE incorrectly sends messages of length 4 sometimes. In that case ignore the message

        //get status of squat positions
        var squatPositionsSet = receivedmsg.charAt(0);
        console.log("Squat positions set: " + squatPositionsSet);
        this.dataService.saveSquatPositionsSet(squatPositionsSet);
        
        //get squat mode background to display (0 - unattempted, 1 - failed, 2 - completed, 3 - in progress)
        var squatModeBackground = receivedmsg.charAt(1);
        console.log("Squat mode background: " + squatModeBackground);
        this.dataService.saveSquatModeBackground(squatModeBackground);

        //get reps remaining in workout with preceding 0s Ex. 9 reps would be 009
        var repHundredsRemaining = receivedmsg.charAt(2);
        var repTensRemaining = receivedmsg.charAt(3);
        var repOnesRemaining = receivedmsg.charAt(4);
        var repsRemaining;
        if(repHundredsRemaining != 0){
           repsRemaining = repHundredsRemaining + repTensRemaining + repOnesRemaining;
        } else if (repTensRemaining != 0){
              repsRemaining = repTensRemaining + repOnesRemaining;
        } else repsRemaining = repOnesRemaining;

        console.log("repHundredsRemaining: " + repHundredsRemaining);
        console.log("repTensRemaining: " + repTensRemaining);
        console.log("repOnesRemaining: " + repOnesRemaining);
        console.log("repsRemaining " + repsRemaining);
        this.dataService.saveRepsRemaining(repsRemaining);

        //get the set of fives that was sent from arduino (range from 0-19 as there can be 100 total reps at most so at most 20 sets of five in a workout)
        var currentSetOfFiveTensPlace = receivedmsg.charAt(5);
        var currentSetOfFiveOnesPlace = receivedmsg.charAt(6);
        console.log("Tens: " + currentSetOfFiveTensPlace + ", Ones: " + currentSetOfFiveOnesPlace); 
        
        //get the five rep values that were sent to the app
        var repOne = receivedmsg.charAt(7);
        var repTwo = receivedmsg.charAt(8);
        var repThree = receivedmsg.charAt(9);
        var repFour = receivedmsg.charAt(10);
        var repFive = receivedmsg.charAt(11);
        console.log("Rep One: " + repOne);
        console.log("Rep Two: " + repTwo);
        console.log("Rep Three: " + repThree);
        console.log("Rep Four: " + repFour);
        console.log("Rep Five: " + repFive);

        //create a string of the five reps
        var repsToStore = repOne + repTwo + repThree + repFour + repFive;
        console.log("Reps to store: " + repsToStore);

        //store the 5 reps that were sent in local storage variable based on which set of five reps were sent from arduino
        if(currentSetOfFiveTensPlace == 0){
           if(currentSetOfFiveOnesPlace == 0){
              this.dataService.saveSetOfFivesOne(repsToStore);
           } else if(currentSetOfFiveOnesPlace == 1){
              this.dataService.saveSetOfFivesTwo(repsToStore);
           } else if(currentSetOfFiveOnesPlace == 2){              
              this.dataService.saveSetOfFivesThree(repsToStore);
           } else if(currentSetOfFiveOnesPlace == 3){              
              this.dataService.saveSetOfFivesFour(repsToStore);
           } else if(currentSetOfFiveOnesPlace == 4){              
              this.dataService.saveSetOfFivesFive(repsToStore);
           } else if(currentSetOfFiveOnesPlace == 5){              
              this.dataService.saveSetOfFivesSix(repsToStore);
           } else if(currentSetOfFiveOnesPlace == 6){              
              this.dataService.saveSetOfFivesSeven(repsToStore);
           } else if(currentSetOfFiveOnesPlace == 7){              
              this.dataService.saveSetOfFivesEight(repsToStore);
           } else if(currentSetOfFiveOnesPlace == 8){              
              this.dataService.saveSetOfFivesNine(repsToStore);
           } else if(currentSetOfFiveOnesPlace == 9){              
              this.dataService.saveSetOfFivesTen(repsToStore);
           }
        } else{
           if(currentSetOfFiveOnesPlace == 0){
              this.dataService.saveSetOfFivesEleven(repsToStore);
           } else if(currentSetOfFiveOnesPlace == 1){              
              this.dataService.saveSetOfFivesTwelve(repsToStore);
           } else if(currentSetOfFiveOnesPlace == 2){
              this.dataService.saveSetOfFivesThirteen(repsToStore);
           } else if(currentSetOfFiveOnesPlace == 3){
              this.dataService.saveSetOfFivesFourteen(repsToStore);
           } else if(currentSetOfFiveOnesPlace == 4){
              this.dataService.saveSetOfFivesFifteen(repsToStore);
           } else if(currentSetOfFiveOnesPlace == 5){
              this.dataService.saveSetOfFivesSixteen(repsToStore);
           } else if(currentSetOfFiveOnesPlace == 6){
              this.dataService.saveSetOfFivesSeventeen(repsToStore);
           } else if(currentSetOfFiveOnesPlace == 7){
              this.dataService.saveSetOfFivesEighteen(repsToStore);
           } else if(currentSetOfFiveOnesPlace == 8){
              this.dataService.saveSetOfFivesNineteen(repsToStore);
           } else if(currentSetOfFiveOnesPlace == 9){
              this.dataService.saveSetOfFivesTwenty(repsToStore);
           }
        }


/* code for posting to database

//get information that needs to be posted (currentSetId, currentRepId, currentRepValue)
*/   
   this.dataService.getWorkoutRepsPerSet().then((repsPerSet) => {
      var currentSetOfFive = currentSetOfFiveTensPlace + currentSetOfFiveOnesPlace;

      var startRepOfCurrentSetOfFive = currentSetOfFive * 5;

      var currentRep = 0;
      var currentRepValue = 0;

      if(repFive == 3 || repFour == 3 || repThree == 3 || repTwo == 3 || repOne == 3 || (repFive == 0 && repFour == 0 && repThree == 0 && repTwo == 0 && repOne == 0)){
         // don't post anything if latest repUpdate that was received was an inProgress rep
         // also don't post anything if all of the rep values are 0s (already in the database)
            //don't want to make too many sends to the database
      } else {

      if(repFive == 1 || repFive == 2){
         currentRep = startRepOfCurrentSetOfFive + 5;
         currentRepValue = repFive;
      } else if(repFour == 1 || repFour == 2){
         currentRep = startRepOfCurrentSetOfFive + 4;
         currentRepValue = repFour;
      } else if(repThree == 1 || repThree == 2){
         currentRep = startRepOfCurrentSetOfFive + 3;
         currentRepValue = repThree;
      } else if(repTwo == 1 || repTwo == 2){
         currentRep = startRepOfCurrentSetOfFive + 2;
         currentRepValue = repTwo;
      } else if(repOne == 1 || repOne == 2){
         currentRep = startRepOfCurrentSetOfFive + 1;
         currentRepValue = repOne;
      }

      var currentSet = (currentRep / repsPerSet);
      var currentSetId;

      if(Number.isInteger(currentSet)){
         currentSetId = currentSet;
      } else currentSetId = Math.floor(currentSet) + 1;

      var currentRepId;
      if(currentRep % repsPerSet == 0){
         currentRepId = repsPerSet;
      }
      else{
         currentRepId = (currentRep % repsPerSet);
      }


//post to database with necessary information

this.dataService.getUserID().then((userID) => {
this.dataService.getWorkoutID().then((workoutID) => {
//   var link = 'http://localhost:80/api.php';
var link = 'http://cgi.soic.indiana.edu/~shaykhok/api.php';
   var myData = JSON.stringify({action: "athleteUpdateRepValue", username: userID, workoutId: workoutID, setId: currentSetId, repId: currentRepId, repValue: currentRepValue});

   this.http.post(link, myData).subscribe(data => {
   this.data.response = data["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response
   }, error => {
   console.log("Oooops!");
   });   

console.log("User ID: " + userID + " Workout Id: " + workoutID + " set id: " + currentSetId + " rep id: " + currentRepId + " rep value: " + currentRepValue);

});
});
}
});



        //publish event to tell currentWorkout and squatMode pages to update themselves with the newly received data

        this.dataService.getWorkoutTitle().then((title) => {             //getting workout title was necessary during testing
           this.events.publish('repReceived:event', title);
        });
        console.log("firing event");

} // close the if receivedmsg != 0000

      }
    );

  }

  onDeviceDisconnected(peripheral) {
    let toast = this.toastCtrl.create({
      message: 'The knee sleeve unexpectedly disconnected',
      duration: 6000,
      position: 'middle',
      dismissOnPageChange: true
    });
    toast.present();
  }

   // ASCII only.
  stringToBytes(string) {                // converts the string that you are trying to send from the phone to bytes
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
        array[i] = string.charCodeAt(i);
    }
    return array.buffer;
  }

  viewNewWorkouts(){
     this.navCtrl.push(NewWorkoutsPage);
  }

  resumeWorkout(){
//data service needs to get the current workout to resume that workout or will this already be saved in storage
     this.navCtrl.setRoot(CurrentWorkoutPage);
  }

  viewPastWorkouts(){
     this.navCtrl.push(PastWorkoutsPage);
  }

  logOut(){
     this.navCtrl.setRoot(LoginPage);
  }

}
