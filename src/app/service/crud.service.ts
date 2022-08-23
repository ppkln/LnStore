import { Injectable,NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { catchError,map } from 'rxjs/operators';
import { Observable,throwError } from 'rxjs';
import { HttpClient,HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
//home page
Home_Page: string = 'http://localhost:4200';
// node/Express API
REST_API:string = 'http://localhost:8000/api';
//HttpHeaders
// HttpHeaders = new HttpHeaders().set('Content-Type','application/json');

  constructor(private httpClient:HttpClient,
    private ngZone:NgZone,
    private router:Router) { }

  //add member
  Register(data:any): Observable<any> {
    let API_URL = this.REST_API+'/register';
    return this.httpClient.post(API_URL,data)
    .pipe(
      catchError(this.handleError)
    )
  }

  TestUploadfile(data:FormData): Observable<any>{
    let API_URL = this.REST_API+'/test-uploadfile';
    return this.httpClient.post(API_URL,data)
    .pipe(
      catchError(this.handleError)
    )
  }


  //handle Error
  handleError(error:HttpErrorResponse){
    let errorMessage ='';
    if (error.error instanceof ErrorEvent){
      // handleError client's error
      errorMessage='ฟังก์ชัน handleError แจ้งว่าเกิด client error คือรหัส '+error.error.message;
    } else {
      // handleError Server's error
      errorMessage ='ฟังก์ชัน handleError แจ้งว่าเกิด Server Error code คือรหัส '+error.status+'\n ข้อความ error คือ : ' +error.message;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
// //add member

