import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  form: any = {
    username: null,
    password: null,
    firstName: null,
    lastName: null,
    dob: null,
    phoneNumber: null,
    email: null,
    city: null
  };
  

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onSubmit() {
    console.log(this.form)
    this.authService.register(
      this.form.username,
      this.form.password,
      this.form.firstName,
      this.form.lastName,
      this.form.dob,
      this.form.phoneNumber,
      this.form.email,
      this.form.city,
    );
  }

}
