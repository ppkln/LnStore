import { Component, OnInit,NgZone } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.css']
})
export class ProfileListComponent implements OnInit {
  dataProfile:any = [];

  constructor(private router: Router,
    private ngZone:NgZone,
    private activatedRoute: ActivatedRoute,
    private crudservice:CrudService) {
     }

  ngOnInit(): void {
    console.log('localStorage.getItem => '+localStorage.getItem('token'))
    if(localStorage.getItem('token')){
      this.crudservice.getProfileList().subscribe((res)=>{
        this.dataProfile = res;
      })
    } else {
      this.ngZone.run(()=>{this.router.navigateByUrl('/login')})
    }
  }

  delete(dataObj:any, i:any){
    if (window.confirm("ต้องการลบข้อมูลชุดนี้จริงหรือไม่?")){
      this.crudservice.deleteMember(dataObj).subscribe((res)=>{
        this.dataProfile.splice(i,1);
      })
  }
  }

}
