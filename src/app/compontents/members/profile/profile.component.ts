import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileFrm!:FormGroup;
  userId:any;
  _idOld:any;
  userEmail:any;
  memberIdOld:any;
  fnameOld:any;
  lnameOld:any;
  sexOld:any;
  phoneNumberOld:any;
  imgMemOld:any;
  addressOld:any;
  positionOld:any;

  constructor(private router: Router,
    private ngZone:NgZone,
    private activatedRoute: ActivatedRoute,
    private crudService: CrudService) { 
      this.userId = this.activatedRoute.snapshot.paramMap.get('id');
      console.log("ค่าของ userObjId ที่แนบมาหลังผ่านการ login : "+this.userId)

      this.crudService.getProfile(this.userId).subscribe(res=>{
        console.log("ค่าของ res._id ที่แนบมา : "+res._id);
        console.log("ค่าของ res.sex ที่แนบมา : "+res.sex);
        this._idOld = res._id;
        this.userEmail = res.email;
        this.memberIdOld = res.memberId;
        this.fnameOld = res.fname;
        this.lnameOld = res.lname;
        this.phoneNumberOld = res.phoneNumber;
        this.addressOld = res.address;
        switch (res.sex) {
          case 'm':
            this.sexOld = 'ชาย';
              break;
          case 'f':
            this.sexOld = 'หญิง';
              break;
          default:
        }
      // position data
        switch (res.positionId) {
          case 'D001':
            this.positionOld = 'Project Manager';
              break;
          case 'D002':
            this.positionOld = 'Business Analyst';
              break;
          case 'D003':
            this.positionOld = 'System Anlyst';
              break;
          case 'D004':
            this.positionOld = 'Quality Assurance'
              break;
          case 'D005':
            this.positionOld = 'Tester'
              break;
          default:
        }

      })

    }

  ngOnInit(): void {
    
  }

}
