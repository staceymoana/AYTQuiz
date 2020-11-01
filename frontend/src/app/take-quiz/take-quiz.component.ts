import { Component, NgModule, OnInit } from '@angular/core';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { jsonpFactory } from '@angular/http/src/http_module';
import { Observable } from 'rxjs';
import {DatabaseService} from "../services/db.service";
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { BrowserModule } from '@angular/platform-browser';
import { forEach } from 'ngx-json-schema';
export class Participant {
  public firstName: string;
  public lastName: string;
  public age: number;
  public gender: string;
  public quizID: string;
  public attemptData: any[];
}

@Component({
  selector: 'app-createasurvey',
  templateUrl: './take-quiz.component.html',
  styleUrls: ['./take-quiz.component.css'],
  providers:[DatabaseService]
})


export class TakeQuizComponent implements OnInit {
  public detailsResponse = [];
  public pxtQuizResponse = [];
  private URLQuizID;
  private detailsAPI = 'https://pw3y4jh5q1.execute-api.us-east-1.amazonaws.com/dev/participant/'
  public contentData = [];
  public detailsForm: FormGroup;
  public quizForm: FormGroup;
  totalRecords:string
  page:Number=1
  results:string
  result:string;
  options = [
    { value: '1', label: 'Choose Gender' },
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
 
  ];
  selectedValue = '1';
  
  constructor(private http: Http, private routers:Router, public fb: FormBuilder) { 
    this.quizForm = this.fb.group({
      firstName: '',
      lastName: '',
      age: 0,
      gender: '',
      quizID: '',
      attemptData: []
    })    
  }

  ngOnInit(): void {
  }
  newParticipant = new Participant();

  getQuizDetails(quizID) {
    this.newParticipant.quizID = quizID;
    var d = document;
    //Hide and show relevent elements
    var quiz = d.getElementById("quiz");
    var details = d.getElementById("details");
    details.style.display = "none";
    quiz.style.display = "block";      

    //Get quiz data from db
    this.http.get(this.detailsAPI + quizID + "/getQuizDetailsPxt").subscribe(data => {
    this.detailsResponse.push(data.json())
    for (let i in this.detailsResponse[0].Content) {
      this.contentData.push(this.detailsResponse[0].Content[i])
    }
    //testing
    //console.log(this.detailsResponse[0])
    //console.log(this.data)
    })
  }

  createQuizJSON() {
    var d = document;
    
    //JSON object to build for 'attemptData' to send to API
    var fullJSON = [];
    
    //Loop over all question divs
    for (var i = 0; i < d.querySelectorAll('#question').length; i++) {      
      var questionElement = d.querySelector('.question_' + i);
      var questionValue = questionElement.childNodes[0].textContent;
      //Build question JSON object
      var jsonData = {"question": questionValue, "answers": []};
      //Loop over all option divs in a question div
      for (var j = 0; j < questionElement.querySelectorAll('#option').length; j++) {
        var allCheckBoxes = questionElement.querySelectorAll("input[type='checkbox']") as NodeListOf<HTMLInputElement>;
        allCheckBoxes.forEach(checkBox => {
          if(checkBox && checkBox.checked) checkBox.checked = true;
        });
        //If pxt selected a CB, add answers JSON object to question JSON object
        if (allCheckBoxes[j].checked) {
          var chosenValue = allCheckBoxes[j].value;
          var answerJSON = {"value": chosenValue}
          jsonData.answers.push(answerJSON); 
        }             
      }
      //Add question + answer JSON object to main JSON object
      fullJSON.push(jsonData);
    }
    //Assign to newParticipant
    this.newParticipant.attemptData = fullJSON;
  }


  submitQuiz() {
    var d = document;
    var quiz = d.getElementById("quiz");
    var report = d.getElementById("report");
    quiz.style.display = "none";
    report.style.display = "block";
    var submitQuizAPI = 'https://pw3y4jh5q1.execute-api.us-east-1.amazonaws.com/dev/participant/submitQuizAttempt';
    
    //Send data through API
    this.http.post(submitQuizAPI, {
      firstName: this.newParticipant.firstName,
      lastName: this.newParticipant.lastName,
      age: this.newParticipant.age,
      gender: this.newParticipant.gender,
      quizID: this.newParticipant.quizID,
      attemptData: this.newParticipant.attemptData}).subscribe(
      data => {
        this.pxtQuizResponse.push(data.json());
        console.log(this.newParticipant);
      },
      error => {
        console.log('oops', error);
    }
    );
  }

  checkForAnswer() {
    this.createQuizJSON();
    var isQuizSubmitted = false;

    for (var i = 0; i < this.newParticipant.attemptData.length; i++) {
      console.log('in for loop');
      if(this.newParticipant.attemptData[i].answers.length<1) {
        Swal.fire({
          title: 'Are you sure?',
          text: 'Question ' + i + ' is missing an answer. Are you sure you want to commit?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, submit it!'
        }).then((result) => {
          console.log('in result');
          if (result.isConfirmed) {
            Swal.fire(              
              'Submitted!',
              'Your file has been submitted.',
              'success'
            );
            console.log('in confirmed');
            console.log('submitted');
            this.submitQuiz();
            isQuizSubmitted = true;
          } 
        })
      }
      else {
        this.submitQuiz();
      } 
    }
     
    // if (isQuizSubmitted == false) {
    //   consolelog('in isQuizSubmitted if');
    //   this.submitQuiz();
    // }
  }

  getSelectedValue(value: any) {
    this.newParticipant.gender=value;
  }
  
  getURLQuizID() {
    var pageURL = window.location.href;
    this.URLQuizID = pageURL.split('participant/')[1];

    return this.URLQuizID;
  }​
}
