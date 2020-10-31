import { NgModule } from '@angular/core';
import { HttpModule  } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { from } from 'rxjs';
import { LoginComponent } from './login/login.component';
import { CreateasurveyComponent } from './createasurvey/createasurvey.component';
import { EditQuizComponent } from './edit-quiz/edit-quiz.component';
import { QuizViewComponent } from './quiz-view/quiz-view.component';
import { NewQuizComponent } from './new-quiz/new-quiz.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { QuizDashboardComponent } from './quiz-dashboard/quiz-dashboard.component';
import { QuizLeaderboardComponent } from './quiz-leaderboard/quiz-leaderboard.component';
import { QuizReportComponent } from './quiz-report/quiz-report.component';
import { TakeQuizComponent } from './take-quiz/take-quiz.component';

const routes: Routes = [

  {path:"",pathMatch:"full",redirectTo:"login"}, 
  {path:"login",component:LoginComponent},
  {path: "take-quiz", component:TakeQuizComponent},
 // {path:"dashboard",component:AdminDashboardComponent},
  {path:"quiz-view",component:NewQuizComponent},
  {path:"NewQuiz",component:NewQuizComponent},
  {path:"CreateQuiz",component:NewQuizComponent},
  { path: 'dashboard', component: AdminDashboardComponent },
  { path: ':quizID/dashboard', component: QuizDashboardComponent },
  { path: ':quizID/leaderboard', component: QuizLeaderboardComponent },
  { path: ':quizID/report', component: QuizReportComponent },
  
  { path: ':quizID/editQuiz', component: EditQuizComponent }
];

@NgModule({
  imports: [HttpModule, RouterModule.forRoot(routes)],
  
  exports: [RouterModule]
})
export class AppRoutingModule { }

// @NgModule({
//   imports: [ BrowserModule, HttpModule ],
//   providers: [],
//   declarations: [ AppComponent ],
//   bootstrap: [ AppComponent ]
// })
// export default class AppModule { }

// platformBrowserDynamic().bootstrapModule(AppModule);