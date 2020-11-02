import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';
import { QuizService } from '../quiz.service';
import { Quiz } from '../quiz';
@Component({
  selector: 'app-quiz-dashboard',
  templateUrl: './quiz-dashboard.component.html',
  styleUrls: ['./quiz-dashboard.component.css']
})
export class QuizDashboardComponent implements OnInit {

  constructor(
  	private route: ActivatedRoute,
  	private router: Router,private Adminservice:AdminService,
    private quizService: QuizService
  ) { }

  ngOnInit(): void {
    this.getQuizDetails()
  }

  username = this.Adminservice.getUsername();
  quizID = this.route.snapshot.paramMap.get('quizID')
  drpValue = this.route.snapshot.url[1].path

  quizDetails: Quiz;

  loadQuizComponent(value) {
  	this.router.navigate([value]);
  }

  getQuizDetails(): void {
    this.quizService.getQuizDetailsAdmin(this.username, this.quizID)
      .subscribe(quizDetails => 
        {
          this.quizDetails = quizDetails
        }
      )
  }

}
