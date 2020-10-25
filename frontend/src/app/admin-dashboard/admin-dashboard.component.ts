import { Component, OnInit } from '@angular/core';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
SavedQuizesArray=[];
hi;
  constructor(private  http: Http) { }
  
  private GetQuizes_URL = 'https://nfmrn7h7kk.execute-api.us-east-1.amazonaws.com/dev/admin/admJoshua/getQuizzes?isPublished=false';
  private PublishQuiz_URL;
  private qid;
  ngOnInit(): void {
    this.SavedQuizes();
  }


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
    
    
  
    console.log('success', data.status)
 // this.displayError=false;
 // this.routers.navigate(['/dashboard'])
},
  error => {
    if (error.status==401) {
   //   this.displayError=true;
    }
    else{}
    console.log('oops', )

}
);
  }
}
