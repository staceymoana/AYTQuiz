import { Component, OnInit } from '@angular/core';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import Swal from 'sweetalert2';
import { ApiService } from '../api.service';import { AdminService } from '../admin.service';import { Router } from '@angular/router';
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
  isDemographic=true;
  displayAlert=false;
  dontpublish=false;
  doesQuestionHaveAnswer=false;
  isDemographicSelected;
  alerts: Alert[];
  constructor(private  http: Http,private Apiservice:ApiService,private Adminservice:AdminService, private routers:Router) { }
  username = this.Adminservice.getUsername();
  qid;
  queArr : any = [{
    id : this.randomString(8),
    indexNumber : 0
  }];
  buttonHide :any = false;
  buttonActive :any = true;
  publishActive:any=true;
  private PublishQuiz_URL;
  private UpdateQuiz_URL;
  title : any = '';
  description : any = '';
  content : any = [];

  allQueData: any = [];
  allData: any = {
    title : '',
    description : '',
    isDemographicSelected : '',
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
    this.allData.isDemographicSelected=this.isDemographic;
    console.log(this.allData);
    
    this.buttonHide= true;


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
 

  CreateQuiz(Title,Description) {
 
     let headers = new Headers({'Content-Type' : 'application/json'});
     let options = new RequestOptions({ headers: headers});
     this.http.post(this.Apiservice.getAddQuizAPI(), { title: Title, description: Description},options).map((res: Response) => res.json())

  .subscribe(
   data => {

     //this.qid =  data.quizID;
     console.log(this.allData);
     console.log('success', data)
     this.qid=data.quizID;

    //console.log('success quid', data.quizID)
   },
   error => {

     console.log('oops', error)

  }
  );






    }
    addQuiz(){
      this.getValue();
      this.CreateQuiz(this.title,this.description);
    }

    PublishQuiz(){
  //this.UpdateQuiz();

  let headers = new Headers({'Content-Type' : 'application/json'});
  let options = new RequestOptions({ headers: headers});
  console.log(this.Apiservice.getPublishQuizAPI(this.username,this.qid));

  //debugger;
  this.http.post(this.Apiservice.getPublishQuizAPI(this.username,this.qid),options)

.subscribe(
data => {
  
  Swal.fire(
    'Good job!',
    'Your quizzes successfully published!',
    'success'
  ); 
  this.routers.navigate(['/dashboard']),
  
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
Swal.fire({
  icon: 'error',
  title: 'Oops...',
  text: 'Please Add more Questions!',
  footer: ''
});


}


); 




      if (!this.dontpublish) {
      
   
      } 
    }

  onisDemographicSelectedChanged(isDemographicSelected:boolean){
    this.allData.isDemographicSelected=isDemographicSelected;

    console.log('isDemographicSelected.checkedor not',isDemographicSelected)
  }
  SaveQuestion(){
    if (!this.allData.content.length) {
      //console.log('empty',this.allData.content)    
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please Add more Questions!',
        footer: ''
      });

    
    } else {
      console.log('saving data',this.allData);
    this.UpdateQuiz();
    }
   
  }

    UpdateQuiz(){

      this.displayAlert = false
      for (let index = 0; index < this.allData.content.length; index++) {
        this.doesQuestionHaveAnswer = false
        for (let answersloop = 0; answersloop < this.allData.content[index].options.length; answersloop++) {
          if (this.allData.content[index].options[answersloop].isCorrect==true) {
            this.doesQuestionHaveAnswer = true
            break;
          }
        }

        if(!this.doesQuestionHaveAnswer){
          this.displayAlert = true
          break;
        }
      }

      if(this.displayAlert){
        Swal.fire(
          'Error',
          'Please ensure that all questions have at least one answer',
          'question'
        )
        this.dontpublish=true;
        
      }
      else{

        console.log('updated data',this.allData);
     //   this.UpdateQuiz_URL = 'https://nfmrn7h7kk.execute-api.us-east-1.amazonaws.com/dev/admin/admJoshua/'+this.qid+'/updateQuiz';
        let headers = new Headers({'Content-Type' : 'application/json'});
        const body = this.allData;
  
       // const body = ;
  
  
        let options = new RequestOptions({ headers: headers});
           
          this.http.post(this.Apiservice.getUpdateQuizAPI(this.username,this.qid), body, { headers }).subscribe(data => {
             
            Swal.fire(
              'Good job!',
              'Your quizzes successfully saved!',
              'success'
            ); this.publishActive = false;
          });
      }


}




        test(){
          console.log('optionsssss',this.allData.content.options);

      
          this.displayAlert = false
          for (let index = 0; index < this.allData.content.length; index++) {
            this.doesQuestionHaveAnswer = false
            for (let answersloop = 0; answersloop < this.allData.content[index].options.length; answersloop++) {
              if (this.allData.content[index].options[answersloop].isCorrect==true) {
                this.doesQuestionHaveAnswer = true
                break;
              }
            }

            if(!this.doesQuestionHaveAnswer){
              this.displayAlert = true
              break;
            }
          }

          if(this.displayAlert){
            Swal.fire(
              'Error',
              'That thing is still around?',
              'question'
            )
          }
          else{
            Swal.fire(
              'Save',
              'That thing is still around?',
              'question'
            )
          }

       
        }

}