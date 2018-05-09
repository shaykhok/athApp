import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ScanPage } from '../scan/scan';
import { SignupPage } from '../signup/signup';
import { Data } from '../../providers/data/data';
import { BLE } from '@ionic-native/ble';

import { Http } from '@angular/http';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  login = <any>{};
data:any = {};
workout:any = {};
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public dataService: Data, private ble: BLE, public http: Http) {
  
this.data.username = '';
this.data.response = '';
this.http = http;

this.login.response = '';

/*this.workout.title = '';
this.workout.instructor = '';
this.workout.repsPerSet = '';
this.workout.sets = '';
this.workout.repsRemaining = '';
this.workout.hundredRepString = '';*/
  }

  athleteLogin(){

  var modalErrorMessage = "";
     if(!this.login.hasOwnProperty('username') || (this.login.hasOwnProperty('username') && this.login.username.length == 0)){ //if no username
        modalErrorMessage = "Please enter your username";
     } else if(!this.login.hasOwnProperty('password') || (this.login.hasOwnProperty('password') && this.login.password.length == 0)){ //if no password
        modalErrorMessage = "Please enter your password";
     }
     if(modalErrorMessage != ""){
        let prompt = this.alertCtrl.create({
            title: modalErrorMessage,
            buttons: [
                {
                    text: 'Close'
                },
            ]
        });
        prompt.present();

     }

    //username and password have at least been entered
    if(this.login.hasOwnProperty('username') && this.login.username.length > 0 && this.login.hasOwnProperty('password') && this.login.password.length > 0){
        var userExists = false;
        var passwordMatches = false;

//        var link = 'http://localhost:80/api.php';
var link = 'http://cgi.soic.indiana.edu/~shaykhok/api.php';
        var userPassword = JSON.stringify({action: "athleteUserPasswordCheck", username: this.login.username, password: this.login.password});

        this.http.post(link, userPassword).subscribe(
           data => {
               this.login.response = data["_body"];
               var responseObject = JSON.parse(this.login.response);
               userExists = responseObject.userExists;
               passwordMatches = responseObject.passwordMatches;
               
                if(!userExists){ //if username not in database
                   modalErrorMessage = "The username you entered does not exist";
                } else if(!passwordMatches){ //if password is not right for the given user
                   modalErrorMessage = "Incorrect password";
                }
                if(modalErrorMessage != ""){
                   let prompt = this.alertCtrl.create({
                      title: modalErrorMessage,
                      buttons: [
                         {
                            text: 'Close'
                         },
                      ]
                });
                prompt.present();
                } else{
                   this.dataService.saveUserID(this.login.username);

		   //update user local storage info, get info from database first (check also that the athlete current workout is updated correctly

		   var link = 'http://cgi.soic.indiana.edu/~shaykhok/api.php';

		   var myData = JSON.stringify({action: "getAthleteCurrentWorkoutDetails", username: this.login.username});
console.log("data sent");
console.log(myData);

		   this.http.post(link, myData).subscribe(data => {
		   this.login.response = data["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response
console.log(this.login.response)
		   //if no workout
		   if(this.login.response == "-1"){

                     this.dataService.saveWorkoutID("-1");
                     this.dataService.saveWorkoutTitle("");
                     this.dataService.saveInstructorID("");
                     this.dataService.saveSetsAssigned(0);
                     this.dataService.saveWorkoutRepsPerSet(0);
                     this.dataService.saveRepsRemaining(100);
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

		    } else{
                     this.workout = JSON.parse(this.login.response);
                     this.dataService.saveWorkoutID(this.workout.workoutid);
                     this.dataService.saveWorkoutTitle(this.workout.title);
                     this.dataService.saveInstructorID(this.workout.instructor);
                     this.dataService.saveSetsAssigned(this.workout.sets);
                     this.dataService.saveWorkoutRepsPerSet(this.workout.reps);
                     this.dataService.saveRepsRemaining(this.workout.repsRemaining);
                     this.dataService.saveSquatPositionsSet(0);
                     this.dataService.saveSquatModeBackground(0);

                     //reset all data on reps saved in the app
                     this.dataService.saveSetOfFivesOne(this.workout.hundredRepString.substring(0,5));
                     this.dataService.saveSetOfFivesTwo(this.workout.hundredRepString.substring(5,10));
                     this.dataService.saveSetOfFivesThree(this.workout.hundredRepString.substring(10,15));
                     this.dataService.saveSetOfFivesFour(this.workout.hundredRepString.substring(15,20));
                     this.dataService.saveSetOfFivesFive(this.workout.hundredRepString.substring(20,25));
                     this.dataService.saveSetOfFivesSix(this.workout.hundredRepString.substring(25,30));
                     this.dataService.saveSetOfFivesSeven(this.workout.hundredRepString.substring(30,35));
                     this.dataService.saveSetOfFivesEight(this.workout.hundredRepString.substring(35,40));
                     this.dataService.saveSetOfFivesNine(this.workout.hundredRepString.substring(40,45));
                     this.dataService.saveSetOfFivesTen(this.workout.hundredRepString.substring(45,50));
                     this.dataService.saveSetOfFivesEleven(this.workout.hundredRepString.substring(50,55));
                     this.dataService.saveSetOfFivesTwelve(this.workout.hundredRepString.substring(55,60));
                     this.dataService.saveSetOfFivesThirteen(this.workout.hundredRepString.substring(60,65));
                     this.dataService.saveSetOfFivesFourteen(this.workout.hundredRepString.substring(65,70));
                     this.dataService.saveSetOfFivesFifteen(this.workout.hundredRepString.substring(70,75));
                     this.dataService.saveSetOfFivesSixteen(this.workout.hundredRepString.substring(75,80));
                     this.dataService.saveSetOfFivesSeventeen(this.workout.hundredRepString.substring(80,85));
                     this.dataService.saveSetOfFivesEighteen(this.workout.hundredRepString.substring(85,90));
                     this.dataService.saveSetOfFivesNineteen(this.workout.hundredRepString.substring(90,95));
                     this.dataService.saveSetOfFivesTwenty(this.workout.hundredRepString.substring(95,100));
		     }
		     this.navCtrl.setRoot(ScanPage);
 }, error => {
 console.log("Oooops!");
 });
}
//                   this.navCtrl.setRoot(ScanPage); //moved inside of http request so we have to wait
                }
,//             },
             error => {
                console.log("Error!");
             });

     }

  }


  ionViewDidEnter(){
    console.log('ionViewDidEnter disconnecting Bluetooth');
    this.dataService.getDevice().then((device) => {
       if(device != null){
         this.ble.disconnect(device.id).then(
           () => console.log('Disconnected ' + JSON.stringify(device)),
           () => console.log('ERROR disconnecting ' + JSON.stringify(device))
         )
       }
    });
  }

  signUp(){
     this.navCtrl.push(SignupPage);
  }

/*  testLogin(){
     this.navCtrl.push(HomePage);
     this.dataService.saveUserID("shaykhok");
//     this.dataService.saveWorkoutID(3);
  }

  mobileTestLogin(){
     this.navCtrl.push(ScanPage);
     this.dataService.saveUserID("shaykhok");
     this.dataService.saveWorkoutID(3);
  }

submit(){
var link = 'http://cgi.soic.indiana.edu/~shaykhok/api.php';

var myData = JSON.stringify({action: "getAthleteCurrentWorkoutDetails", username: this.data.username});

 this.http.post(link, myData)
 .subscribe(data => {
 this.data.response = data["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response

if(this.data.response = "-1"){
//save all as empty values
}

 }, error => {
 console.log("Oooops!");
 });
 }*/

}
