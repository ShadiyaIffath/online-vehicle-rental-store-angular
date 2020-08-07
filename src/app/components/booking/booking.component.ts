import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

import { AuthenticationService } from '../../services/authentication/authentication.service';
import { NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { InventoryService } from 'app/services/inventory/inventory.service';
import { Vehicle } from 'app/models/Vehicle';
import { BehaviorSubject } from 'rxjs';
import { Booking } from 'app/models/VehicleBooking';


const now = new Date();

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  timeArray: any[];
  bookingForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string = '';
  error = '';
  title: string = '';
  price: number; //this will be replaced with booking object
  vehicleId: number;
  vehicle: Vehicle = new Vehicle();
  booking: Booking = new Booking();
  additionalError: string = '';
  startDate: NgbDateStruct = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
  endDate: NgbDateStruct = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
  minDate: NgbDateStruct = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private parserFormatter: NgbDateParserFormatter,
    private authenticationService: AuthenticationService,
    private inventoryService: InventoryService,
    private toastr: ToastrService) {
    // redirect to login page if not logged in
    if (this.authenticationService.currentUserValue == null) {
      this.toastr.info('You have to login to reserve', 'Please login');
      this.router.navigate(['components/login']);
    }

    if (this.inventoryService.vehicleId != null) {
      this.vehicleId = this.inventoryService.vehicleId.value;
        this.inventoryService.getVehicleById(this.vehicleId).subscribe((data)=>{
          this.vehicle = data;
      }, err =>{
        this.router.navigate(['']);
      });
    }
    this.timeArray = [];
    this.title = 'Place your booking';
  }

  ngOnInit() {
    var body = document.getElementsByTagName('body')[0];
    body.classList.add('login-page');

    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');

    this.generateTimeSlots();
    this.bookingForm = this.formBuilder.group({
      pickUpDate: ['', Validators.required],
      pickUpTime: ['', Validators.required],
      dropOffDate: ['', Validators.required],
      dropOffTime: ['', Validators.required],
      additionalEquipment: ['']
    });
  }

  ngOnDestroy() {
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('login-page');

    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
  }

  // convenience getter for easy access to form fields
  get f() { return this.bookingForm.controls; }

  changeDate(event: any) {
    var end = moment({ year: this.endDate.year, month: this.endDate.month, day: this.endDate.day });
    var start = moment({ year: this.startDate.year, month: this.startDate.month, day: this.startDate.day });
    var diff = end.diff(start, 'days') + 1;
    if (diff > 0 && diff <= 14) {
      this.price = diff * this.vehicle.type.pricePerDay;
    }
  }

  generateTimeSlots() {
    var startTime = moment('08:00', 'HH:mm');
    var endTime = moment('18:00','HH:mm');
    var nextSlot = 30;
    let time;

    while(startTime <= endTime){
      time =  moment(startTime).format('HH:mm');
      this.timeArray.push(time);
      startTime.add(nextSlot,'minutes');
    }
  }

  onSubmit(){
    this.submitted = true;
    let valid =this.validateDateRange();
    console.log(valid);
    if (this.bookingForm.errors || this.bookingForm.invalid || valid == false) {
      this.error = valid == false? 'Invalid range booked':'Invalid data, please check again';
      this.toastr.error('Booking failed','Failed!');
      return;
    }
    this.extractFormValues();
  }

  extractFormValues(){
      this.booking.totalCost = this.price;
      this.booking.createdOn = moment().toString();
      this.booking.vehicleId = this.vehicleId;
      console.log(this.booking);
  }

  validateDateRange(){
    var date = this.parserFormatter.format(this.bookingForm.get('pickUpDate').value);
    var time = this.bookingForm.get('pickUpTime').value;
    var startTime = moment(date+' '+ time);

    date = this.parserFormatter.format(this.bookingForm.get('dropOffDate').value);
    time = this.bookingForm.get('dropOffTime').value;
    var endTime = moment(date +' '+ time);

    if(startTime.isBefore(endTime) && (endTime.diff(startTime,'days')+ 1) <=14 && (endTime.diff(startTime,'hours') >=5)){
      this.booking.startTime = startTime.toString();
      this.booking.endTime = endTime.toString();
      return true;
    }
    return false;
  }
}
