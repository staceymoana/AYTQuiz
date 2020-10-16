import { Injectable, Input } from '@angular/core';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { Router } from '@angular/router';
@Injectable()



export class Routers {


    constructor(private router: Router) { }
  
    loggedUser(){
        this.router.navigate(['./createasurvey']);
    }


 
 

}