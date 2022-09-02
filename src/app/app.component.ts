import { Component, NgZone, OnInit } from '@angular/core';
import { CrudService } from 'src/app/service/crud.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
// export class AppComponent {
//   title = 'LnStore';
// }

export class AppComponent implements OnInit {
  title = 'Ln Store';
  jwtService: JwtHelperService = new JwtHelperService();
  userProfile:any ;
  GToken:any;

  constructor(private crudService: CrudService,
    private ngZone:NgZone,
    private router:Router) { }

 
  ngOnInit(): void {
    this.GToken = localStorage.getItem('token'); // เรียกใช้ token ที่แนบมากับ header ของ browser ได้เลยตรงๆ
    let tokenshowdetail = this.jwtService.decodeToken(this.GToken);
    console.log('ค่า tokenshowdetail.levelWork = '+tokenshowdetail.levelWork);
    this.userProfile = tokenshowdetail;
  }

  logout(){
    localStorage.removeItem('token');
    window.location.replace("/");
  }
}
