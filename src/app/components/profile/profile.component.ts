import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  drivingLicense:any;
  identification:any;
  licenseChanged: boolean = false;
  identitfyChanged: boolean = false;
  mismatch: boolean = false;
  samePassword: boolean = false;
  changePassword: boolean = false;
  loaded: Promise<boolean>;
  emailFailed: boolean = false;
  passwordConfirm: FormGroup;
  accountForm: FormGroup;
  passwordForm: FormGroup;
  licenseForm: FormGroup;
  enteredPassword: string ='';
  loading = false;
  submitted = false;
  accountId: number;
  account: User = new User();
  fieldTextType: boolean;

  constructor(private userService: UsersService,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
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
    });
    this.passwordForm = this.formBuilder.group({
      password: ['', Validators.required],
      repeat: ['', Validators.required],
    });
    this.passwordConfirm = this.formBuilder.group({
      confirm: ['', Validators.required]
    });

    this.licenseForm = this.formBuilder.group({
      licenseId : ['', Validators.required], 
      drivingLicense: ['', ],
      additionalIdentification: ['', ],
    })

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
        dob: new FormControl({ value: moment(dob).format('yyyy-MM-DD'), disabled: true }, [Validators.required])
        
      });
      this.passwordForm = new FormGroup({
        password: new FormControl('', [Validators.required]),
        repeat: new FormControl('', Validators.required)
      });
      this.licenseForm = new FormGroup({
        licenseId: new FormControl(this.account.licenseId, [Validators.required]),
        drivingLicense: new FormControl('' ),
        additionalIdentification: new FormControl(''),
      });
    }
  }

  uploadDrivingLicenseFile = (files) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    let reader = new FileReader();
    reader.readAsDataURL(fileToUpload);
    reader.onload = () => {
      this.drivingLicense = {
        filename: fileToUpload.name,
        filetype: fileToUpload.type,
        value: (<string>reader.result).split(',')[1]
      }
    };
    this.licenseChanged = true;
    // need to run CD since file load runs outside of zone
    this._cdr.markForCheck();
  }

  uploadIdentityFile = (files) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    let reader = new FileReader();
    reader.readAsDataURL(fileToUpload);
    reader.onload = (event: any) => {
      this.identification = {
        filename: fileToUpload.name,
        filetype: fileToUpload.type,
        value: (<string>reader.result).split(',')[1]
      }
    };
    this.identitfyChanged = true;
    // need to run CD since file load runs outside of zone
    this._cdr.markForCheck();
  }

  OnIdChange(event){
    if(event.target.Value != this.account.licenseId){
      this.licenseChanged = true;
    }
    else{
      this.licenseChanged = false;
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.accountForm.controls; }

  get p() { return this.passwordForm.controls; }

  get d() { return this.licenseForm.controls; }

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
          if (error == "Conflict") {
            this.accountForm.controls['email'].setErrors({ 'incorrect': true });
            this.toastr.error('Email is used by another account', 'Failed');
            this.emailFailed = true;
          }
          else {
            this.toastr.error('Account update failed', 'Failed');
            this.emailFailed = false;
          }
          this.loading = false;
        });
    this.spinner.hide();
  }

  onIdentificationChangeSubmit(){
    let user = {
      id: this.account.id,
      licenseId: '',
      drivingLicense: {},
      additionalIdentification: {}
    };
    if(this.licenseChanged){
      if(this.drivingLicense == null){
        this.toastr.info("To change the license id please submit an image of your new license");
      }else{
        user.licenseId = this.licenseForm.get('licenseId').value;
        user.drivingLicense = this.drivingLicense;
      }
    }
    if(this.identitfyChanged){
      user.additionalIdentification = this.identification;
    }
    this.userService.updateAccountIdentification(user)
    .subscribe( data=>{
      this.toastr.success('Account update successful', 'Successful');
      this.getAccountDetails();
      this.identitfyChanged = false;
      this.licenseChanged = false;
    }, err =>{
      console.log(err);
      if(err == 'DMV'){
        this.toastr.error('Your license has been reported as stolen or lost from the DMV');
      }else if(err == "Fraud"){
        this.toastr.error('Your license has been reported as fraudulent');
      }else{
        this.toastr.error('An error occured try again later');
      }
      this.createFormControls(this.account);
      this.identitfyChanged = false;
      this.licenseChanged = false;
      this.drivingLicense= {};
      this.identification = {};
      });
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
    this.enteredPassword = newPassword;
    return true;
  }

  onConfirmation(){
    if(this.validateConfirmationCode){
      let user = {
        id : this.account.id,
        password : this.enteredPassword,
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
    // this.account.licenseId = this.accountForm.get('licenseId').value;
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  cancel() {
    this.router.navigate(['']);
  }
}
