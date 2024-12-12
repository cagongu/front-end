import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ManagementComponent } from './components/management/management.component';
import { AuthGuard } from '../AuthGuard';

const routes: Routes = [
  {
    path: 'dang-nhap',
    component: LoginComponent
  }, 
  {
    path: 'dang-ky',
    component: RegisterComponent
  },
  {
    path: '',
    component: ManagementComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'quan-ly',
    component: ManagementComponent,
    canActivate: [AuthGuard]
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
