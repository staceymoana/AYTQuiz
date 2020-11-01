import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Quiz } from './quiz';

@Injectable({
  providedIn: 'root'
})

export class QuizService {

  constructor(
  	private http: HttpClient,private Apiservice:ApiService
  ) { }

 

  getQuizzes(username, isPublished): Observable<Quiz[]> {  	

    return this.http.get<Quiz[]>(`${this.Apiservice.getQuizzesAPI()}/${username}/getQuizzes?isPublished=${isPublished}`).pipe(
      tap(_ => this.log(`fetched quizzes for ${username}`)),
      catchError(this.handleError<Quiz[]>('getQuizzes', []))
    );

  }
  getQuizDetails(username, QuizId): Observable<Quiz[]> {  	

    return this.http.get<Quiz[]>(`${this.Apiservice.getQuizzesAPI()}/${username}/${QuizId}/getQuizDetails`).pipe(
      tap(_ => this.log(`fetched quiz for ${QuizId}`)),
      catchError(this.handleError<Quiz[]>('getQuiz', []))
    );

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
