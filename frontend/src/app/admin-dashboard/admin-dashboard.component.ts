import { Component, OnInit } from '@angular/core';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Quiz } from '../quiz';
import { QuizService } from '../quiz.service';
import { AdminService } from '../admin.service';
import { ApiService } from '../api.service';
import Swal from 'sweetalert2';
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
 publishedQuizzesCount;
qid;

hi;
close(alert: Alert) {
  this.alerts.splice(this.alerts.indexOf(alert), 1);
  //location.reload();
 // this.SavedQuizes();
}

reset() {
  this.alerts = Array.from(ALERTS);
}
  constructor(private  http: Http,private route: ActivatedRoute,
    
    private quizService: QuizService,
    private Adminservice:AdminService,
    private Apiservice:ApiService
    ) { }

  username = this.Adminservice.getUsername();

  publishedQuizzes: Quiz[];
  unpublishedQuizzes: Quiz[];
  getPublishedQuizzes(): void {  	

    this.quizService.getQuizzes(this.username, "True")
      .subscribe(quizzes => this.publishedQuizzes = quizzes)
      // console.log('publish quizzes',this.publishedQuizzesCount)
       
  }
  getunpublishedQuizzes(): void {  	

    this.quizService.getQuizzes(this.username, "False")
      .subscribe(quizzes => this.unpublishedQuizzes = quizzes)
      
  }





  alerts: Alert[];

  ngOnInit(): void {
 //   this.SavedQuizes();

 this.getPublishedQuizzes();
 this.getunpublishedQuizzes();
  }

  //Publish saved quizes
  PublishQuiz(QuizID){
    console.log(QuizID);
     this.qid=QuizID;
   //  this.PublishQuiz_URL = 'https://nfmrn7h7kk.execute-api.us-east-1.amazonaws.com/dev/admin/admJoshua/'+this.qid+'/publishQuiz';

    let headers = new Headers({'Content-Type' : 'application/json'});
    let options = new RequestOptions({ headers: headers});
console.log(this.Apiservice.getPublishQuizAPI(this.username,this.qid));
    //debugger;
    this.http.post(this.Apiservice.getPublishQuizAPI(this.username,this.qid),options)

.subscribe(
  data => {
    
    Swal.fire(
      'Good job!',
      'Your quizzes successfully Published!',
      'success'
    ); 
    this.getPublishedQuizzes();
    this.getunpublishedQuizzes();
    error => {
      if (error.status==401) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Please Update Quiz Details!',
          footer: ''
        });
      }
      else{}
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please Update Quiz Details!',
        footer: ''
      });
      
      }},
error => {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Please Update Quiz Details!',
    footer: ''
  });


}


);
  }
  accesslinkbtn(link){
    Swal.fire({
      title: '<strong>Generic Link</strong>',
     
      html:
      '<a href='+link+'>'+link+'</a> ' ,
       
      
      
  
    })
  }



}
