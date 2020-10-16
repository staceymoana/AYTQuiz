import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

import { LoginComponent } from './login/login.component';
import { CreateasurveyComponent } from './createasurvey/createasurvey.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { QuizViewComponent } from './quiz-view/quiz-view.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NewQuizComponent } from './new-quiz/new-quiz.component';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import {NgxPaginationModule} from 'ngx-pagination';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

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
    FormlyBootstrapModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
