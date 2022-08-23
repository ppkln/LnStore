import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerFrm!:FormGroup;
  selectedFiles!: FileList;
  formData:FormData = new FormData;

  constructor(private router:Router,
    private ngZone:NgZone,
    private crudservice:CrudService) { }

  ngOnInit(): void {
  }

  onSelectfile(event:any){
    this.selectedFiles = event.target.files;
  }

  onSubmit(registerFrm:any){
    console.log('เข้ามาที่ onSubmit แล้ว');

    if(registerFrm.pws == registerFrm.cf_pws){
      this.formData.append('memId', registerFrm.memId);
      this.formData.append('email', registerFrm.email);
      this.formData.append('pws', registerFrm.pws);
      this.formData.append('fname', registerFrm.fname);
      this.formData.append('lname', registerFrm.lname);
      this.formData.append('sex', registerFrm.sex);
      this.formData.append('phoneNumber', registerFrm.phoneNumber);
      this.formData.append('address', registerFrm.address);
      this.formData.append('positionId', registerFrm.positionId);

      const file: File | null = this.selectedFiles.item(0);
    
      if(file){
        this.formData.append('file',file);
      }

      this.crudservice.Register(this.formData)
      .subscribe(null,(err)=>{
        let reid='';
        window.alert('สมัครสมาชิกไม่สำเร็จ');
        this.ngZone.run(()=>{this.router.navigateByUrl('/register/'+reid)});
      },()=>{
        window.alert('สมัครสมาชิกสำเร็จ (Successfully)');
        this.ngZone.run(()=>{this.router.navigateByUrl('/login')});
      })
    } else{
      window.alert('ข้อมูล Password และ Confirm Password ไม่ตรงกัน')
      return this.ngZone.run(()=>{this.router.navigateByUrl('/register')});
    }
  }





}
