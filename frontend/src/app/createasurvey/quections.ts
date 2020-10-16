import { Injectable} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { jsonpFactory } from '@angular/http/src/http_module';
import { Observable } from 'rxjs';
@Injectable({
    providedIn:'any'
})



export class QuectionService {



    constructor(public httpclient: HttpClient) { }
    getData():Observable<any>
{
const url="https://sleepy-cliffs-19222.herokuapp.com/pAo7RCDG9.json"
//const url="https://randomuser.me/api/?results=100"
return this.httpclient.get<any>(url)
}
}