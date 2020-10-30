import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';
@Component({
  selector: 'app-quiz-dashboard',
  templateUrl: './quiz-dashboard.component.html',
  styleUrls: ['./quiz-dashboard.component.css']
})
export class QuizDashboardComponent implements OnInit {

  constructor(
  	private route: ActivatedRoute,
  	private router: Router,private Adminservice:AdminService
  ) { }

  ngOnInit(): void {
    console.log(this.drpValue)
  }

  username = this.Adminservice.getUsername();
  quizID = this.route.snapshot.paramMap.get('quizID')
  drpValue = this.route.snapshot.url[1].path

  loadQuizComponent(value) {
  	this.router.navigate([value]);
  }

}
