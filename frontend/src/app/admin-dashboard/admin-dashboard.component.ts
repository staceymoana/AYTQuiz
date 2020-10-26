import { Component, OnInit } from '@angular/core';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
interface Alert {
  type: string;
  message: string;
}
   

const ALERTS: Alert[] = [];


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
SavedQuizesArray=[];
hi;
close(alert: Alert) {
  this.alerts.splice(this.alerts.indexOf(alert), 1);
  //location.reload();
  this.SavedQuizes();
}

reset() {
  this.alerts = Array.from(ALERTS);
}
  constructor(private  http: Http) { }
  alerts: Alert[];
  private GetQuizes_URL = 'https://nfmrn7h7kk.execute-api.us-east-1.amazonaws.com/dev/admin/admJoshua/getQuizzes?isPublished=false';
  private PublishQuiz_URL;
  private qid;
  ngOnInit(): void {
    this.SavedQuizes();
  }

//get all saved quizes
  SavedQuizes(){
    let headers = new Headers({'Content-Type' : 'application/json'});
    let options = new RequestOptions({ headers: headers});
    this.http.get(this.GetQuizes_URL,options).map((res: Response) => res.json())

 .subscribe(
  data => {
this.hi=data;
 this.SavedQuizesArray.push(data);
  // console.log('success', data);
//   console.log('success array', this.SavedQuizesArray);
  // console.log('success hi', this.hi);
    //console.log('success body', data.quizID)
  },
  error => {

    console.log('oops', error)

 }
 );

  }
  //Publish saved quizes
  PublishQuiz(QuizID){
    console.log(QuizID);
     this.qid=QuizID;
     this.PublishQuiz_URL = 'https://nfmrn7h7kk.execute-api.us-east-1.amazonaws.com/dev/admin/admJoshua/'+this.qid+'/publishQuiz';
    let headers = new Headers({'Content-Type' : 'application/json'});
    let options = new RequestOptions({ headers: headers});

    //debugger;
    this.http.post(this.PublishQuiz_URL,options)

.subscribe(
  data => {
    
    const ALERTS: Alert[] = [{
      type: 'success',
      message: 'The Quiz Published Succesfuly',
    }
    ];
    this.alerts = Array.from(ALERTS);
    
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
    message: 'Please update Quiz Details',
  }
  ];
  this.alerts = Array.from(ALERTS);


}


);
  }
}
