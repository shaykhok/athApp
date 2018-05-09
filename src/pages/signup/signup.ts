import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';

import { Http } from '@angular/http';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  signup = <any>{};
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: Http) {
     this.signup.response = '';
     this.http = http;
this.signup.signedUp = false;
  }

  signUp(){ //database signup here...

     var modalErrorMessage = "";
     if(!this.signup.hasOwnProperty('athletename') || (this.signup.hasOwnProperty('athletename') && this.signup.athletename.length == 0)){ //if no name entered
        modalErrorMessage = "Please enter your name";
     } else if(!this.signup.hasOwnProperty('username') || (this.signup.hasOwnProperty('username') && this.signup.username.length == 0)){ //if no username
        modalErrorMessage = "Please enter a username";
     } else if(!this.signup.hasOwnProperty('password') || (this.signup.hasOwnProperty('password') && this.signup.password.length == 0)){ //if no password
        modalErrorMessage = "Please enter a password";
     } else if(!this.signup.hasOwnProperty('confirmation') || (this.signup.hasOwnProperty('confirmation') && this.signup.confirmation.length == 0)){ //if no confirmation
        modalErrorMessage = "Please confirm your password";
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

     } else {

          if(this.signup.hasOwnProperty('athletename') && this.signup.athletename.length > 0 && this.signup.hasOwnProperty('username') && this.signup.username.length > 0 && this.signup.hasOwnProperty('password') && this.signup.password.length > 0 && this.signup.hasOwnProperty('confirmation') && this.signup.confirmation.length > 0){
              //check if username is taken
              var userExists = false;
//              var link = 'http://localhost:80/api.php';
              var link = 'http://cgi.soic.indiana.edu/~shaykhok/api.php';
              var userPassword = JSON.stringify({action: "athleteUserPasswordCheck", username: this.signup.username, password: this.signup.password});
              this.http.post(link, userPassword).subscribe(
                 data => {
                    this.signup.response = data["_body"];
                    var responseObject = JSON.parse(this.signup.response);
                    userExists = responseObject.userExists;
                    if(userExists){ //if username is in database
                       modalErrorMessage = "Username taken. Please enter a different username";
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
                       if(this.signup.password != this.signup.confirmation){
                          modalErrorMessage = "Passwords do not match. Please try again";
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
                       } else {
//                            var link = 'http://localhost:80/api.php';

if(!this.signup.signedUp){
this.signup.signedUp = true;
                            var link = 'http://cgi.soic.indiana.edu/~shaykhok/api.php';
                            var signupInfo = JSON.stringify({action: "athleteSignup", athleteName: this.signup.athletename, username: this.signup.username, password: this.signup.password});
                            this.http.post(link, signupInfo).subscribe(
                               data => {
                                  this.signup.response = data["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response
                                  var modalConfirmation = "Signed up successfully with username: " + this.signup.username;
                                  let prompt = this.alertCtrl.create({
                                     title: modalConfirmation,
                                     buttons: [
                                        {
                                           text: 'Ok',
                                           handler: () => {
                                              this.navCtrl.setRoot(LoginPage);
                                           }
                                        }
                                     ]
                                  });
                                  prompt.present();
                               },
                               error => {
                                  console.log("Oooops!");
                            });
                       }
}

                    }

             },
             error => {
                console.log("Error!");
             });


          }

     }

  }

}
