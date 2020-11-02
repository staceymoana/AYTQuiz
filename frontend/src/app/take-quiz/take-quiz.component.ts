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
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

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
  public demoNeeded: boolean = false;
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
  newParticipant = new Participant();
  
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
    this.checkForDemographics();
  }
  

  checkForDemographics() {
    var quizID = this.getURLQuizID();
    var quizJSON = [];
    this.http.get(this.detailsAPI + quizID + "/getQuizDetailsPxt").subscribe(data => {
      quizJSON.push(data.json())
      if(quizJSON[0].IsDemographicSelected) {
        this.demoNeeded = true;
      }
    })
  }

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
        var allInputBoxes = questionElement.querySelectorAll("input[type='checkbox'], input[type='radio']") as NodeListOf<HTMLInputElement>;
        allInputBoxes.forEach(inputBox => {
          if(inputBox && inputBox.checked) inputBox.checked = true;
        });
        //If pxt selected a CB, add answers JSON object to question JSON object
        if (allInputBoxes[j].checked) {
          var chosenValue = allInputBoxes[j].value;
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
        if (this.pxtQuizResponse.length == 1) {
          this.pxtQuizResponse[0] = data.json();
        } else {
          this.pxtQuizResponse.push(data.json());
        }
      },
      error => {
        console.log('oops', error);
    }
    );
  }

  checkForAnswer() {
    this.createQuizJSON();
    for (var i = 0; i < this.newParticipant.attemptData.length; i++) {
      var valid = false;
      if(this.newParticipant.attemptData[i].answers.length == 0) {
        if (!valid) {
          var num = i += 1;
          //alert('Question ' + num + ' is missing an answer.');
          Swal.fire({
            title: 'Sorry!',
            text: 'Question ' + num + ' is missing an answer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EC580E',
            cancelButtonColor: '#EC580E',
            confirmButtonText: 'OK'
          }).then((result) => {
          })
        }
      } else {
        valid = true;
      }
    }
    if (valid) {
      this.submitQuiz();
    }
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
