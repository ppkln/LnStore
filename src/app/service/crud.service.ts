import { Injectable,NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject,catchError,map } from 'rxjs';
import { Observable,throwError } from 'rxjs';
import { HttpClient,HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

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
key:any = 'rx78gundamfirst'; // key สำหรับไว้เข้ารหัส /ถอดรหัส token
jwtService: JwtHelperService = new JwtHelperService();
userProfile = new BehaviorSubject<any | null>(null);

constructor(private httpClient:HttpClient,
  private ngZone:NgZone,
  private router:Router) { }

// จัดการเกี่ยวกับ token localstorage 
//   private encrypt(txt: string): string { //เข้ารหัส token
//     return CryptoJS.AES.encrypt(txt, this.key).toString();
//   }

//   private decrypt(txtToDecrypt: string) { //ถอดรหัส token
//     return CryptoJS.AES.decrypt(txtToDecrypt, this.key).toString(CryptoJS.enc.Utf8);
//   }

//   public saveDataToken(key: string, value: string) {
//     localStorage.setItem(key, this.encrypt(value));
//   }

//   public getDataToken(key: string) {
//     let data = localStorage.getItem(key)|| "";
//     return this.decrypt(data);
//   }
//   public removeDataToken(key: string) {
//     localStorage.removeItem(key);
//   }

//   public clearDataToken() {
//     localStorage.clear();
//   }
// // สิ้นสุดการจัดการ token localstorage


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
        console.log('token จากการ login (backEnd-api) = '+res.token);
        localStorage.setItem('token',res.token);// จัดเก็บ token ลงใน localstorage ของ browser
        let tokenshowdetail = this.jwtService.decodeToken(res.token);
        console.log('ทำการ decode Token แสดง levelWork  (backEnd-api) = '+tokenshowdetail.levelWork);// decode เพื่อแสดงข้อมูล levelWork ที่เก็บไว้ใน token
        this.userProfile.next(tokenshowdetail);
        return res || {}
      }),catchError(this.handleError)
      )
  }
//********* Read profile a member *************/
  getProfile(id:any): Observable<any>{
    let API_URL = this.REST_API+'/profile/'+id;
    return this.httpClient.get(API_URL,{headers:this.HttpHeaders})
    .pipe(map((res:any)=>{
      return res || {}
    }),
      catchError(this.handleError)
    )
  }
/********* Read profile list ******************/
getProfileList(): Observable<any>{
  let API_URL = this.REST_API+'/profile-list';
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

// **** delete Member *********
deleteMember(email:any){
  let API_URL = this.REST_API+'/delete-member/'+email;
  return this.httpClient.delete(API_URL,{headers:this.HttpHeaders})
  .pipe(
    catchError(this.handleError)
  )
}


// ******** download file image  *******
downloadImage(imageName: string): Observable < Blob > {  
  let API_URL = 'http://localhost:8000/api/node-sysbackend/dist/image/img_members/'+imageName;
  return this.httpClient.get(API_URL, {  
      responseType: 'blob'  
  });  
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

