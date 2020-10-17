import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { MatStepper } from '@angular/material/stepper';

import { Equipment } from 'app/models/Equipment';
import { EquipmentService } from 'app/services/equipment/equipment.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { InventoryService } from 'app/services/inventory/inventory.service';
import { Vehicle } from 'app/models/Vehicle';
import { BehaviorSubject } from 'rxjs';
import { Booking } from 'app/models/VehicleBooking';
import { BookingService } from 'app/services/booking/booking.service';


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
  loaded: Promise<boolean>;
  vehicle: Vehicle = new Vehicle();
  booking: Booking = new Booking();
  additionalError: string = '';
  startDate: NgbDateStruct = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
  endDate: NgbDateStruct = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
  minDate: NgbDateStruct = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
  categories: any[];
  equipment: any[];
  selectedEquipment: any[] = [];
  filteredEquipment: any[];
  noEquipment: boolean = true;
  equipmentId: any;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private parserFormatter: NgbDateParserFormatter,
    private authenticationService: AuthenticationService,
    private inventoryService: InventoryService,
    private bookingService: BookingService,
    private equipmentService: EquipmentService,
    private toastr: ToastrService) {

    if (this.inventoryService.vehicleId != null) {
      this.vehicleId = this.inventoryService.vehicleId.value;
      this.inventoryService.getVehicleById(this.vehicleId).subscribe((data) => {
        this.vehicle = data;
        this.price = this.vehicle.type.pricePerDay;
        this.loaded = Promise.resolve(true);
      }, err => {
        this.router.navigate(['']);
      });
    }

    this.equipmentService.getEquipmentCategories().subscribe((data: any[]) => {
      this.categories = data;
    });

    this.equipmentService.getEquipment().subscribe((data: any[]) => {
      this.equipment = data;
    });
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
    });

    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required],
      pickUpDate: ['', Validators.required],
    });
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  ngOnDestroy() {
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('login-page');

    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');

    this.inventoryService.removeSelection();
  }

  // convenience getter for easy access to form fields
  get f() { return this.bookingForm.controls; }

  async changeDate(event: any) {
    var end = moment({ year: this.endDate.year, month: this.endDate.month, day: this.endDate.day });
    var start = moment({ year: this.startDate.year, month: this.startDate.month, day: this.startDate.day });
    var diff = end.diff(start, 'days') + 1;
    if (diff > 0 && diff <= 14) {
      if (await this.loaded == true) {
        this.price = diff * this.vehicle.type.pricePerDay;
      }
    }
  }

  generateTimeSlots() {
    var startTime = moment('08:00', 'HH:mm');
    var endTime = moment('18:00', 'HH:mm');
    var nextSlot = 30;
    let time;

    while (startTime <= endTime) {
      time = moment(startTime).format('HH:mm');
      this.timeArray.push(time);
      startTime.add(nextSlot, 'minutes');
    }
  }

  bookingConfirmed() {

  }

  onBookingFormSubmit(): boolean {
    this.submitted = true;
    let valid = this.validateDateRange();
    if (this.bookingForm.errors || this.bookingForm.invalid || valid == false) {
      this.error = valid == false ? 'Invalid range booked' : 'Invalid data, please check again';
      // this.toastr.error('Booking failed.');
      return false;
    }
    this.extractFormValues();
    this.loading = true;
    // if (this.booking.id == null) {
    //   this.bookingService.createBooking(this.booking)
    //     .subscribe(data => {
    //       this.toastr.success('Successful', 'Your booking was successful');
    //       this.router.navigate(['']);
    //     }, error => {
    //       console.log(error);
    //       this.error = 'Booking failed. Please try again later.'
    //       this.toastr.error('Bbooking failed.');
    //     });
    // }
    return true;
  }

  extractFormValues() {
    if (this.booking.id == null) {
      this.booking.status = "created";
      this.booking.createdOn = moment().format("YYYY-MM-DD HH:mm:ss");
      this.booking.accountId = parseInt(this.authenticationService.currentUserValue.nameid);
    }
    this.booking.totalCost = this.price;
    this.booking.vehicleId = this.vehicleId;
  }

  validateDateRange() {
    var date = this.parserFormatter.format(this.bookingForm.get('pickUpDate').value);
    var time = this.bookingForm.get('pickUpTime').value;
    var startTime = moment(date + ' ' + time);

    date = this.parserFormatter.format(this.bookingForm.get('dropOffDate').value);
    time = this.bookingForm.get('dropOffTime').value;
    var endTime = moment(date + ' ' + time);

    if (startTime.isBefore(endTime) && (endTime.diff(startTime, 'days') + 1) <= 14 && (endTime.diff(startTime, 'hours') >= 5)) {
      this.booking.startTime = startTime.format("YYYY-MM-DD HH:mm:ss");
      this.booking.endTime = endTime.format("YYYY-MM-DD HH:mm:ss");
      return true;
    }
    return false;
  }

  showEquipment(id: number) {
    this.filteredEquipment = this.equipment.filter(function (equipment) {
      return equipment.category.id === id;
    });
    this.noEquipment = this.filteredEquipment.length == 0 ? true : false;
  }

  equipmentSelected(event: any) {
    if (this.selectedEquipment.length <= 3) {
      let name = event.target.value;
      for (var e of this.filteredEquipment) {
        if (e.name === name) {
          this.price += e.category.price;
          this.selectedEquipment.push(e);
          break;
        }
      }
      
    }
  }

  removeEquipment(remove) {
    this.price -= remove.category.price;
    this.selectedEquipment = this.selectedEquipment.filter(e => e !== remove);
  }

  cancel() {
    this.inventoryService.removeSelection();
    this.router.navigate(['']);
  }

  goBack(stepper: MatStepper) {
    stepper.previous();
  }

  goForward(stepper: MatStepper, step: number) {
    console.log(stepper);
    console.log(step);
    if (step == 1) {
      if (this.onBookingFormSubmit())
        stepper.next();
    }
    if (step == 2) {
      stepper.next();
    }

  }
}
