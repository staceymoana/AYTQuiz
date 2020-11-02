
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private API_login = 'https://nfmrn7h7kk.execute-api.us-east-1.amazonaws.com/dev/admin/validateLogin';
  private API_getQuizzes = "https://nfmrn7h7kk.execute-api.us-east-1.amazonaws.com/dev/admin";
  private API_PublishQuiz = "https://nfmrn7h7kk.execute-api.us-east-1.amazonaws.com/dev/admin";
  private getQuizQuestionsURL = "https://nfmrn7h7kk.execute-api.us-east-1.amazonaws.com/dev/admin"
  private getQuizDetailsURL = "https://nfmrn7h7kk.execute-api.us-east-1.amazonaws.com/dev/admin"
  private getQuestionDetailsURL = "https://nfmrn7h7kk.execute-api.us-east-1.amazonaws.com/dev/adminQ"
  private getAddQuiz_URL = 'https://nfmrn7h7kk.execute-api.us-east-1.amazonaws.com/dev/admin/admJoshua/createQuiz';
  private getUpdateQuiz_URL= "https://nfmrn7h7kk.execute-api.us-east-1.amazonaws.com/dev/admin"
//nfmrn7h7kk
//3tkxmc5luk

  constructor() { }


  getUpdateQuizAPI(username,qid) {
  
      return (`${this.getUpdateQuiz_URL}/${username}/${qid}/updateQuiz`);
    }
  getAddQuizAPI() {
    return this.getAddQuiz_URL;
  }

  getQuizQuestionPI() {
    return this.getQuizQuestionsURL;
  }
  getQuizDetailsAPI() {
    return this.getQuizDetailsURL;
  }
  getQuestionDetailsAPI() {
    return this.getQuestionDetailsURL;
  }
  getLoginAPI() {
    return this.API_login;
  }
  getQuizzesAPI() {
    return this.API_getQuizzes;
  }
  getPublishQuizAPI(username,qid) {
  //  return this.API_PublishQuiz;

    return (`${this.API_PublishQuiz}/${username}/${qid}/publishQuiz`);
  }


}