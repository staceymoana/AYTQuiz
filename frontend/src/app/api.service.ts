
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



  constructor() { }
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