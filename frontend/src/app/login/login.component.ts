import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Routers } from '../services/routes';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import {Observable} from "rxjs";
import {NgForm} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[AuthService]
})
export class LoginComponent implements OnInit {
  public new_username: string;
  public new_password: string;
  public authendicated=200;
  public displayError=false;
  constructor(private http: Http, private routers:Router) { }
  //constructor(private _auth:AuthService) {}
  ngOnInit() {}


  private API_URL = 'https://nfmrn7h7kk.execute-api.us-east-1.amazonaws.com/dev/admin/validateLogin';
  loginvalidation(UserName,Password) {

  let headers = new Headers({'Content-Type' : 'application/json'});
    let options = new RequestOptions({ headers: headers});

    //debugger;
    this.http.post(this.API_URL, { username: UserName, password: Password},options)


.subscribe(
  data => {
    //console.log('success', data)
  this.displayError=false;
  this.routers.navigate(['/dashboard'])},
  error => {
    
    //console.log('oops', error)
  this.displayError=true;
}
);

  }

  

  onSubmit(form) {
  
  }


}
