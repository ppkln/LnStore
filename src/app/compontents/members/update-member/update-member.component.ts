import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-update-member',
  templateUrl: './update-member.component.html',
  styleUrls: ['./update-member.component.css']
})
export class UpdateMemberComponent implements OnInit {
  updateMemberFrm!:FormGroup;
  selectedFiles!: FileList;
  userLoginID:any;
  userEmail:any;
  _idOld:any;
  memberIdOld:any;
  fnameOld:any;
  lnameOld:any;
  phoneNumberOld:any;
  imgMemOld:any;
  addressOld:any;
  positionOld:any;


  constructor(private router: Router,
    private ngZone:NgZone,
    private activatedRoute: ActivatedRoute,
    private crudservice:CrudService) { 
      this.userLoginID = this.activatedRoute.snapshot.paramMap.get('id'); //เป็นการนำข้อมูล parameter ที่แนบมากับ URL มาใช้งาน 
      // this.Ids = this.route.snapshot.queryParamMap.get('Id');
    }

  ngOnInit(): void {
    this.crudservice.getProfile(this.userLoginID).subscribe(res=>{ // เรียกข้อมูล profile เดิมก่อนการ update ของ member ออกมาเพื่อนำไปใส่ใน updateMemberFrm 
      // สร้างตัวแปรสำหรับแต่ละ element ของ updateMemberFrm 
     this._idOld = res._id;
     this.userEmail = res.email;
     this.memberIdOld = res.memberId;
     this.fnameOld = res.fname;
     this.lnameOld = res.lname;
     this.phoneNumberOld = res.phoneNumber;
     this.addressOld = res.address;
     this.positionOld = res.positionId;
   })
  }


  onUpdate(updateMemberFrm:any){
    console.log('เข้ามาที่ onUpdate แล้ว');

      this.crudservice.updateMember(this.userLoginID,updateMemberFrm)
      .subscribe(null,(err)=>{
        window.alert('ปรับปรุงข้อมูลสมาชิกไม่สำเร็จ');
        this.ngZone.run(()=>{this.router.navigateByUrl('/login')});
      },()=>{
        this.ngZone.run(()=>{this.router.navigateByUrl('/profile/'+this.userLoginID)});
      })

  }

}
