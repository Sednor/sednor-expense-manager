import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  loginCredentials: TokenPayload = {
    email: '',
    password: ''
  };

  registerCredentials: TokenPayload = {
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  };

  public signUpForm: FormGroup;
  public signInForm: FormGroup;

  signIn: boolean = true;

  constructor(private _fb: FormBuilder, private auth: AuthenticationService, private router: Router) {
  }

  ngOnInit() {
    this.signUpForm = this._fb.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });

    this.signInForm = this._fb.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      password: ['', [Validators.required]]
    });
  }

  login() {
    const FORM_VALUES = this.signInForm.value;

    this.loginCredentials.email = FORM_VALUES.email;
    this.loginCredentials.password = FORM_VALUES.password;

    this.auth.login(this.loginCredentials).subscribe(() => {
      this.router.navigateByUrl('/profile');
    }, (err) => {
      Swal('Oops...', err.error.message, 'error');
      console.error(err);
    });
  }

  register() {
    const FORM_VALUES = this.signUpForm.value;

    this.registerCredentials.email = FORM_VALUES.email;
    this.registerCredentials.firstName = FORM_VALUES.firstName;
    this.registerCredentials.lastName = FORM_VALUES.lastName;
    this.registerCredentials.password = FORM_VALUES.password;
    this.registerCredentials.confirmPassword = FORM_VALUES.confirmPassword;

    this.auth.register(this.registerCredentials).subscribe(() => {
      this.router.navigateByUrl('/profile');
    }, (err) => {
      Swal('Oops...', err.error.message, 'error');
      console.error(err);
    });
  }
}




