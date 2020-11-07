import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

import { User } from 'app/models/User';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { UsersService } from 'app/services/users/users.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  confirmationCode: string ='';
  error: string ='';
  mismatch: boolean = false;
  samePassword: boolean = false;
  changePassword: boolean = false;
  loaded: Promise<boolean>;
  emailFailed: boolean = false;
  passwordConfirm: FormGroup;
  accountForm: FormGroup;
  passwordForm: FormGroup;
  loading = false;
  submitted = false;
  accountId: number;
  account: User = new User();
  fieldTextType: boolean;

  constructor(private userService: UsersService,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.accountForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      dob: [{ value: '', disabled: true }, Validators.required],
      licenseId : ['', Validators.required]
    });
    this.passwordForm = this.formBuilder.group({
      password: ['', Validators.required],
      repeat: ['', Validators.required],
    });
    this.passwordConfirm = this.formBuilder.group({
      confirm: ['', Validators.required]
    });

    var body = document.getElementsByTagName('body')[0];
    body.classList.add('login-page');

    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');

    this.spinner.show();
    this.accountId = Number(this.authenticationService.currentUserValue.nameid);
    this.getAccountDetails();

  }

  getAccountDetails(){
    this.userService.getAccountDetails(this.accountId).subscribe((data) => {
      this.account = data;
      this.loaded = Promise.resolve(true);
      this.createFormControls(data);
      this.spinner.hide();
    }, err => {
      this.toastr.error('An error occured.');
      this.router.navigate(['']);
    });
  }

  async createFormControls(user: User) {
    if (await this.loaded == true) {
      let dob = moment(this.account.dob);
      this.accountForm = new FormGroup({
        firstName: new FormControl(this.account.firstName, [Validators.required, Validators.maxLength(25)]),
        lastName: new FormControl(this.account.lastName, [Validators.required, Validators.maxLength(25)]),
        email: new FormControl(this.account.email, Validators.compose([Validators.required, Validators.email])),
        phone: new FormControl(0 + '' + this.account.phone, Validators.compose([Validators.pattern("[0-9 ]{10}"), Validators.required])),
        dob: new FormControl({ value: moment(dob).format('yyyy-MM-DD'), disabled: true }, [Validators.required]),
        licenseId: new FormControl(this.account.licenseId, [Validators.required]),
      });
      this.passwordForm = new FormGroup({
        password: new FormControl('', [Validators.required]),
        repeat: new FormControl('', Validators.required)
      });
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.accountForm.controls; }

  get p() { return this.passwordForm.controls; }

  get v() {return this.passwordConfirm.controls; }

  onAccountEdit() {
    if (this.accountForm.invalid) {
      this.toastr.error('Form is incomplete', 'Failed');
      return;
    }
    this.extractAccountFormValues();
    this.spinner.show();
    this.userService.updateAccount(this.account)
      .pipe(first())
      .subscribe(
        data => {
          this.toastr.success('Account update successful', 'Successful');
          this.emailFailed = false;
          this.getAccountDetails();
        },
        error => {
          console.log(error);
          this.toastr.error('Account update failed', 'Failed');
          if (error == "Conflict") {
            this.accountForm.controls['email'].setErrors({ 'incorrect': true });
            this.emailFailed = true;
          }
          else {
            this.emailFailed = false;
          }
          this.loading = false;
        });
    this.spinner.hide();
  }

  onPasswordChangeSubmit() {
    if(this.validatePasswordCheck()){
      let user = {
        email : this.account.email,
        firstName : this.account.firstName,
        lastName: this.account.lastName
      }
      this.userService.requestPasswordUpdate(user)
      .subscribe( data=>{
        this.toastr.info('Please enter confirmation code');
        this.changePassword = true;
      }, err =>{
        this.toastr.error('An error occured try again later');
        this.changePassword = false;
      });
    }else{
      this.toastr.error('Invalid details entered');
    }
  }

  validatePasswordCheck(){
    let newPassword = this.passwordForm.get('password').value;
    let confirmPassword = this.passwordForm.get('repeat').value;
    this.error = '';
    this.samePassword = false;
    this.mismatch = false;
    if(this.passwordForm.invalid || newPassword == null || newPassword == '' || confirmPassword == ''|| confirmPassword == null){
      this.error = 'Invalid password details';
      return false;
    }
    if(newPassword == this.account.password){
       this.samePassword = true;
       return false;
    }
    else{
      this.samePassword = false;
    }
    if(confirmPassword != newPassword){
      this.mismatch = true;
      return false;
    }
    else{
      this.mismatch = false;
    }
    return true;
  }

  onConfirmation(){
    if(this.validateConfirmationCode){
      let user = {
        id : this.account.id,
        password : this.passwordConfirm.get('confirm').value,
      }
      this.userService.updateAccountPassword(user)
      .pipe(first())
      .subscribe(
        data => {
          this.toastr.success('Password update successful', 'Successful');
          this.changePassword = false;
          this.getAccountDetails();
        },
        error => {
          console.log(error);
          this.toastr.error('Password update failed', 'Failed');
        });
    }
  }

  validateConfirmationCode(){
    let code = this.passwordConfirm.get('confirm').value;
    if(code == this.confirmationCode){
      return true;
    }
    this.toastr.error('Invalid confirmation code', 'Failed');
    return false;
  }

  extractAccountFormValues(): void {
    this.account.firstName = this.accountForm.get('firstName').value;
    this.account.lastName = this.accountForm.get('lastName').value;
    this.account.email = this.accountForm.get('email').value;
    this.account.phone = this.accountForm.get('phone').value;
    this.account.licenseId = this.accountForm.get('licenseId').value;
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  cancel() {
    this.router.navigate(['']);
  }
}
