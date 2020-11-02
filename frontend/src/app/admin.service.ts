
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor() { }

  username;

  storeUsername(username){
    localStorage.setItem('loggedUser',username);
      this.username = username
  }
  getUsername(){

   // return this.username;
return localStorage.getItem('loggedUser');
}

loggedOut()
{
  localStorage.setItem('loggedUser','');
  return  this.username = "";


}
}