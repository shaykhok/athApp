import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Data } from '../../providers/data/data';
import { Http } from '@angular/http';

@Component({
  selector: 'page-oldWorkout',
  templateUrl: 'oldWorkout.html'
})
export class OldWorkoutPage {

  objectKeys = Object.keys;
  noteData:any = [];
  data:any = {};
  oldWorkout:any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public dataService: Data) {
     this.data.response = '';
     this.http = http;
     this.oldWorkout = this.navParams.get('oldWorkout');

     this.dataService.getUserID().then((userID) => {
//        var link = 'http://localhost:80/api.php';
        var link = 'http://cgi.soic.indiana.edu/~shaykhok/api.php';
        var myData = JSON.stringify({action: "athleteWorkoutNotes", username: userID, workoutid: this.oldWorkout.workoutId});
        this.http.post(link, myData).subscribe(data => {
           this.data.response = data["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response
           console.log(this.data.response);
           console.log(JSON.parse(this.data.response));
           this.noteData = JSON.parse(this.data.response);
           console.log(this.noteData[0]);
           }, error => {
              console.log("Oooops!");
        });
     });

  }

}
