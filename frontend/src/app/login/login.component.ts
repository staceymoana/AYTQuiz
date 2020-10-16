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

  constructor(private http: Http, private routers:Router) { }
  //constructor(private _auth:AuthService) {}
  ngOnInit() {}


  private API_URL = 'https://nfmrn7h7kk.execute-api.us-east-1.amazonaws.com/dev/admin/validateLogin';
  loginvalidation(UserName,Password) {


   //let username='1';
   //let password='1';
  let headers = new Headers({'Content-Type' : 'application/json'});
    let options = new RequestOptions({ headers: headers});
   // let INFO =  Object.assign(username, password);
    //let body = JSON.stringify(INFO);

    //debugger;
    this.http.post(this.API_URL, { username: UserName, password: Password},options)
    .subscribe(data => {
   if (data.status==200) {
    this.authendicated=data.status;
    console.log('authendicated',this.authendicated);
    this.routers.navigate(['/createasurvey']);
   }
   else{
    //this.routers.navigate(['/']);
    this.authendicated=111;
  }





  })



   

  }

  

  onSubmit(form) {
  
  }


}
