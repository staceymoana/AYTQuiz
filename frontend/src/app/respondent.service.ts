import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Respondent } from './respondent';

@Injectable({
  providedIn: 'root'
})

export class RespondentService {

  constructor(
  	private http: HttpClient
  ) { }

  //private variables
  private splitParameters = []
  private resultsAPI = ""
  private baseURL = "https://3tkxmc5luk.execute-api.us-east-1.amazonaws.com/dev/admin"
  private completeURL = ""

  getQuizRespondents(username, quizID, parameters): Observable<Respondent[]> {

    this.splitParameters = parameters.split(';')
    this.resultsAPI = this.determineAPI(this.splitParameters)
    this.completeURL = this.formulateCompleteURL(this.resultsAPI, username, quizID, this.splitParameters)

    return this.http.get<Respondent[]>(this.completeURL).pipe(
      tap(_ => this.log(`fetched respondents for ${quizID}`)),
      catchError(this.handleError<Respondent[]>('getQuizResults', []))
    );
  }

  private determineAPI(splitParameters) {

    //[0] - age
    //[1] - gender
    //[2] - firstName
    //[3] - lastName
   
    if (splitParameters[0] && !splitParameters[1] && !splitParameters[2] && !splitParameters[3])
      return "getLeaderboardByAge"
    else if (!splitParameters[0] && splitParameters[1] && !splitParameters[2] && !splitParameters[3])
      return "getLeaderboardByGender"
    else if (!splitParameters[0] && !splitParameters[1] && splitParameters[2] && !splitParameters[3])
      return "getLeaderboardByFirstName"
    else if (!splitParameters[0] && !splitParameters[1] && !splitParameters[2] && splitParameters[3])
      return "getLeaderboardByLastName"
    else if (splitParameters[0] && splitParameters[1] && !splitParameters[2] && !splitParameters[3])
      return "getLeaderboardByAgeGender"
    else if (splitParameters[0] && !splitParameters[1] && splitParameters[2] && !splitParameters[3])
      return "getLeaderboardByAgeFirstName"
    else if (splitParameters[0] && !splitParameters[1] && !splitParameters[2] && splitParameters[3])
      return "getLeaderboardByAgeLastName"
    else if (!splitParameters[0] && splitParameters[1] && splitParameters[2] && !splitParameters[3])
      return "getLeaderboardByGenderFirstName"
    else if (!splitParameters[0] && splitParameters[1] && !splitParameters[2] && splitParameters[3])
      return "getLeaderboardByGenderLastName"
    else if (!splitParameters[0] && !splitParameters[1] && splitParameters[2] && splitParameters[3])
      return "getLeaderboardByFirstNameLastName"
    else if (splitParameters[0] && splitParameters[1] && splitParameters[2] && !splitParameters[3])
      return "getLeaderboardByAgeGenderFirstName"
    else if (splitParameters[0] && splitParameters[1] && !splitParameters[2] && splitParameters[3])
      return "getLeaderboardByAgeGenderLastName"
    else if (splitParameters[0] && !splitParameters[1] && splitParameters[2] && splitParameters[3])
      return "getLeaderboardByAgeFirstNameLastName"
    else if (!splitParameters[0] && splitParameters[1] && splitParameters[2] && splitParameters[3])
      return "getLeaderboardByGenderFirstNameLastName"
    else if(splitParameters[0] && splitParameters[1] && splitParameters[2] && splitParameters[3])
      return "getLeaderboardByAgeGenderFirstNLastN"
    else
      return "getQuizRespondents"
  }

  private formulateCompleteURL(resultsAPI, username, quizID, splitParameters) {

    switch(resultsAPI) {
      case "getLeaderboardByAge": {
        return `${this.baseURL}/${username}/${quizID}/${resultsAPI}?age=${splitParameters[0]}`
      }
      case "getLeaderboardByGender": {
        return `${this.baseURL}/${username}/${quizID}/${resultsAPI}?gender=${splitParameters[1]}`        
      }
      case "getLeaderboardByFirstName": {
        return `${this.baseURL}/${username}/${quizID}/${resultsAPI}?firstName=${splitParameters[2]}`
      }
      case "getLeaderboardByLastName": {
        return `${this.baseURL}/${username}/${quizID}/${resultsAPI}?lastName=${splitParameters[3]}`
      }
      case "getLeaderboardByAgeGender": {
        return `${this.baseURL}/${username}/${quizID}/${resultsAPI}?age=${splitParameters[0]}&gender=${splitParameters[1]}`
      }
      case "getLeaderboardByAgeFirstName": {
        return `${this.baseURL}/${username}/${quizID}/${resultsAPI}?age=${splitParameters[0]}&firstName=${splitParameters[2]}`
      }
      case "getLeaderboardByAgeLastName": {
        return `${this.baseURL}/${username}/${quizID}/${resultsAPI}?age=${splitParameters[0]}&lastName=${splitParameters[3]}`
      }
      case "getLeaderboardByGenderFirstName": {
        return `${this.baseURL}/${username}/${quizID}/${resultsAPI}?gender=${splitParameters[1]}&firstName=${splitParameters[2]}`
      }
      case "getLeaderboardByGenderLastName": {
        return `${this.baseURL}/${username}/${quizID}/${resultsAPI}?gender=${splitParameters[1]}&lastName=${splitParameters[3]}`
      }
      case "getLeaderboardByFirstNameLastName": {
        return `${this.baseURL}/${username}/${quizID}/${resultsAPI}?firstName=${splitParameters[2]}&lastName=${splitParameters[3]}`
      }
      case "getLeaderboardByAgeGenderFirstName": {
        return `${this.baseURL}/${username}/${quizID}/${resultsAPI}?age=${splitParameters[0]}&gender=${splitParameters[1]}&firstName=${splitParameters[2]}`
      }
      case "getLeaderboardByAgeGenderLastName": {
        return `${this.baseURL}/${username}/${quizID}/${resultsAPI}?age=${splitParameters[0]}&gender=${splitParameters[1]}&lastName=${splitParameters[3]}`
      }
      case "getLeaderboardByAgeFirstNameLastName": {
        return `${this.baseURL}/${username}/${quizID}/${resultsAPI}?age=${splitParameters[0]}&firstName=${splitParameters[2]}&lastName=${splitParameters[3]}`
      }
      case "getLeaderboardByGenderFirstNameLastName": {
        return `${this.baseURL}/${username}/${quizID}/${resultsAPI}?gender=${splitParameters[1]}&firstName=${splitParameters[2]}&lastName=${splitParameters[3]}`
      }
      case "getLeaderboardByAgeGenderFirstNLastN": {
        return `${this.baseURL}/${username}/${quizID}/${resultsAPI}?age=${splitParameters[0]}&gender=${splitParameters[1]}&firstName=${splitParameters[2]}&lastName=${splitParameters[3]}`
      }
      case "getQuizRespondents": {
        return `${this.baseURL}/${username}/${quizID}/${resultsAPI}`
      }
    }

  }

  //private methods
  private log(message: string) {
    console.log(message);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      return of(result as T);
    };
  }
}
