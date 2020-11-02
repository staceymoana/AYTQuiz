
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private API_login = 'https://3tkxmc5luk.execute-api.us-east-1.amazonaws.com/dev/admin/validateLogin';
  private API_getQuizzes = "https://3tkxmc5luk.execute-api.us-east-1.amazonaws.com/dev/admin";
  private API_PublishQuiz = "https://3tkxmc5luk.execute-api.us-east-1.amazonaws.com/dev/admin";
  private getQuizQuestionsURL = "https://3tkxmc5luk.execute-api.us-east-1.amazonaws.com/dev/admin"
  private getQuizDetailsURL = "https://3tkxmc5luk.execute-api.us-east-1.amazonaws.com/dev/admin"
  private getQuestionDetailsURL = "https://3tkxmc5luk.execute-api.us-east-1.amazonaws.com/dev/adminQ"
  private getAddQuiz_URL = 'https://3tkxmc5luk.execute-api.us-east-1.amazonaws.com/dev/admin/admJoshua/createQuiz';
  private getUpdateQuiz_URL= "https://3tkxmc5luk.execute-api.us-east-1.amazonaws.com/dev/admin"
  private getTakeQuizdetailsAPI = 'https://3tkxmc5luk.execute-api.us-east-1.amazonaws.com/dev/participant'
  private submitQuizAPI = 'https://3tkxmc5luk.execute-api.us-east-1.amazonaws.com/dev/participant/submitQuizAttempt';
//nfmrn7h7kk
//3tkxmc5luk

  constructor() { }
  getsubmitQuizAPI() {
    return this.submitQuizAPI;
  }


  getTakeQuizAPI(qid) {
  
    return (`${this.getTakeQuizdetailsAPI}/${qid}/getQuizDetailsPxt`);
  }

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