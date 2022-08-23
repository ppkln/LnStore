import { Component, OnInit,NgZone } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-test-uploadfile',
  templateUrl: './test-uploadfile.component.html',
  styleUrls: ['./test-uploadfile.component.css']
})
export class TestUploadfileComponent implements OnInit {
  testUpfileFrm!:FormGroup;
  selectedFiles!: FileList;
  formData: FormData = new FormData();

  constructor(private router:Router,
    private ngZone:NgZone,
    private crudservice:CrudService) { }

  ngOnInit(): void {
  }

  onSelectfile(event:any){
    this.selectedFiles = event.target.files;
  }

  onSubmit(testUpfileFrm:any){
    console.log('อยู่ใน onSubmit แล้ว (test-uploadfile.component.ts)');
    this.formData.append('memId', testUpfileFrm.memId);
    this.formData.append('email', testUpfileFrm.email);
    this.formData.append('fname', testUpfileFrm.fname);
    this.formData.append('lname', testUpfileFrm.lname);
    this.formData.append('sex', testUpfileFrm.sex);
    this.formData.append('phoneNumber', testUpfileFrm.phoneNumber);

    console.log('ค่าของ this.formData  = '+this.formData);

    const file: File | null = this.selectedFiles.item(0);
    
    if(file){
      this.formData.append('file',file);
    }
    // this.formData.forEach((valuess)=>{
    //   console.log('ผลการ forEach ของ formdata = '+valuess);
    // })
    // *********** เรียกใช้ service TestUploadfile  ***********
    this.crudservice.TestUploadfile(this.formData)
      .subscribe(null,(err)=>{
        let reid='';
        window.alert('สมัครสมาชิกไม่สำเร็จ');
        this.ngZone.run(()=>{this.router.navigateByUrl('/test-upload')});
      },()=>{
        window.alert('สมัครสมาชิกสำเร็จ (Successfully)');
        this.ngZone.run(()=>{this.router.navigateByUrl('/login')});
      })

  }

}
