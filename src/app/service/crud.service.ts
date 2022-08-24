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
HttpHeaders = new HttpHeaders().set('Content-Type','application/json');
userLogin:any;

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

  // login 
  login(data:any): Observable<any>{
      let API_URL = this.REST_API+'/login';
      return this.httpClient.post(API_URL,data,{headers:this.HttpHeaders})
      .pipe(map((res:any)=>{
        return res || {}
      }),catchError(this.handleError)
      )
  }
//********* Read profile data member */
  getProfile(id:any): Observable<any>{
    let API_URL = this.REST_API+'/profile/'+id;
    return this.httpClient.get(API_URL,{headers:this.HttpHeaders})
    .pipe(map((res:any)=>{
      return res || {}
    }),
      catchError(this.handleError)
    )
  }
// **** update profile member ******
updateMember(id:any, data:any): Observable<any>{
  let API_URL = this.REST_API+'/update-member/'+id;
    return this.httpClient.put(API_URL, data,{headers:this.HttpHeaders})
    .pipe(
      catchError(this.handleError)
    )
}








  // ******** Test upload file only *************
  TestUploadfile(data:FormData): Observable<any>{
    let API_URL = this.REST_API+'/test-uploadfile';
    return this.httpClient.post(API_URL,data)
    .pipe(
      catchError(this.handleError)
    )
  }
  // ******** End Test upload file only *************

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

