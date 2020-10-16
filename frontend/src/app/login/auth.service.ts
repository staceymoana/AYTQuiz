import { Injectable, Input } from '@angular/core';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
@Injectable()



export class AuthService {

   // private _loginUrl="https://3tkxmc5luk.execute-api.us-east-1.amazonaws.com/dev/admin/validateLogin"
    private API_URL = 'https://nfmrn7h7kk.execute-api.us-east-1.amazonaws.com/dev/admin/validateLogin';

    constructor(private http: Http) { }
 
    createPerson(username, password) {
      let headers = new Headers({'Content-Type' : 'application/json'});
      let options = new RequestOptions({ headers: headers});
      let INFO =  Object.assign(username, password);
      let body = JSON.stringify(INFO);
      return this.http.post(this.API_URL, body, options).map((res: Response) => res.json());
     
    }
 
    CreateQuiz(title, description) {debugger
        let headers = new Headers({'Content-Type' : 'application/json'});
        let options = new RequestOptions({ headers: headers});
        let INFO =  Object.assign(title, description);
        let body = JSON.stringify(INFO);
        return this.http.post(this.API_URL, body, options).map((res: Response) => res.json());
       
      }



    getInfo(id: string){
      return this.http.get(this.API_URL + id)
        .map((res:Response) => res.json());
    }
 
 

}