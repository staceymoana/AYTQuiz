import { Component, OnInit } from '@angular/core';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import Swal from 'sweetalert2';

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
  isDemographicSelected;
  alerts: Alert[];
  constructor(private  http: Http) { }
  qid;
  queArr : any = [{
    id : this.randomString(8),
    indexNumber : 0
  }];
  buttonHide :any = false;
  buttonActive :any = true;
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
      //console.log(QuizID);
      
       this.PublishQuiz_URL = 'https://nfmrn7h7kk.execute-api.us-east-1.amazonaws.com/dev/admin/admJoshua/'+this.qid+'/publishQuiz';
      let headers = new Headers({'Content-Type' : 'application/json'});
      let options = new RequestOptions({ headers: headers});
  
      //debugger;
      this.http.post(this.PublishQuiz_URL,options)
  
  .subscribe(
    data => {
      
      Swal.fire(
        'Good job!',
        'Your quizzes successfully published!',
        'success'
      ); 
      
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
  
  
  );}

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
      console.log('updated data',this.allData);
      this.UpdateQuiz_URL = 'https://nfmrn7h7kk.execute-api.us-east-1.amazonaws.com/dev/admin/admJoshua/'+this.qid+'/updateQuiz';
      let headers = new Headers({'Content-Type' : 'application/json'});
      const body = this.allData;

     // const body = ;


      let options = new RequestOptions({ headers: headers});
         
        this.http.post(this.UpdateQuiz_URL, body, { headers }).subscribe(data => {
           
          Swal.fire(
            'Good job!',
            'Your quizzes successfully saved!',
            'success'
          ); 
        });}




        test(){
      
          console.log(this.isDemographic)
          // if (!this.allData.content.length) {
          //   console.log('empty',this.allData.content)    
          //   Swal.fire({
          //     icon: 'error',
          //     title: 'Oops...',
          //     text: 'Please Add more Questions!',
          //     footer: ''
          //   });

          
          // } else {
          
          // }
        }

}