import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

@Injectable()
export class Data {

  constructor(public storage: Storage){

  }

  clear(){
     this.storage.clear();
  }

  getUserID(){
    return this.storage.get('userID');
  }

  saveUserID(data){
    this.storage.set('userID', data);
  }

  getDevice(){
    return this.storage.get('device');
  }

  saveDevice(data){
    this.storage.set('device', data);
  }

  getSquatPositionsSet(){
    return this.storage.get('squatPositionsSet');
  }
  
  saveSquatPositionsSet(data){
    this.storage.set('squatPositionsSet', data);
  }

  getSquatModeBackground(){
    return this.storage.get('squatModeBackground');
  }

  saveSquatModeBackground(data){
    this.storage.set('squatModeBackground', data);
  }

  getRepsRemaining(){
    return this.storage.get('repsRemaining');
  }

  saveRepsRemaining(data){
    this.storage.set('repsRemaining', data);
  }

/*  getRepsAssigned(){
    return this.storage.get('repsAssigned');
  }

  saveRepsAssigned(data){
    this.storage.set('repsAssigned', data);
  }
*/
  getSetsAssigned(){
    return this.storage.get('setsAssigned');
  }

  saveSetsAssigned(data){
    this.storage.set('setsAssigned', data);
  }

  getWorkoutID(){
    return this.storage.get('workoutID');
  }

  saveWorkoutID(data){
    this.storage.set('workoutID', data);
  }

  getWorkoutTitle(){
    return this.storage.get('workoutTitle');
  }

  saveWorkoutTitle(data){
    this.storage.set('workoutTitle', data);
  }
  
  getInstructorID(){
    return this.storage.get('instructorID');
  }

  saveInstructorID(data){ //currently actually saving the instructor name
    this.storage.set('instructorID', data);
  }

  getSetOfFivesOne(){
    return this.storage.get('setOfFivesOne');
  }

  saveSetOfFivesOne(data){
    this.storage.set('setOfFivesOne', data);
  }

  getSetOfFivesTwo(){
    return this.storage.get('setOfFivesTwo');
  }

  saveSetOfFivesTwo(data){
    this.storage.set('setOfFivesTwo', data);
  }

  getSetOfFivesThree(){
    return this.storage.get('setOfFivesThree');
  }

  saveSetOfFivesThree(data){
    this.storage.set('setOfFivesThree', data);
  }

  getSetOfFivesFour(){
    return this.storage.get('setOfFivesFour');
  }

  saveSetOfFivesFour(data){
    this.storage.set('setOfFivesFour', data);
  }


  getSetOfFivesFive(){
    return this.storage.get('setOfFivesFive');
  }

  saveSetOfFivesFive(data){
    this.storage.set('setOfFivesFive', data);
  }

  getSetOfFivesSix(){
    return this.storage.get('setOfFivesSix');
  }

  saveSetOfFivesSix(data){
    this.storage.set('setOfFivesSix', data);
  }

  getSetOfFivesSeven(){
    return this.storage.get('setOfFivesSeven');
  }

  saveSetOfFivesSeven(data){
    this.storage.set('setOfFivesSeven', data);
  }

  getSetOfFivesEight(){
    return this.storage.get('setOfFivesEight');
  }

  saveSetOfFivesEight(data){
    this.storage.set('setOfFivesEight', data);
  }

  getSetOfFivesNine(){
    return this.storage.get('setOfFivesNine');
  }

  saveSetOfFivesNine(data){
    this.storage.set('setOfFivesNine', data);
  }

  getSetOfFivesTen(){
    return this.storage.get('setOfFivesTen');
  }

  saveSetOfFivesTen(data){
    this.storage.set('setOfFivesTen', data);
  }

  getSetOfFivesEleven(){
    return this.storage.get('setOfFivesEleven');
  }

  saveSetOfFivesEleven(data){
    this.storage.set('setOfFivesEleven', data);
  }

  getSetOfFivesTwelve(){
    return this.storage.get('setOfFivesTwelve');
  }

  saveSetOfFivesTwelve(data){
    this.storage.set('setOfFivesTwelve', data);
  }

  getSetOfFivesThirteen(){
    return this.storage.get('setOfFivesThirteen');
  }

  saveSetOfFivesThirteen(data){
    this.storage.set('setOfFivesThirteen', data);
  }

  getSetOfFivesFourteen(){
    return this.storage.get('setOfFivesFourteen');
  }

  saveSetOfFivesFourteen(data){
    this.storage.set('setOfFivesFourteen', data);
  }

  getSetOfFivesFifteen(){
    return this.storage.get('setOfFivesFifteen');
  }

  saveSetOfFivesFifteen(data){
    this.storage.set('setOfFivesFifteen', data);
  }

  getSetOfFivesSixteen(){
    return this.storage.get('setOfFivesSixteen');
  }

  saveSetOfFivesSixteen(data){
    this.storage.set('setOfFivesSixteen', data);
  }

  getSetOfFivesSeventeen(){
    return this.storage.get('setOfFivesSeventeen');
  }

  saveSetOfFivesSeventeen(data){
    this.storage.set('setOfFivesSeventeen', data);
  }

  getSetOfFivesEighteen(){
    return this.storage.get('setOfFivesEighteen');
  }

  saveSetOfFivesEighteen(data){
    this.storage.set('setOfFivesEighteen', data);
  }

  getSetOfFivesNineteen(){
    return this.storage.get('setOfFivesNineteen');
  }

  saveSetOfFivesNineteen(data){
    this.storage.set('setOfFivesNineteen', data);
  }

  getSetOfFivesTwenty(){
    return this.storage.get('setOfFivesTwenty');
  }

  saveSetOfFivesTwenty(data){
    this.storage.set('setOfFivesTwenty', data);
  }

//unsure about what to do with the array for now

  getWorkoutRepsPerSet(){
    return this.storage.get('workoutRepsPerSet');
  }

  saveWorkoutRepsPerSet(data){
    this.storage.set('workoutRepsPerSet', data);
  }

}


