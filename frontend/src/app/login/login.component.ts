import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

import {Http, Response, RequestOptions, Headers} from '@angular/http';
import {Observable} from "rxjs";
import {NgForm} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';
import { ApiService } from '../api.service';
import Swal from 'sweetalert2';
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
  constructor(private http: Http, private routers:Router,private Adminservice:AdminService,private Apiservice:ApiService) { }
  //constructor(private _auth:AuthService) {}
  ngOnInit() {}


 
  loginvalidation(UserName,Password) {

  let headers = new Headers({'Content-Type' : 'application/json'});
    let options = new RequestOptions({ headers: headers});

    //debugger;
    this.http.post(this.Apiservice.getLoginAPI(), { username: UserName, password: Password},options)

.subscribe(
  data => {
    
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: 'success',
      title: 'Signed in successfully'
    })
    
  //  console.log('success', data.status)
  this.displayError=false;
  this.routers.navigate(['/dashboard']),
  
  
  
  this.Adminservice.storeUsername(UserName)

},



  error => {
    if (error.status==401) {
      this.displayError=true;
    }
    else{
      this.displayError=true;
    }
  
    this.displayError=true;
}
);

  }

  

  onSubmit(form) {
  
  }


}
