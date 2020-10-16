import { NgModule } from '@angular/core';
import { HttpModule  } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { from } from 'rxjs';
import { LoginComponent } from './login/login.component';
import { CreateasurveyComponent } from './createasurvey/createasurvey.component';

import { QuizViewComponent } from './quiz-view/quiz-view.component';
import { NewQuizComponent } from './new-quiz/new-quiz.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
const routes: Routes = [

  {path:"",pathMatch:"full",redirectTo:"login"},



  
  {path:"login",component:LoginComponent},
  {path:"createasurvey",component:CreateasurveyComponent},
  {path:"dashboard",component:AdminDashboardComponent},
  {path:"quiz-view",component:QuizViewComponent},
  {path:"NewQuiz",component:NewQuizComponent},


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