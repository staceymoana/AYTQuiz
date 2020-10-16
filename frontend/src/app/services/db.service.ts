import { Injectable, Input } from '@angular/core';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Injectable()



export class DatabaseService {

   // private _loginUrl="https://3tkxmc5luk.execute-api.us-east-1.amazonaws.com/dev/admin/validateLogin"
    private API_URL = 'https://nfmrn7h7kk.execute-api.us-east-1.amazonaws.com/dev/admin/validateLogin';

    constructor(private http: Http) { }
 
  
 
    CreateQuiz(title, description) {debugger
        let headers = new Headers({'Content-Type' : 'application/json'});
        let options = new RequestOptions({ headers: headers});
        let INFO =  Object.assign(title, description);
        let body = JSON.stringify(INFO);
        return this.http.post(this.API_URL, body, options).map((res: Response) => res.json());
       
      }


      private GetQuiz_URL = 'https://3tkxmc5luk.execute-api.us-east-1.amazonaws.com/dev/admin/admJoshua';
    getQuection(id: string){
      return this.http.get(this.GetQuiz_URL + id+'/getQuizDetails')
        .map((res:Response) => res.json());
    }
 
 

}