import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import {home} from '../model/quizmodel';
import {Qanswer} from '../model/quizmodel';
import {NewQuiz} from '../model/quizmodel';
import { HttpClient } from '@angular/common/http';
import { jsonpFactory } from '@angular/http/src/http_module';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormGroup } from '@angular/forms';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import { DatabaseService } from '../services/db.service';
declare const myFun:any;
declare const  addquection:any;
declare const  q1plus:any;

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
result:string;
home=new home();

Qanswer=new Qanswer();
NewQuiz=new NewQuiz();
dataarray=[];
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
          this.quizarr.push(this.NewQuiz);
          this.dataarray.push(this.home);
          this.answerArray.push(this.Qanswer);   
  
       

        //  console.log("Quiz Name: "+this.model.Title)
      //   console.log("Quiz Description: "+this.model.description)
       //  debugger
        //this.CreateQuiz(this.model.Title,this.model.description) ;
       //  this.CreateQuiz('Title','description');
     //    console.log("Quiz sdsdsdsd: ")

          }

          Addquection(){
this.home=new home();
this.dataarray.push(this.home);

console.log(this.dataarray);
console.log(this.words2);   
            //q1plus();
          }



  model = new NewQuiz();
  //constructor(private router: Router) { }
  //constructor(private http: HttpClient) { }
  ngOnInit(): void {

   this.Qanswer=new Qanswer();
   this.NewQuiz=new NewQuiz();
   this.model.id=1;

this.alerts = Array.from(ALERTS);
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
     
    this.Addquection();
    // console.log('success', data)
     //console.log('success body', data.quizID)
   },
   error => {
     
     console.log('oops', error)
  
  }
  );
  
  
  
  
  
  
    }




  onSubmit(form) {




   // console.log(this.dataarray);
  //  console.log(this.answerArray);
   
  }
removeForm(index){
this.dataarray.splice(index,1);
console.log("remove index: "+index);
  }
  addAnswer(){
    this.Qanswer=new Qanswer();
    this.answerArray.push(this.Qanswer);
    //console.log(this.dataarray);
   // console.log(this.answerArray);
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
    let Ans={ "options": [
      {
          "value": "2",
          "isCorrect": true
      },
      {
          "value": "3",
          "isCorrect": false
      }
  ]};
    this.result=JSON.stringify({'content':this.dataarray});


    console.log('reera',this.result);
    //debugger;
    this.http.post(this.SaveQuiz, { 
      title: this.model.Title,
      "description": this.model.description,
      "content": [
          {
              "question": "What is 1+1?",
              "type": "Single-choice",
              "options": [
                  {
                      "value": "2",
                      "isCorrect": true
                  },
                  {
                      "value": "3",
                      "isCorrect": false
                  }
              ]
          }
      
      ]       
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
