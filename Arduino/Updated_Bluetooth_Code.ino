#include <Arduino.h>
#include <SPI.h>
#if not defined (_VARIANT_ARDUINO_DUE_X_) && not defined (_VARIANT_ARDUINO_ZERO_)
  #include <SoftwareSerial.h>
#endif

#include "Adafruit_BLE.h"
#include "Adafruit_BluefruitLE_SPI.h"
#include "Adafruit_BluefruitLE_UART.h"
#include "BluefruitConfig.h"
#include <Adafruit_NeoPixel.h>

//change FACTORYRESET_ENABLE TO 1 to reset
#define FACTORYRESET_ENABLE         0
#define MINIMUM_FIRMWARE_VERSION    "0.6.6"
#define MODE_LED_BEHAVIOUR          "MODE"


//hardware serial bluetooth coomunication with Flora
Adafruit_BluefruitLE_UART ble(Serial1, BLUEFRUIT_UART_MODE_PIN);

// A small helper
void error(const __FlashStringHelper*err) {
  Serial.println(err);
  while (1);
}

int assignedReps; //total reps in assigned workout
int workout[100]; //max number of reps in a workout is 100      --- this array needs to be reset at the end of a workout
int currentRep = 0; 
int repsRemaining = assignedReps; //define this in the loop right after the workout is assigned

int setOfFives = 0; //breaking down the overall workout into sets of 5 reps, the set the user is on (Ex. 0 -> set consisting of reps 0 - 4)

int startPos;
int targetPos;
int currentPos;

int kneeNeoPixelPin = 8; //on board NeoPixel pin
int flexPin = 10; //flex sensor pin

float squatPercentage; //percentage of the squat
float completedPercentage = 1;
float attemptedPercentage = 0.85;
float failedPercentage = 0.6; //percentage at which we know the user has failed the squat and they are coming back up
float restartingPercentage = 0.35;

boolean workoutAssigned = false;
boolean startSet = false;
boolean targetSet = false;
boolean resetFromTarget = false; //athlete needs to reset from target to starting position before workout begins
boolean workoutCompleted = false;

int squatState = 0; //0 if unattempted, 1 if failed, 2 if completed successfully, 3 if in progress

Adafruit_NeoPixel kneeNeoPixel = Adafruit_NeoPixel(1, kneeNeoPixelPin, NEO_GRB + NEO_KHZ800); // neoPixel on knee sleeve

// colors for NeoPixel
uint32_t red = kneeNeoPixel.Color(255, 0, 0); 
uint32_t green = kneeNeoPixel.Color(0, 255, 0);
uint32_t yellow = kneeNeoPixel.Color(255, 255, 0);
uint32_t white = kneeNeoPixel.Color(255, 255, 255);

void setup() {
  pinMode(flexPin, INPUT);
  //Serial.begin(115200); //figure out how to do this without the serial...
  kneeNeoPixel.begin();
  kneeNeoPixel.show(); // Initialize pixel to 'off'
  kneeNeoPixel.setBrightness(100);

  //bluetooth code below
  //while (!Serial);  // required for Flora & Micro (can be commented out so we can work without having to have the serial monitor open)
  delay(500);

  Serial.begin(115200); //figure out how to do this without the serial...
  Serial.println(F("Adafruit Bluefruit Command Mode Example"));
  Serial.println(F("---------------------------------------"));

  /* Initialise the module */
  Serial.print(F("Initialising the Bluefruit LE module: "));

  if ( !ble.begin(VERBOSE_MODE) )
  {
    error(F("Couldn't find Bluefruit, make sure it's in CoMmanD mode & check wiring?"));
  }
  Serial.println( F("OK!") );

  if ( FACTORYRESET_ENABLE )
  {
    /* Perform a factory reset to make sure everything is in a known state */
    Serial.println(F("Performing a factory reset: "));
    if ( ! ble.factoryReset() ){
      error(F("Couldn't factory reset"));
    }
  }

  /* Disable command echo from Bluefruit */
  ble.echo(false);

  Serial.println("Requesting Bluefruit info:");
  /* Print Bluefruit information */
  ble.info();

  Serial.println(F("Please use Adafruit Bluefruit LE app to connect in UART mode"));
  Serial.println(F("Then Enter characters to send to Bluefruit"));
  Serial.println();

  ble.verbose(false);  // debug info is a little annoying after this point!

  /* Wait for connection */
  while (! ble.isConnected()) {
      delay(500);
  }

  // LED Activity command is only supported from 0.6.6
  if ( ble.isVersionAtLeast(MINIMUM_FIRMWARE_VERSION) )
  {
    // Change Mode LED Activity
    Serial.println(F("******************************"));
    Serial.println(F("Change LED activity to " MODE_LED_BEHAVIOUR));
    ble.sendCommandCheckOK("AT+HWModeLED=" MODE_LED_BEHAVIOUR);
    Serial.println(F("******************************"));
  }
  
}

void loop() {

  //wait for workout assignment
  while(!workoutAssigned){
    readAppInput();
  }
  
  //wait for start to be set
  while(!startSet){
    readAppInput();
  }
  //wait for target to be set
  while(!targetSet){
    readAppInput();
  }

  //wait for athlete to reset to starting position
  while(!resetFromTarget){
    readAppInput();
    if(!startSet){  //if the positions have been reset
      squatState = 0;
      updateKneeNeoPixel();
      break;
    }
    currentPos = analogRead(flexPin);
    squatPercentage = (float)((float)startPos - (float)currentPos)/(float)((float)startPos - (float)targetPos);
    //show white light until athlete resets to starting position
    kneeNeoPixel.setPixelColor(0, white);
    kneeNeoPixel.show();
    if(squatPercentage <= restartingPercentage){
      //quick flash to let user know they are ready to start workout
      neoPixelQuickFlash();
      resetFromTarget = true;
    }
  }
  while(!workoutCompleted && startSet && targetSet){

    //read from app in case the user wants to start a different workout/reset start and target positions
    readAppInput();

    if(!startSet){  //if the positions have been reset
      if(workout[currentRep] == 3){                   //if the squat was in progress when positions were reset, just don't count the squat towards the workout 
        workout[currentRep] = 0;
      }
      squatState = 0;
      updateKneeNeoPixel();
      break;
      //does reading a 3 here reset the reset from target
    }

    //read squat position and determine squat percentage
    currentPos = analogRead(flexPin);
    squatPercentage = (float)((float)startPos - (float)currentPos)/(float)((float)startPos - (float)targetPos);
  
    //update squatState and workout array according to percentage
    if((squatState == 0) && (squatPercentage > attemptedPercentage)){             //uanttempted to in progress
      squatState = 3;
      workout[currentRep] = squatState;
  
      workoutStatus();
      
      sendUpdate();
    } else if((squatState == 3) && (squatPercentage >= completedPercentage)){     //in progress to completed
      squatState = 2;
      workout[currentRep] = squatState;
  
      workoutStatus();
      
      sendUpdate();
    } else if((squatState == 3) && (squatPercentage <= failedPercentage)){        //in progress to failed
      squatState = 1;
      workout[currentRep] = squatState;
  
      workoutStatus();
      
      sendUpdate();
    } else if((squatState == 2) && (squatPercentage <= restartingPercentage)){    //completed to unattempted
      squatState = 0;
      currentRep++;
      repsRemaining--;
      if(currentRep % 5 == 0){    //update the set of 5 to when current reps starts with 0 or 5
        setOfFives++;                 //now working on new set of 5
      }
  
      workoutStatus();
      
      sendUpdate();
    } else if((squatState == 1) && (squatPercentage <= restartingPercentage)){    //failed to unattempted
      squatState = 0;
      currentRep++;
      repsRemaining--;
      if(currentRep % 5 == 0){    //update the set of 5 to when current reps starts with 0 or 5
        setOfFives++;                 //now working on new set of 5
      }
  
      workoutStatus();
      
      sendUpdate();
    }
    updateKneeNeoPixel();                                                        //update NeoPixel on knee sleeve based on squat state

    //when all reps have been completed then end the workout
    if(repsRemaining == 0){
      workoutCompleted = true;
      workoutAssigned = false;                                                  //after the workout is finished then it's not assigned
      
    }
    
  }

  //reset variables to initial states and wait for next workout assignment
  while(workoutCompleted){
    readAppInput();
  }
  
}



//flash neoPixel on knee sleeve green
void neoPixelQuickFlash(){
  int i = 0;
  //5 flashes
  for(i = 0; i != 5; ++i){
    kneeNeoPixel.setPixelColor(0, green);
    kneeNeoPixel.show();
    delay(80);
    kneeNeoPixel.setPixelColor(0, 0);
    kneeNeoPixel.show();
    delay(80);
  }
}

//flash neoPixel on knee sleeve green
void neoPixelFlash(){
  kneeNeoPixel.setPixelColor(0, green);
  kneeNeoPixel.show();
  delay(1000);
  kneeNeoPixel.setPixelColor(0, 0);
  kneeNeoPixel.show();
  delay(1000);
  kneeNeoPixel.setPixelColor(0, green);
  kneeNeoPixel.show();
  delay(1000);
  kneeNeoPixel.setPixelColor(0, 0);
  kneeNeoPixel.show();
}

//flash neoPixel on knee sleeve red 
void neoPixelResetFlash(){
  int i = 0;
  //5 flashes
  for(i = 0; i != 5; ++i){
    kneeNeoPixel.setPixelColor(0, red);
    kneeNeoPixel.show();
    delay(80);
    kneeNeoPixel.setPixelColor(0, 0);
    kneeNeoPixel.show();
    delay(80);
  }
}

//glow neoPixel on knee sleeve green
void neoPixelGlow(){
  int timesToGlow = 0;
  for(timesToGlow = 0; timesToGlow != 3; ++timesToGlow){
    int i = 0;
    kneeNeoPixel.setPixelColor(0, green);
    for(i = 0; i != 100; ++i){
      kneeNeoPixel.setPixelColor(0, green);
      kneeNeoPixel.setBrightness(i);
      kneeNeoPixel.show();
      delay(5);
    }
    for(i = 100; i != -1; --i){
      kneeNeoPixel.setPixelColor(0, green);
      kneeNeoPixel.setBrightness(i);
      kneeNeoPixel.show();
      delay(5);
    }
  }
  //turn off NeoPixel, but return to brightness 100 for future NeoPixel actions
  kneeNeoPixel.setPixelColor(0, 0);
  kneeNeoPixel.show();
  kneeNeoPixel.setBrightness(100);
}

//update color of NeoPixel based on state of squat
void updateKneeNeoPixel(){
  if(squatState == 0){
    kneeNeoPixel.setPixelColor(0, 0);
    kneeNeoPixel.show();
  } else if(squatState == 1){
    kneeNeoPixel.setPixelColor(0, red);
    kneeNeoPixel.show();
  } else if(squatState == 2){
    kneeNeoPixel.setPixelColor(0, green);
    kneeNeoPixel.show();
  } else if(squatState == 3){
    kneeNeoPixel.setPixelColor(0, yellow);
    kneeNeoPixel.show();
  }
}

/**sends string representing the state of the system:
  char 1:
    0 if start and target are not set
    1 if start set and target not set
    2 if both start and target set
  char 2:
    squat mode state (0 - unattempted, 1 - failed, 2 - completed or 3 - in progress)
  chars 3-5:
    reps remaining - example: 051 means 51 reps remaining
  chars 6 and 7: set of five the user is currently on
    char 6: tens place (0 or 1)
    char 7: ones place (0-9)
  chars 8-12:
    values of the 5 reps in the set**/
  
void sendUpdate(){
  Serial.println("Sending update with data");
  String workoutUpdateToSend = "";
  
  //add char one to the string
  if((startSet == false) && (targetSet == false)){
    workoutUpdateToSend += "0";
  } else if ((startSet == true) && (targetSet == false)){
    workoutUpdateToSend += "1";
  } else {
    workoutUpdateToSend += "2";
  }

  //add char 2 to the string
  workoutUpdateToSend += squatState;
  
  //add chars 3-5 to the string
  String repsLeft = "000" + String(repsRemaining);
  //trim string to the last 3 chars
  int repsLeftLength = repsLeft.length();
  //get last 3 characters of string
  repsLeft = repsLeft.substring(repsLeftLength - 3);
  Serial.print("Reps remaining");
  Serial.println(repsLeft);
  workoutUpdateToSend += repsLeft;

  //add chars 6 and 7 to the string
  String currSetOfFive = "";
  //add in tens place
  if(setOfFives > 9){
    currSetOfFive += "1";
  } else currSetOfFive += "0";
  //add in ones place
  int onesPlace = setOfFives % 10;
  currSetOfFive += String(onesPlace);
  workoutUpdateToSend += currSetOfFive;

  //add in 5 reps
  int repStartingCurrSetOfFive = (setOfFives * 5);
  int firstRep = workout[repStartingCurrSetOfFive];
  int secondRep = workout[repStartingCurrSetOfFive+1];
  int thirdRep = workout[repStartingCurrSetOfFive+2];
  int fourthRep = workout[repStartingCurrSetOfFive+3];
  int fifthRep = workout[repStartingCurrSetOfFive+4];
  String fiveReps = "";
  fiveReps = String(firstRep) + String(secondRep) + String(thirdRep) + String(fourthRep) + String(fifthRep);
  workoutUpdateToSend += fiveReps;
  Serial.print("Workout update string: ");
  Serial.println(workoutUpdateToSend);

  //send via Bluetooth (include code)
  Serial.print("[Send] "); 
  ble.print("AT+BLEUARTTX=");
  ble.println(workoutUpdateToSend); 
  Serial.println(workoutUpdateToSend);
  delay(200); // smallest possible delay without the app reading it all as one string

  // check response status
  if (! ble.waitForOK() ) {
    Serial.println(F("Failed to send?"));
  }
  
}

void workoutStatus(){
  Serial.print("Current: ");
  Serial.print(currentPos);
  Serial.print(" Squat %: ");
  Serial.print(squatPercentage);
  Serial.print(" Squat State ");
  Serial.print(squatState);
  Serial.print(" Start: ");
  Serial.print(startPos);
  Serial.print(" Target: ");
  Serial.println(targetPos);
  
  Serial.print("Current rep: ");
  Serial.print(currentRep);
  Serial.print(" Current set of fives: ");
  Serial.print(setOfFives);
  Serial.print(" Reps remaining: ");
  Serial.print(repsRemaining);
  Serial.print(" Assigned workout :");
  Serial.println(assignedReps);
  Serial.println("");
}

void readAppInput(){
  ble.println("AT+BLEUARTRX"); // reads what the app has sent to the Arduino
  ble.readline();
  if (strcmp(ble.buffer, "OK") == 0) { // if nothing was sent then return and read what was sent again
    // no data
    return;
  } else {
    //message received from app
      //1st char = actionToTake: 0 = assign new workout, 1 = set a target position, 2 = set a start positon, 3 = reset both start and target position
      //chars 2-4: reps assigned for the workout

    String bufferInfo = (char*)ble.buffer;
    Serial.print("Buffer Info: ");
    Serial.println(bufferInfo);
    //if there's a buffer error (reps Assigned equals 0 which it should not ever)   -- there has been an error where the buffer will contain OOK in it for some reason
    if(atoi(ble.buffer)%1000 == 0){
      return;
    }else{
    
    int actionToTake = (atoi(ble.buffer)/1000); //floor of this answer
    Serial.print("Buffer: ");
    Serial.println(ble.buffer);
    Serial.print("Action: ");
    Serial.println(actionToTake);

    if(actionToTake == 0){                                  //new workout is sent to Arduino, requires reset of starting and target positions
      assignedReps = atoi(ble.buffer) % 1000;
      Serial.print("Assigned reps in Workout: ");
      Serial.println(assignedReps);
      repsRemaining = assignedReps;
      currentRep = 0;
      setOfFives = 0;
      workoutCompleted = false;
      startSet = false;
      targetSet = false;
      resetFromTarget = false;
      for(int i = 0; i != 100; ++i){
        workout[i] = 0;
      }
      workoutAssigned = true;
      neoPixelGlow();                                       //glow to indicated the workout has been received by the knee sleeve
      sendUpdate();
    } else if(actionToTake == 1){                          //start position is being set
          Serial.println("Setting start pos");
          startPos = analogRead(flexPin);
          Serial.print("Start pos: ");
          Serial.println(startPos);
          startSet = true;
          sendUpdate();
          neoPixelFlash();
      } else if(actionToTake == 2){                       //target position is being set
          Serial.println("Setting target pos");
          targetPos = analogRead(flexPin);
          Serial.print("Target pos: ");
          Serial.println(targetPos);
          targetSet = true;
          sendUpdate();
          neoPixelFlash();
          resetFromTarget = false;
      } else if(actionToTake == 3){                       //start and target positions are being reset
          Serial.println("Resetting squat start and target pos");
          startSet = false;
          targetSet = false;
          resetFromTarget = false;
          //need to prevent from allowing them to continue reps after these have been reset, exit the loop
          sendUpdate();
          neoPixelResetFlash();
      }
      
    }
  }
}

