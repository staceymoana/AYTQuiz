import { Component, OnInit } from '@angular/core';
import { Respondent } from '../respondent';
import { RespondentService } from '../respondent.service';
import { Observable, Subject } from 'rxjs';
import { AdminService } from '../admin.service';
import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz-leaderboard',
  templateUrl: './quiz-leaderboard.component.html',
  styleUrls: ['./quiz-leaderboard.component.css']
})
export class QuizLeaderboardComponent implements OnInit {

  constructor(
  	private respondentService: RespondentService,
  	private route: ActivatedRoute,
  	private router: Router,private Adminservice:AdminService
  ) { }

  ngOnInit(): void {
  	//to initialize default quiz respondents
  	this.getQuizRespondents()

  	this.respondents$ = this.filters.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((filters: string) => this.respondentService.getQuizRespondents(this.username, this.quizID, filters)),
    );
  }

  initialRespondents: Respondent[];
  respondents$: Observable<Respondent[]>;
  username = this.Adminservice.getUsername();
  quizID = this.route.snapshot.paramMap.get('quizID')

  private filters = new Subject<string>();
  private age = ""
  private gender = ""
  private firstName = ""
  private lastName = ""
  private completeFilters = ""

  getQuizRespondents(): void {
  	this.respondentService.getQuizRespondents(this.username, this.quizID, this.completeFilters)
  	.subscribe(respondents => this.initialRespondents = respondents)
  }

  filterAge(filter: string): void {
  	this.age = filter.replace(/\s/g, "")
    this.formulateCompleteFilters()
  }

  filterGender(filter: string): void {
  	this.gender = filter.replace(/\s/g, "")
    this.formulateCompleteFilters()
  }

  filterFirstName(filter: string): void {
    this.firstName = filter.replace(/\s/g, "");
    this.formulateCompleteFilters()
  }

  filterLastName(filter: string): void {
    this.lastName = filter.replace(/\s/g, "");
    this.formulateCompleteFilters()
  }

  private formulateCompleteFilters() {
  	this.initialRespondents = null
    this.completeFilters = `${this.age};${this.gender};${this.firstName};${this.lastName}`
    this.filters.next(this.completeFilters);
  }

}
