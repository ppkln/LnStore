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
  dataProfile:any;
  GToken:any;

  constructor(private router: Router,
    private ngZone:NgZone,
    private activatedRoute: ActivatedRoute,
    private crudService: CrudService) { 
    }

  ngOnInit(): void {
    this.userId = this.activatedRoute.snapshot.paramMap.get('id');
    this.crudService.getProfile(this.userId).subscribe(res=>{
      this._idOld = res._id;
      this.userEmail = res.email;
      this.memberIdOld = res.memberId;
      this.fnameOld = res.fname;
      this.lnameOld = res.lname;
      this.sexOld = res.sex;
      this.phoneNumberOld = res.phoneNumber;
      this.addressOld = res.address;
      this.positionOld = res.positionId

      console.log('res.imgMem (ชื่อรูปภาพที่ได้หลังจากผ่าน crudService มาแล้ว) = '+ res.imgMem);
      this.imgMemOld = 'http://localhost:8000/image/img_members/'+res.imgMem;
    })
}


}
