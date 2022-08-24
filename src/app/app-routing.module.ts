import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './compontents/members/register/register.component';
import { UpdateMemberComponent } from './compontents/members/update-member/update-member.component';
import { ProfileListComponent } from './compontents/members/profile-list/profile-list.component';
import { LoginComponent } from './compontents/members/login/login.component';
import { DeleteMemberComponent } from './compontents/members/delete-member/delete-member.component';
import { TestUploadfileComponent } from './components/test-uploadfile/test-uploadfile.component';
import { ProfileComponent } from './compontents/members/profile/profile.component';

const routes: Routes = [
  {path:'', pathMatch:'full',redirectTo:'login'},
  {path:'register',component:RegisterComponent},
  {path:'register/:reid',component:RegisterComponent},
  {path:'login',component:LoginComponent},
  {path:'login/:loginAgn',component:LoginComponent},
  {path:'profile/:id',component:ProfileComponent},
  {path:'profile-list',component:ProfileListComponent},
  {path:'update-member/:id',component:UpdateMemberComponent},
  {path:'delete-member/:id',component:DeleteMemberComponent},
  {path:'test-uploadfile',component:TestUploadfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
