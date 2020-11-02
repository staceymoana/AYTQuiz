import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { CreateasurveyComponent } from './createasurvey/createasurvey.component';
import { FormsModule} from '@angular/forms';
import { ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { QuizViewComponent } from './quiz-view/quiz-view.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NewQuizComponent } from './new-quiz/new-quiz.component';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import {NgxPaginationModule} from 'ngx-pagination';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { TakeQuizComponent } from './take-quiz/take-quiz.component';
import { OneQuetionComponent } from './new-quiz/one-quetion/one-quetion.component';
import { OneOptionComponent } from './new-quiz/one-quetion/one-option/one-option.component';
import { QuizDashboardComponent } from './quiz-dashboard/quiz-dashboard.component';
import { QuizLeaderboardComponent } from './quiz-leaderboard/quiz-leaderboard.component';
import { QuizReportComponent } from './quiz-report/quiz-report.component';
import { EditQuizComponent } from './edit-quiz/edit-quiz.component';
import { ChartsModule } from 'ng2-charts';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    CreateasurveyComponent,
    QuizViewComponent,
    NewQuizComponent,
    AdminDashboardComponent,
    TakeQuizComponent,
    QuizDashboardComponent,
    OneQuetionComponent,
    OneOptionComponent,
    QuizLeaderboardComponent,QuizReportComponent, EditQuizComponent
 
  ],
  imports: [
    BrowserModule,
    FormsModule,
HttpClientModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormlyModule.forRoot({ extras: { lazyRender: true } }),
    [BrowserModule, NgxPaginationModule],
    FormlyBootstrapModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
