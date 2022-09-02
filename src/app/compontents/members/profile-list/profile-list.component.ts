import { Component, OnInit,NgZone } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { decode } from 'jose/dist/types/util/base64url';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.css']
})
export class ProfileListComponent implements OnInit {
  dataProfile:any = [];
  decodeData:any ='';

  constructor(private router: Router,
    private ngZone:NgZone,
    private activatedRoute: ActivatedRoute,
    private crudservice:CrudService) {
     }

  ngOnInit(): void {
    // let tokendetail = localStorage.getItem('token');
    // console.log('tokendetail in constructor = '+tokendetail);
    // this.crudservice.auth().subscribe((data)=>{
    //   this.decodeData = data;
    //   console.log('ค่าผลลัพท์ Data หลังจากผ่าน service auth  =' + this.decodeData);
    //   if(this.decodeData){
        this.crudservice.getProfileList().subscribe((res)=>{
          console.log('ค่า res ที่ส่งมาจาก crudservice-getprofileList ='+res);
            this.dataProfile = res;
        })
    //   }
    // })
      
  }

  delete(dataObj:any, i:any){
    if (window.confirm("ต้องการลบข้อมูลชุดนี้จริงหรือไม่?")){
      this.crudservice.deleteMember(dataObj).subscribe((res)=>{
        this.dataProfile.splice(i,1);
      })
  }
  }

}
