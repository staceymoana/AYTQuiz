
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor() { }

  username = ""

  storeUsername(username){
      this.username = username
  }
  getUsername(){
    return this.username;
}
}