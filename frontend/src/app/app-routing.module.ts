import { NgModule } from '@angular/core';
import { HttpModule  } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { HomeComponent } from './home/home.component';
import { FormsComponent} from'./forms/forms.component';
import { from } from 'rxjs';
import { DatabaseComponent } from './database/database.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CreateasurveyComponent } from './createasurvey/createasurvey.component';
import { LoComponent } from './lo/lo.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { QuizViewComponent } from './Admin/quiz-view/quiz-view.component';
import { NewQuizComponent } from './new-quiz/new-quiz.component';

const routes: Routes = [

  {path:"",pathMatch:"full",redirectTo:"login"},
  {path:"home",component:HomeComponent},
  {path:"why-us",component:AboutUsComponent},
  {path:"forms",component:FormsComponent},
  {path:"database",component:DatabaseComponent},
  {path:"login",component:LoginComponent},
  {path:"register",component:RegisterComponent},
  {path:"createasurvey",component:CreateasurveyComponent},
  {path:"lo",component:LoComponent},
  {path:"admin/dashboard",component:DashboardComponent},
  {path:"admin/quiz-view",component:QuizViewComponent},
  {path:"NewQuiz",component:NewQuizComponent},
  {path:"contact-us",component:ContactUsComponent}

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