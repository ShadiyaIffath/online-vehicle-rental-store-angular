import { Component, OnInit, ChangeDetectorRef, ViewChildren, QueryList } from '@angular/core';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControlName } from '@angular/forms';
import { first } from 'rxjs/operators';

import { User } from '../../models/User';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Observable } from 'rxjs';

const now = new Date();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit{
  registerForm: FormGroup;
  submitted = false;
  loading = false;
  returnUrl: string = '/components/login';
  error = '';
  model: NgbDateStruct;
  adminControls: boolean = false;
  user: User = new User();
  today: NgbDateStruct = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
  minDate: NgbDateStruct = { year: now.getFullYear() - 100, month: now.getMonth() + 1, day: now.getDate() };
  maxDate: NgbDateStruct = { year: now.getFullYear() - 18, month: now.getMonth() + 1, day: now.getDate() };
  public alert: IAlert;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private parserFormatter: NgbDateParserFormatter,
    private authenticationService: AuthenticationService,
    private _cdr: ChangeDetectorRef) {
    if (this.authenticationService.currentUserValue) {
      if (this.authenticationService.currentUserValue.role == 'admin') {
        this.adminControls = true;
      }
      else {
        this.router.navigate(['']);
      }
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
      console.log('form error');
      this.error = 'Register failed, invalid credentials';
      this.alert = {
        id: 3,
        type: 'warning',
        strong: 'Oh Snap!',
        message: 'Registration failed. Try again',
        icon: 'ui-1_bell-53'
      }
      return;
    }
    else {
      this.extractFormValues();
      this.loading = true;
      this.authenticationService.registerUser(this.user)
        .pipe(first())
        .subscribe(
          data => {
            this.router.navigate([this.returnUrl]);
            if(this.adminControls == false){
            this.authenticationService.registerSuccessful = true;
            }
          },
          error => {
            console.log(error);
            this.error = 'Register failed, please try again later.';
            this.loading = false;
            this.alert = {
              id: 3,
              type: 'warning',
              strong: 'Oh Snap!',
              message: 'Registration failed. Try again',
              icon: 'ui-1_bell-53'
            }
          });
    }
  }

  createRegisterFormControls() {
    if (!this.adminControls) {
      this.registerForm = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', Validators.compose([Validators.required, Validators.email])],
        password: ['', Validators.required],
        phone: ['', Validators.compose([Validators.pattern("[0-9 ]{10}"), Validators.required])],
        dob: ['', Validators.compose([Validators.required])],
        drivingLicense: ['', Validators.required],
        additionalIdentification: ['', Validators.required],
      });
    }
    else {
      this.registerForm = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', Validators.compose([Validators.required, Validators.email])],
        password: ['', Validators.required],
        phone: ['', Validators.compose([Validators.pattern("[0-9 ]{10}"), Validators.required])],
        dob: ['', Validators.compose([Validators.required])],
      });
    }

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
    this.user.dob = this.parserFormatter.format(this.registerForm.get('dob').value);
    this.user.active = true;
    this.user.activatedDate = this.parserFormatter.format(this.today);
  }
  public closeAlert(alert: IAlert) {
    this.submitted = false;
    alert = null;
  }
}

export interface IAlert {
  id: number;
  type: string;
  strong?: string;
  message: string;
  icon?: string;
}
