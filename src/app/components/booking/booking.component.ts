import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { MatStepper } from '@angular/material/stepper';
import { NgxSpinnerService } from "ngx-spinner";

import { Equipment } from 'app/models/Equipment';
import { EquipmentService } from 'app/services/equipment/equipment.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { InventoryService } from 'app/services/inventory/inventory.service';
import { Vehicle } from 'app/models/Vehicle';
import { BehaviorSubject } from 'rxjs';
import { VehicleBooking } from 'app/models/VehicleBooking';
import { BookingService } from 'app/services/booking/booking.service';
import { User } from 'app/models/User';
import { UsersService } from 'app/services/users/users.service';
import { EquipmentBooking } from 'app/models/EquipmentBooking';
import { Booking } from 'app/models/Booking';


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
  accountId: number;
  error = '';
  title: string = '';
  price: number; //this will be replaced with booking object
  vehicleId: number;
  loaded: Promise<boolean>;
  vehicle: Vehicle = new Vehicle();
  vehicleBooking: VehicleBooking = new VehicleBooking();
  equipmentBookings: any[];
  account: User = new User();
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
  booking: Booking = new Booking();

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private parserFormatter: NgbDateParserFormatter,
    private authenticationService: AuthenticationService,
    private userService: UsersService,
    private inventoryService: InventoryService,
    private bookingService: BookingService,
    private equipmentService: EquipmentService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    var body = document.getElementsByTagName('body')[0];
    body.classList.add('login-page');

    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');

    this.spinner.show();
    if (this.inventoryService.vehicleId != null) {
      this.vehicleId = this.inventoryService.vehicleId.value;
      this.inventoryService.getVehicleById(this.vehicleId).subscribe((data) => {
        this.vehicle = data;
        this.price = this.vehicle.type.pricePerDay;
        this.loaded = Promise.resolve(true);
        this.spinner.hide();
      }, err => {
        this.router.navigate(['']);
      });
    }

    this.equipmentService.getEquipmentCategories().subscribe((data: any[]) => {
      this.categories = data;
      this.spinner.hide();
    });

    this.timeArray = [];
    this.title = 'Place your booking';

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
    this.booking.vehicleBooking = this.vehicleBooking;
    this.booking.equipmentBookings = this.equipmentBookings;
    this.bookingService.createBooking(this.booking)
      .subscribe(data => {
        this.toastr.success('Your booking was successful');
        this.router.navigate(['']);
      }, error => {
        console.log(error);
        this.error = 'Booking failed. Please try again later.'
        this.toastr.error('Bbooking failed.');
      });
  }

  onBookingFormSubmit(stepper: MatStepper) {
    this.submitted = true;
    let valid = this.validateDateRange();
    if (this.bookingForm.errors || this.bookingForm.invalid || valid == false) {
      this.error = valid == false ? 'Invalid range booked' : 'Invalid data, please check again';
      this.toastr.error('Booking failed.');
      return;
    }
    this.extractFormValues();
    this.loading = true;
    this.spinner.show();
    if (this.vehicleBooking.id == null) {
      this.bookingService.validateBooking(this.vehicleBooking)
        .pipe(first())
        .subscribe(
          data => {
            this.error = '';
            this.getAvailableEquipment();
            this.toastr.success('Vehicle available for the duration');
            stepper.next();
          },
          error => {
            this.spinner.hide();
            console.log(error);
            this.toastr.error('Vehicle is unavaible for the duration');
            this.error = 'Invalid range booked';
          });
    }
  }

  getAvailableEquipment() {
    this.bookingService.getAvailableEquipment(this.vehicleBooking).subscribe((data: any[]) => {
      this.equipment = data;
      this.spinner.hide();
    });
  }

  extractFormValues() {
    if (this.vehicleBooking.id == null) {
      this.vehicleBooking.status = "Confirmed";
      this.vehicleBooking.createdOn = moment().format("YYYY-MM-DD HH:mm:ss");
      this.vehicleBooking.accountId = parseInt(this.authenticationService.currentUserValue.nameid);
    }
    this.vehicleBooking.totalCost = this.price;
    this.vehicleBooking.vehicleId = this.vehicleId;
  }

  validateDateRange() {
    var date = this.parserFormatter.format(this.bookingForm.get('pickUpDate').value);
    var time = this.bookingForm.get('pickUpTime').value;
    var startTime = moment(date + ' ' + time);

    date = this.parserFormatter.format(this.bookingForm.get('dropOffDate').value);
    time = this.bookingForm.get('dropOffTime').value;
    var endTime = moment(date + ' ' + time);

    if (startTime.isBefore(endTime) && (endTime.diff(startTime, 'days') + 1) <= 14 && (endTime.diff(startTime, 'hours') >= 5)) {
      this.vehicleBooking.startTime = startTime.format("YYYY-MM-DD HH:mm:ss");
      this.vehicleBooking.endTime = endTime.format("YYYY-MM-DD HH:mm:ss");
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

  onSubmittingEquipments(stepper: MatStepper) {
    if (this.selectedEquipment.length == 0) {
      this.error = '';
      stepper.next();
      this.getAccountDetails();
    } else {
      this.spinner.show();
      stepper.next();
      this.extractEquipmentBookingDetails();
      this.getAccountDetails();
      this.spinner.hide();
    }
  }

  extractEquipmentBookingDetails() {
    this.equipmentBookings = [];
    for (var e of this.selectedEquipment) {
      var booked = {
        startTime: this.vehicleBooking.startTime,
        endTime: this.vehicleBooking.endTime,
        createdOn: moment(),
        status: 'Confirmed',
        equipment: e,
        equipmentId: e.id,
        vehicle: this.vehicle,
        vehicleId: this.vehicle.id
      }
      this.equipmentBookings.push(booked);
    }
  }

  getAccountDetails() {
    this.accountId = Number(this.authenticationService.currentUserValue.nameid);
    this.userService.getAccountDetails(this.accountId).subscribe((data) => {
      this.spinner.show();
      this.account = data;
      this.account.dob = moment(this.account.dob).format("YYYY-MM-DD");
      this.vehicleBooking.accountId = this.accountId;
      this.account.age = moment().diff(this.account.dob, 'years');
      this.verifyAge();
      this.loaded = Promise.resolve(true);
      this.spinner.hide();
    }, err => {
      this.toastr.error('An error occurred', 'Sorry');
    });
  }

  verifyAge() {
    if (this.account.age < 25) {
      if (this.vehicle.type.type == 'Small town car') {
        this.error = 'You are eligible to make this booking';
        this.loading = false;
      }
      else {
        this.error = 'Sorry, but you are not eligible to make this booking';
        this.loading = true;
      }
    }
    else {
      this.loading = false;
      this.error = 'You are eligible to make this booking';
    }
    console.log(this.loading);
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
    if (step == 1) {
      this.onBookingFormSubmit(stepper);
    }
    if (step == 2) {
      this.onSubmittingEquipments(stepper);
    }

  }

  navigateHome() {
    this.router.navigate(['']);
  }
}
