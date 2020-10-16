import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { HomeComponent } from './home/home.component';
import { FormsComponent } from './forms/forms.component';
import { DatabaseComponent } from './database/database.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CreateasurveyComponent } from './createasurvey/createasurvey.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoComponent } from './lo/lo.component';
import { HttpClient } from '@angular/common/http';
import { AdheaderComponent } from './Admin/adheader/adheader.component';
import { QuizViewComponent } from './Admin/quiz-view/quiz-view.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NewQuizComponent } from './new-quiz/new-quiz.component';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import {NgxPaginationModule} from 'ngx-pagination';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ContactUsComponent,
    AboutUsComponent,
    HomeComponent,
    FormsComponent,
    DatabaseComponent,
    LoginComponent,
    RegisterComponent,
    CreateasurveyComponent,
   
    AdheaderComponent,

    QuizViewComponent,

    NewQuizComponent,
    


 
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
