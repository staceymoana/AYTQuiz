import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import {home} from '../model/quizmodel';//quiz model 
import {Qanswer} from '../model/answer';
import {NewQuiz} from '../model/quizmodel';
import {NewFormField} from '../model/quizmodel';
import { HttpClient } from '@angular/common/http';
import { jsonpFactory } from '@angular/http/src/http_module';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormGroup,FormControl } from '@angular/forms';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import { DatabaseService } from '../services/db.service';
declare const myFun:any;
declare const  addquection:any;
declare const  q1plus:any;
declare var x:any;
interface Alert {
  type: string;
  message: string;
}
   

const ALERTS: Alert[] = [];
@Component({
  selector: 'app-new-quiz',
  templateUrl: './new-quiz.component.html',
  styleUrls: ['./new-quiz.component.css'],
  providers:[DatabaseService]
})
export class NewQuizComponent implements OnInit {
  constructor(private  http: Http,_auth:DatabaseService) {}

  alerts: Alert[];
result:any;


home=new home();
Qanswer=new Qanswer();

NewFormField=new NewFormField();

NewQuiz=new NewQuiz();
dataarray=[];//quection array
addans=[];// answer form


answerArray=[];
words2 = [];


quizarr=[];
items=[];
qid;

close(alert: Alert) {
  this.alerts.splice(this.alerts.indexOf(alert), 1);
}

reset() {
  this.alerts = Array.from(ALERTS);
}








            addQuiz()
          {
          //  addquection();
         // this.quizarr.push(this.NewQuiz);
          this.dataarray.push(this.home);

 
  //this.words2.push({value: '',IsCorrect:'false'});
       // this.words2.push({value: '', IsCorrect:'true'});


        //  console.log("Quiz Name: "+this.model.Title)
      //   console.log("Quiz Description: "+this.model.description)
         //debugger
        //this.CreateQuiz(this.model.Title,this.model.description) ;
       //  this.CreateQuiz('Title','description');
     //    console.log("Quiz sdsdsdsd: ")

          }
answer:any[]=[]


        
Addquection(){
 // this.NewFormField=new NewFormField();
 // this.addans.push(this.NewFormField);


          
this.home=new home();

this.Qanswer=new Qanswer();



//this.dataarray.push(this.home,this.words2);


this.home.options=this.words2;
this.dataarray.push(this.home);




console.log('dataarray',this.dataarray);

for (let index = 0; index < this.words2.length; index++) {

 // console.log('key',(<HTMLInputElement>document.getElementById("word201")).value);
//document.getElementsByName

  //(<HTMLInputElement>document.getElementById("unitPrice")).value;
}

console.log('length',this.words2.length);
//console.log("answer array",this.words2);

//console.log("home array",this.home);
//this.result=JSON.stringify({'':this.words2});
//this.result=this.words2;
this.result=JSON.stringify({'content':this.dataarray});

          }



  model = new NewQuiz();
  //constructor(private router: Router) { }
  //constructor(private http: HttpClient) { }
  ngOnInit(): void {

   this.Qanswer=new Qanswer();
 




   this.NewQuiz=new NewQuiz();
   this.model.id=1;

  }

  private AddQuiz_URL = 'https://nfmrn7h7kk.execute-api.us-east-1.amazonaws.com/dev/admin/admJoshua/createQuiz';
  private SaveQuiz;

  CreateQuiz(Title,Description) {
    //console.log({ title: Title, description: Description},"ssss");
   // console.log("Quiz Name: "+Title)
   // console.log("Quiz Description: "+Description)
     let headers = new Headers({'Content-Type' : 'application/json'});
     let options = new RequestOptions({ headers: headers});
     this.http.post(this.AddQuiz_URL, { title: Title, description: Description},options).map((res: Response) => res.json())

  .subscribe(
   data => {

     this.qid =  data.quizID;
    this.Addquection();  this.words2.push({value: '',IsCorrect:'true'});
    // console.log('success', data)
     //console.log('success body', data.quizID)
   },
   error => {

     console.log('oops', error)

  }
  );






    }




  onSubmit(form) {



  //console.log('Answer array',this.answerArray);

  }
removeForm(index){
this.dataarray.splice(index,1);
console.log("remove index: "+index);
  }


  removeFAnwer(index){
    this.words2.splice(index,1);
    //console.log("remove answer index: "+index);
    //console.log(this.dataarray);
   // console.log(this.words2);
  }
  add() {
  //  this.home=new home();
//this.dataarray.push(this.home);


    this.words2.push({value: '',IsCorrect:'false'});

  }
/*##################################################################*/


/*##################################################################*/

  PublishData(){
 /*
let url='http://httpbin.org/post';

this.http.post(url,
  {
    Quiz:{QuizID:this.model.id,
    Title:this.model.Title,
    Description:this.model.description,
    Status: 'Published'},
    Questions:{'Question':this.dataarray,MediaLocation: ''}
    ,Options:{Option:this.words2}
  }).toPromise().then((data:any)=>{
    //console.log(data);
  this.result=JSON.stringify(data.json);
  //this.items.push(data);
  this.dataarray.push(this.words2)

  })
*/
  }
  SaveQuection(){
    this.SaveQuiz = 'https://nfmrn7h7kk.execute-api.us-east-1.amazonaws.com/dev/admin/admJoshua/'+this.qid+'/updateQuiz';

   let headers = new Headers({'Content-Type' : 'application/json'});
   let options = new RequestOptions({ headers: headers});

   console.log('reera',this.home);

   //console.log('data arry',this.dataarray);
   //debugger;
   this.http.post(this.SaveQuiz,{ 
     title: this.model.Title,
     "description": this.model.description,
     "content": this.dataarray
   },options)
   
   .subscribe(
   data => {
   
   
   
   console.log('success', data.status)
   const ALERTS: Alert[] = [{
     type: 'success',
     message: 'The Quiz Saved Succesfuly',
   }
   ];
   this.alerts = Array.from(ALERTS);
   
   //this.displayError=false;
   //this.routers.navigate(['/dashboard'])},
   error => {
   if (error.status==401) {
   //  this.displayError=true;
   const ALERTS: Alert[] = [{

     type: 'danger',
     message: 'There is an error',
   }
   ];
   this.alerts = Array.from(ALERTS);
   
   //console.log('success', error.status)
   }
   else{}
    console.log('oops', )
    const ALERTS: Alert[] = [{

     type: 'danger',
     message: 'There is an error',
   }
   ];
   this.alerts = Array.from(ALERTS);
   
   }},
   error => {
     const ALERTS: Alert[] = [{

       type: 'danger',
       message: 'Please Enter Quiz Details',
     }
     ];
     this.alerts = Array.from(ALERTS);
     
   console.log("Options",this.words2);
 
 }

   
   );
}
}