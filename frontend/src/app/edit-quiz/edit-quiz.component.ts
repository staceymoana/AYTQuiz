import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
@Component({
  selector: 'app-edit-quiz',
  templateUrl: './edit-quiz.component.html',
  styleUrls: ['./edit-quiz.component.css']
})
export class EditQuizComponent implements OnInit {

  
  constructor(private activatedRoute: ActivatedRoute){ }
quizid;
  ngOnInit(): void {

    this.quizid = this.activatedRoute.snapshot.paramMap.get('quizID');
    console.log('quid',this.quizid)
  }

}
