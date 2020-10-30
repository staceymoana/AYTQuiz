import { Component, OnInit } from '@angular/core';
import {Http, Response, RequestOptions, Headers} from '@angular/http';

interface Alert {
  type: string;
  message: string;
}
const ALERTS: Alert[] = [];
@Component({
  selector: 'app-new-quiz',
  templateUrl: './new-quiz.component.html',
  styleUrls: ['./new-quiz.component.css']
})
export class NewQuizComponent implements OnInit {
  alerts: Alert[];
  constructor(private  http: Http) { }

  queArr : any = [{
    id : this.randomString(8),
    indexNumber : 0
  }];

  buttonActive :any = true;
  
  title : any = '';
  description : any = '';
  content : any = [];

  allQueData: any = [];
  allData: any = {
    title : '',
    description : '',
    content : [],
  };
  close(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }
  
  reset() {
    this.alerts = Array.from(ALERTS);
  }
  ngOnInit(): void {

    
  }



  addQuetionInput(){
    this.queArr.push({
      id : this.randomString(8),
      indexNumber : this.queArr.length + 1,
    })
  }

  getValue(){

    if((this.title.trim()) && (this.description.trim())){
      this.buttonActive = false;
    }else{
      this.buttonActive = true;
    }

    this.allData.title = this.title;
    this.allData.description = this.description;
    this.allData.content = this.content;
    //console.log(this.allData);
  


  }

  countChangedHandler(data){

    this.allQueData[data.i] = data;
    let content = []
    this.allQueData.forEach(function (value) {
      if (value.isShow == true) {
        content.push({ question: value.question, type: value.type, options: value.options })
      }
    });
    this.content = content;
    this.getValue();
  }

  randomString(length) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ'.split('');

    if (! length) {
        length = Math.floor(Math.random() * chars.length);
    }

    var str = '';
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}
  private AddQuiz_URL = 'https://nfmrn7h7kk.execute-api.us-east-1.amazonaws.com/dev/admin/admJoshua/createQuiz';


  CreateQuiz(Title,Description) {
    //console.log({ title: Title, description: Description},"ssss");
   // console.log("Quiz Name: "+Title)
   // console.log("Quiz Description: "+Description)
     let headers = new Headers({'Content-Type' : 'application/json'});
     let options = new RequestOptions({ headers: headers});
     this.http.post(this.AddQuiz_URL, { title: Title, description: Description},options).map((res: Response) => res.json())

  .subscribe(
   data => {

     //this.qid =  data.quizID;
     console.log(this.allData);
     console.log('success', data)
     //console.log('success body', data.quizID)
   },
   error => {

     console.log('oops', error)

  }
  );






    }
    addQuiz(){
      this.CreateQuiz(this.title,this.description);
    }

    PublishData(){}
    SaveQuestion(){}

}
