import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './compontents/members/register/register.component';
import { UpdateMemberComponent } from './compontents/members/update-member/update-member.component';
import { ProfileListComponent } from './compontents/members/profile-list/profile-list.component';
import { LoginComponent } from './compontents/members/login/login.component';
import { DeleteMemberComponent } from './compontents/members/delete-member/delete-member.component';
import { TestUploadfileComponent } from './components/test-uploadfile/test-uploadfile.component';
import { ProfileComponent } from './compontents/members/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    UpdateMemberComponent,
    ProfileListComponent,
    LoginComponent,
    DeleteMemberComponent,
    TestUploadfileComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
