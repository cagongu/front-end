import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import {HttpClientModule} from '@angular/common/http';
import {httpInterceptorProviders} from '../auth.interceptor';
import {FormsModule} from '@angular/forms';
import { RegisterComponent } from './components/register/register.component';
import { ManagementComponent } from './components/management/management.component';
import { HeaderComponent } from './components/management/header/header.component';
import { ListRoomComponent } from './components/list-room/list-room.component';
import { HouseforrentManagementComponent } from './components/houseforrent-management/houseforrent-management.component';
import { RoomDetailComponent } from './components/option/room-detail/room-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ManagementComponent,
    HeaderComponent,
    ListRoomComponent,
    HouseforrentManagementComponent,
    RoomDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
