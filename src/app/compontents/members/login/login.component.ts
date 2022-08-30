import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/service/crud.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginFrm!: FormGroup;
  userLoginID:any;
  sessionLogin:any;
  jwtService: JwtHelperService = new JwtHelperService();
  GToken:any;


  constructor(private crudService:CrudService,
    private ngZone:NgZone,
    private router:Router) { }

  ngOnInit(): void {
    this.GToken = localStorage.getItem('token'); // เรียกใช้ token ที่แนบมากับ header ของ browser ได้เลยตรงๆ
    if(this.GToken){
      let tokenshowdetail = this.jwtService.decodeToken(this.GToken);
      console.log('ค่า tokenshowdetail.id = '+tokenshowdetail.id);
      this.ngZone.run(()=>{this.router.navigateByUrl('/profile/'+tokenshowdetail.id)});
    }
  }

  onSubmit(loginFrm:any){
    
    this.crudService.login(loginFrm)
    .subscribe((data)=>{
      this.userLoginID = data.sessionUserObjID;
      console.log("ค่า data.sessionUserObjID ที่ส่ง : "+this.userLoginID);
        this.ngZone.run(()=>{this.router.navigateByUrl('/profile/'+this.userLoginID)})
      
    },(error:any)=>{
      let loginAgn='';
      window.alert("Login เข้าระบบไม่สำเร็จ");
      this.ngZone.run(()=>{this.router.navigateByUrl('/login/'+loginAgn)})
    })
  }

}
