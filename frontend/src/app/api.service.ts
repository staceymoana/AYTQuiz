
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private API_login = 'https://nfmrn7h7kk.execute-api.us-east-1.amazonaws.com/dev/admin/validateLogin';
  private API_getQuizzes = "https://nfmrn7h7kk.execute-api.us-east-1.amazonaws.com/dev/admin";
  private API_PublishQuiz = "https://nfmrn7h7kk.execute-api.us-east-1.amazonaws.com/dev/admin";
  constructor() { }
 
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