import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Data } from '../../providers/data/data';
import { Events } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { NgZone } from '@angular/core';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'page-squatMode',
  templateUrl: 'squatMode.html'
})
export class SquatModePage {
  
  buttonState: number;
  repsRemaining: number;
  squatModeBackground: number;

  bluefruit = {
      serviceUUID: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
      txCharacteristic: '6e400002-b5a3-f393-e0a9-e50e24dcca9e', // transmit is $
      rxCharacteristic: '6e400003-b5a3-f393-e0a9-e50e24dcca9e'  // receive is f$
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: Data, public events: Events, private ble:BLE, private zone: NgZone, public platform: Platform) {
     this.buttonState = 0;
     this.squatModeBackground = 0;

     this.dataService.getRepsRemaining().then((repsLeft) => {
        this.repsRemaining = repsLeft;
        console.log('DataService Reps Remaining ' + this.repsRemaining);
     });
     
     this.dataService.getSquatModeBackground().then((squatModeBackground) => {
        if(squatModeBackground == 0){
           this.unattempted();
        }
        if(squatModeBackground == 1){
           this.failed();
        }
        if(squatModeBackground == 2){
           this.completed();
        }
        if(squatModeBackground == 3){
           this.inProgress();
        }
     });

     var sendActionButton = document.getElementById('sendActionButton');
     var startCircle = document.getElementById('startCircle');
     var targetCircle = document.getElementById('targetCircle');

     this.dataService.getSquatPositionsSet().then((squatPositions) => {
        if(squatPositions == 0){
           startCircle.className = "startStatusNotSet";
           targetCircle.className = "targetStatusNotSet";
           sendActionButton.innerHTML = "Start";
        }
        if(squatPositions == 1){
           startCircle.className = "startStatusSet";
           targetCircle.className = "targetStatusNotSet";
           sendActionButton.innerHTML = "Target";
        }
        if(squatPositions == 2){
           startCircle.className = "startStatusSet";
           targetCircle.className = "targetStatusSet";
           sendActionButton.innerHTML = "Reset";
        }
     });
  }

  ionViewDidLoad() {
     this.platform.ready().then(() => {
        this.updateInfo();
        console.log("updating info");
        this.updateUI();
     });
  }

  updateInfo(){
     this.dataService.getRepsRemaining().then((remainingReps) => {
     this.dataService.getSquatModeBackground().then((background) => {
     this.dataService.getSquatPositionsSet().then((positionsSet) => {
        this.repsRemaining = remainingReps;
        this.buttonState = positionsSet;
        this.squatModeBackground = background;

        var startCircle = document.getElementById('startCircle');
        var targetCircle = document.getElementById('targetCircle');
        var sendActionButton = document.getElementById('sendActionButton');

        //handle setting positions in squat mode and updating the button
        if(this.buttonState == 0){					//unset positions
           startCircle.className = "startStatusNotSet";
           targetCircle.className = "targetStatusNotSet";
           sendActionButton.innerHTML = "Start";
        }
        if(this.buttonState == 1){					//set start
           startCircle.className = "startStatusSet";
           targetCircle.className = "targetStatusNotSet";
           sendActionButton.innerHTML = "Target";
        }
        if(this.buttonState == 2){					//set positions
           startCircle.className = "startStatusSet";
           targetCircle.className = "targetStatusSet";
           sendActionButton.innerHTML = "Reset";
        }

        if(this.squatModeBackground == 0){
           this.unattempted();
        }
        if(this.squatModeBackground == 1){
           this.failed();
        }
        if(this.squatModeBackground == 2){
           this.completed();
        }
        if(this.squatModeBackground == 3){
           this.inProgress();
        }

      });
      });
      });
   }

   updateUI(){
     this.events.subscribe('repReceived:event', (string) => {
        console.log("Event received");
        this.zone.run(() => {
           console.log("Zone: event received");
           this.updateInfo();
        });
     });
   }

  unattempted(){
     var squatModeBackground = document.getElementById('squatModeBackground');
     squatModeBackground.className = 'squatUnattempted';
  }
  completed(){
     //change background
     var squatModeBackground = document.getElementById('squatModeBackground');
     squatModeBackground.className = 'squatCompleted';
  }
  failed(){
     //change background
     var squatModeBackground = document.getElementById('squatModeBackground');
     squatModeBackground.className = 'squatFailed';
  }
  inProgress(){
     //change background
     var squatModeBackground = document.getElementById('squatModeBackground');
     squatModeBackground.className = 'squatInProgress';
  }

  setStart(){
     var startCircle = document.getElementById('startCircle');
     startCircle.className = 'startStatusSet';
  }

  setTarget(){
     var targetCircle = document.getElementById('targetCircle');
     targetCircle.className = 'targetStatusSet';
  }

  resetStartAndTarget(){
     var startCircle = document.getElementById('startCircle');
     var targetCircle = document.getElementById('targetCircle');
     startCircle.className = 'startStatusNotSet';
     targetCircle.className = 'targetStatusNotSet';
  }

  sendAction(){
    console.log("Button state: ");
    console.log(this.buttonState);

    //set start position
    if(this.buttonState == 0){
       console.log("Set start: 1xxx"); 

    this.dataService.getSetsAssigned().then((setsAssigned) => {
//    this.dataService.getRepsAssigned().then((repsAssigned) => {
//       var totalReps = (setsAssigned * repsAssigned);
    this.dataService.getWorkoutRepsPerSet().then((repsPerSet) => {
       var totalReps = (setsAssigned * repsPerSet);
       var assignedRepsToSendUntrimmed = '000' + totalReps;
       console.log("Untrimmed: " + assignedRepsToSendUntrimmed);

       //get last three characters from untrimmed string (reps to assign with preceding 0s)
       var assignedRepsToSend = assignedRepsToSendUntrimmed.substr(assignedRepsToSendUntrimmed.length - 3);
       console.log("Sending Trimmed " + assignedRepsToSend);
       var actionToSend = '1' + assignedRepsToSend;

       //send message via Bluetooth
       var bleAction = this.stringToBytes(actionToSend);
       this.dataService.getDevice().then((device) => {
          this.ble.write(device.id, this.bluefruit.serviceUUID, this.bluefruit.txCharacteristic, bleAction).then(
             () => console.log('Message sent'),
             () => console.log('Error sending message to BLE')
          );
       });
    });
    });

    } else if(this.buttonState == 1){
       console.log("Set target: 2xxx");

    this.dataService.getSetsAssigned().then((setsAssigned) => {
//    this.dataService.getRepsAssigned().then((repsAssigned) => {
//       var totalReps = (setsAssigned * repsAssigned);
    this.dataService.getWorkoutRepsPerSet().then((repsPerSet) => {
       var totalReps = (setsAssigned * repsPerSet);
       var assignedRepsToSendUntrimmed = '000' + totalReps;
       console.log("Untrimmed: " + assignedRepsToSendUntrimmed);
    
       //get last three characters from untrimmed string (reps to assign with preceding 0s)
       var assignedRepsToSend = assignedRepsToSendUntrimmed.substr(assignedRepsToSendUntrimmed.length - 3);
       console.log("Sending Trimmed " + assignedRepsToSend);
       var actionToSend = '2' + assignedRepsToSend;

       //send message via Bluetooth
       var bleAction = this.stringToBytes(actionToSend);
       this.dataService.getDevice().then((device) => {
          this.ble.write(device.id, this.bluefruit.serviceUUID, this.bluefruit.txCharacteristic, bleAction).then(
             () => console.log('Message sent'),
             () => console.log('Error sending message to BLE')
          );
       });
    });
    });

    } else if(this.buttonState == 2){
       console.log("Send reset: 3xxx");

    this.dataService.getSetsAssigned().then((setsAssigned) => {
//    this.dataService.getRepsAssigned().then((repsAssigned) => {
//       var totalReps = (setsAssigned * repsAssigned);
    this.dataService.getWorkoutRepsPerSet().then((repsPerSet) => {
       var totalReps = (setsAssigned * repsPerSet);
       var assignedRepsToSendUntrimmed = '000' + totalReps;
       console.log("Untrimmed: " + assignedRepsToSendUntrimmed);

       //get last three characters from untrimmed string (reps to assign with preceding 0s)
       var assignedRepsToSend = assignedRepsToSendUntrimmed.substr(assignedRepsToSendUntrimmed.length - 3);
       console.log("Sending Trimmed " + assignedRepsToSend);
       var actionToSend = '3' + assignedRepsToSend;

       //send message via Bluetooth
       var bleAction = this.stringToBytes(actionToSend);
       this.dataService.getDevice().then((device) => {
          this.ble.write(device.id, this.bluefruit.serviceUUID, this.bluefruit.txCharacteristic, bleAction).then(
             () => console.log('Message sent'),
             () => console.log('Error sending message to BLE')
          );
       });
    });
    });

    }
  }

   // ASCII only.
  stringToBytes(string) {                // converts the string that you are trying to send from the phone to bytes
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
        array[i] = string.charCodeAt(i);
    }
    return array.buffer;
  }


/*  testEvent(){
    this.dataService.saveWorkoutTitle("blah");
       this.dataService.getWorkoutTitle().then((title) => {		//getting workout title just so the event won't fire to update currentWorkout UI before workout is saved
          this.events.publish('repReceived:event', "blah");
       });
    console.log("firing event");
  }*/

}
