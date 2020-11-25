import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

import { Inquiry } from 'app/models/Inquiry';
import { InquiryService } from 'app/services/inquiries/inquiry.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {
  inquiryForm: FormGroup;
  inquiry: Inquiry = new Inquiry();

  constructor( private formBuilder: FormBuilder,
    private router: Router,
    private inquiryService: InquiryService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.inquiryForm = this.formBuilder.group({
      inquirer: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      phone: ['', Validators.compose([Validators.pattern("[0-9 ]{10}"), Validators.required])],
      inquiry : ['', Validators.required]
    });
  }

  
  // convenience getter for easy access to form fields
  get f() { return this.inquiryForm.controls; }

  makeInquiry(){
    if(this.inquiryForm.invalid){
      this.toastr.error('Form is incomplete', 'Failed');
      return;
    }
    this.extractFormValues();
    this.inquiryService.makeInquiry(this.inquiry).subscribe(() =>{
      this.toastr.success('Inquiry created successfully');
      this.router.navigate(['']);
    }, error =>{
      this.toastr.error('An error occured. Try again');
    })
  }

  extractFormValues(){
    this.inquiry.name = this.inquiryForm.get('inquirer').value;
    this.inquiry.email = this.inquiryForm.get('email').value;
    this.inquiry.phone = this.inquiryForm.get('phone').value;
    this.inquiry.inquiry = this.inquiryForm.get('inquiry').value;
    this.inquiry.responded = false;
    this.inquiry.createdOn = moment().format("YYYY-MM-DD HH:mm:ss");
  }

}
