import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { ApiService } from '../api.service';
import Swal from 'sweetalert2';
import { Quiz } from '../quiz';
import { QuizService } from '../quiz.service';
import { AdminService } from '../admin.service';
@Component({
  selector: 'app-edit-quiz',
  templateUrl: './edit-quiz.component.html',
  styleUrls: ['./edit-quiz.component.css']
})
export class EditQuizComponent implements OnInit {

  
  constructor(private activatedRoute: ActivatedRoute,
    private quizService: QuizService,
    private Adminservice:AdminService,
    private Apiservice:ApiService){ }



    
quizid; 
allQueData: any = [];
username = this.Adminservice.getUsername();
allData: any = {
  title : '',
  description : '',
  content : [],
};
QuizDetails: Quiz[];
  ngOnInit(): void {

    this.quizid = this.activatedRoute.snapshot.paramMap.get('quizID');
    console.log('quid',this.quizid);
    this.getQuizDetails();   
    
    
  }
  addQuetionInput(){};
  SaveQuestion(){};
  PublishQuiz(){};
  getValue(){};
  addQuiz(){};
  getQuizDetails(): void {  	

    this.quizService.getQuizDetails(this.username, this.quizid)
      .subscribe(quizzes => {this.allQueData = quizzes}
        
        
        );

  };
  
  
}
