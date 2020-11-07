import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { User } from '../../models/User';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { ToastrService } from 'ngx-toastr';

const now = new Date();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  emailFailed = false;
  loading = false;
  returnUrl: string = '/components/login';
  error = '';
  model: NgbDateStruct;
  user: User = new User();
  today: NgbDateStruct = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
  minDate: NgbDateStruct = { year: now.getFullYear() - 100, month: now.getMonth() + 1, day: now.getDate() };
  maxDate: NgbDateStruct = { year: now.getFullYear() - 18, month: now.getMonth() + 1, day: now.getDate() };

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private parserFormatter: NgbDateParserFormatter,
    private authenticationService: AuthenticationService,
    private _cdr: ChangeDetectorRef,
    private toastr: ToastrService) {
    if (!this.authenticationService.isTokenExpired()) {
      this.router.navigate(['']);
    }
  }

  ngOnInit() {
    var body = document.getElementsByTagName('body')[0];
    body.classList.add('login-page');

    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');

    this.createRegisterFormControls();
  }

  ngOnDestroy() {
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('login-page');

    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      this.toastr.error('Form is incomplete', 'Failed');
      this.error = 'Register failed, invalid credentials';
      return;
    }
    else {
      this.extractFormValues();
      this.loading = true;
      this.authenticationService.registerUser(this.user)
        .pipe(first())
        .subscribe(
          data => {
            this.toastr.success('Registration successful, Login', 'Successful');
            this.router.navigate([this.returnUrl]);
          },
          error => {
            console.log(error);
            this.toastr.error('Registration failed', 'Failed');
            if (error == "Conflict") {
              this.error = 'Register failed! Sorry, your email is already in use.';
              this.registerForm.controls['email'].setErrors({ 'incorrect': true });
              this.emailFailed = true;
            }
            else {
              this.error = 'Register failed, please try again later.';
              this.emailFailed = false;
            }
            this.loading = false;
          });
    }
  }

  createRegisterFormControls() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required],
      phone: ['', Validators.compose([Validators.pattern("[0-9 ]{10}"), Validators.required])],
      dob: ['', Validators.compose([Validators.required])],
      licenseId: ['', Validators.required],
      drivingLicense: ['', Validators.required],
      additionalIdentification: ['', Validators.required],
    });
  }

  uploadIdentityFile = (files) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    let reader = new FileReader();
    reader.readAsDataURL(fileToUpload);
    reader.onload = (event: any) => {
      this.user.additionalIdentification = {
        filename: fileToUpload.name,
        filetype: fileToUpload.type,
        value: (<string>reader.result).split(',')[1]
      }
    };
    // need to run CD since file load runs outside of zone
    this._cdr.markForCheck();
  }

  uploadDrivingLicenseFile = (files) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    let reader = new FileReader();
    reader.readAsDataURL(fileToUpload);
    reader.onload = () => {
      this.user.drivingLicense = {
        filename: fileToUpload.name,
        filetype: fileToUpload.type,
        value: (<string>reader.result).split(',')[1]
      }
    };
    // need to run CD since file load runs outside of zone
    this._cdr.markForCheck();
  }

  extractFormValues(): void {
    this.user.firstName = this.registerForm.get('firstName').value;
    this.user.lastName = this.registerForm.get('lastName').value;
    this.user.email = this.registerForm.get('email').value;
    this.user.phone = this.registerForm.get('phone').value;
    this.user.password = this.registerForm.get('password').value;
    this.user.licenseId = this.registerForm.get('licenseId').value;
    this.user.dob = this.parserFormatter.format(this.registerForm.get('dob').value);
    this.user.active = true;
    this.user.activatedDate = this.parserFormatter.format(this.today);
  }

}

