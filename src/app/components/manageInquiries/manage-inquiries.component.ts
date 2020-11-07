import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { InquiryService } from 'app/services/inquiries/inquiry.service';
import { Inquiry } from 'app/models/Inquiry';

@Component({
  selector: 'app-manage-inquiries',
  templateUrl: './manage-inquiries.component.html',
  styleUrls: ['./manage-inquiries.component.css']
})
export class ManageInquiriesComponent implements OnInit {
  status = [{ id: 0, type: 'All' }, { id: 1, type: 'Responded' }, { id: 2, type: 'Unresponed' }];
  inquiries: Inquiry[];
  selected: Inquiry;
  filteredInquiry: Inquiry[];
  noInquiries: boolean = false;
  total: number = 0;
  responseForm: FormGroup;

  constructor(private inquiryService: InquiryService,
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.inquiryService.getAllInquiry().subscribe((data: any[]) => {
      this.inquiries = data;
      this.filteredInquiry = data;
      this.total = this.getUnrespondedInquiries();
      this.noInquiriesTag();
      this.spinner.hide();
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.responseForm.controls; }

  getUnrespondedInquiries(): number {
    let count = 0;
    for (var index: number = 0; index < this.inquiries.length; index++) {
      if (this.inquiries[index].responded == false) {
        count++;
      }
    }
    return count;
  }

  noInquiriesTag() {
    if (this.filteredInquiry.length == 0) {
      this.noInquiries = true;
    }
    else {
      this.noInquiries = false;
    }
  }

  activeFilter(event: any) {
    let filter = event.target.value;
    if (filter == 'All') {
      this.filteredInquiry = this.inquiries;
    }
    else {
      let active = filter == 'Responded' ? true : false;
      this.filteredInquiry = this.inquiries.filter(function (i) {
        return i.responded === active;
      });
    }
    this.noInquiriesTag();
  }

  submitResponse() {
    if(this.responseForm.invalid){
      this.toastr.error('Error with your response');
      return;
    }
    this.selected.responded = true;
    this.selected.response = this.responseForm.get('response').value;
    this.inquiryService.respondToInquiry(this.selected).subscribe(() => {
      this.toastr.success('Successfully responded');
      this.spinner.show();
      this.inquiryService.getAllInquiry().subscribe((data: any[]) => {
        this.inquiries = data;
        this.filteredInquiry = this.inquiries;
        this.modalService.dismissAll();
        this.total = this.getUnrespondedInquiries();
        this.noInquiriesTag();
        this.spinner.hide();
      });
    }, error => {
      this.toastr.error('Inquiry response not sent. Try again later.');
    })
  }

  deleteInquiry(id) {
    this.inquiryService.deleteInquiry(id).subscribe(() => {
      this.toastr.success('Inquiry removed successfully', 'Deleted');
      this.spinner.show();
      this.inquiryService.getAllInquiry().subscribe((data: any[]) => {
        this.inquiries = data;
        this.filteredInquiry = this.inquiries;
        this.total = this.getUnrespondedInquiries();
        this.noInquiriesTag();
        this.spinner.hide();
      });
    }, error => {
      this.toastr.error('Inquiry removal failed', 'Failed');
    })
  }

  respond(i, inquiryContent) {
    this.selected = i;
    this.createResponseForm();
    this.modalService.open(inquiryContent, { size: 'md', scrollable: true, backdropClass: 'light-red-backdrop', centered: true });
  }

  createResponseForm() {
    this.responseForm = this.formBuilder.group({
      response: ['', Validators.required]
    });
  }
}
