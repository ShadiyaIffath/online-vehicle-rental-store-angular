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
import { DmvService } from 'app/services/dmv/dmv.service';
import { FraudService } from 'app/services/fraud/fraud.service';

const now = new Date();

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  timeArray: any[] = [];
  bookingForm: FormGroup;
  equipmentForm: FormGroup;
  equipEdit: boolean = false;
  loading = false;
  submitted = false;
  accountId: number;
  validLicense: boolean = false;
  error = '';
  title: string = '';
  price: number; //this will be replaced with booking object
  vehicleId: number;
  type: string = '';
  bookingId: number;
  loaded: Promise<boolean>;
  vehicle: Vehicle = new Vehicle();
  editBooking: boolean = false;
  vehicleBooking: VehicleBooking = new VehicleBooking();
  equipmentBookings: any[];
  account: User = new User();
  startDate: NgbDateStruct = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
  endDate: NgbDateStruct = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
  minDate: NgbDateStruct = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
  maxDate: NgbDateStruct = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() + 14 };
  categories: any[];
  equipment: any[];
  selectedEquipment: any[] = [];
  filteredEquipment: any[];
  noEquipment: boolean = true;
  equipmentId: any;
  booking: Booking = new Booking();
  edited: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private parserFormatter: NgbDateParserFormatter,
    private authenticationService: AuthenticationService,
    private userService: UsersService,
    private inventoryService: InventoryService,
    private fraudLicenseService : FraudService,
    private dmvService: DmvService,
    private bookingService: BookingService,
    private equipmentService: EquipmentService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.spinner.show();
    if (this.inventoryService.vehicleId != null || this.inventoryService.vehicleId.value != 0) {
      this.vehicleId = this.inventoryService.vehicleId.value;
      this.inventoryService.getVehicleById(this.vehicleId).subscribe((data) => {
        this.vehicle = data;
        this.type = this.vehicle.type.type;
        this.price = this.vehicle.type.pricePerDay;
        this.loaded = Promise.resolve(true);
      }, err => {
        this.toastr.error('An error occured.');
        this.router.navigate(['']);
      });
    }
    else {
      this.spinner.hide();
      this.router.navigate(['']);
    }

    var body = document.getElementsByTagName('body')[0];
    body.classList.add('login-page');

    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');

    this.bookingForm = this.formBuilder.group({
      pickUpDate: ['', Validators.required],
      pickUpTime: ['', Validators.required],
      dropOffDate: ['', Validators.required],
      dropOffTime: ['', Validators.required],
    });

    this.equipmentForm = this.formBuilder.group({
      equipmentStartDate: [''],
      equipmentStartTime: ['']
    });

    if (this.bookingService.bookingId.value != 0) {
      this.title = 'Edit your booking';
      this.bookingId = this.bookingService.bookingId.value;
      this.bookingService.getBookingById(this.bookingId).subscribe((data) => {
        this.booking = data;
        this.editBooking = true;
        this.vehicleBooking = this.booking.vehicleBooking;
        this.price = this.vehicleBooking.totalCost;
        this.selectedEquipment = this.booking.equipmentBookings;
        this.generateTimeSlots();
        this.assignValuesToForm();
        this.accountId = this.booking.vehicleBooking.accountId;
        this.account = this.booking.vehicleBooking.account;
      });
    } else {
      this.generateTimeSlots();
      this.title = 'Place your booking';
      this.accountId = Number(this.authenticationService.currentUserValue.nameid);
      this.userService.getAccountDetails(this.accountId).subscribe((data) => {
        this.account = data;
      });
    }

    this.equipmentService.getEquipmentCategories().subscribe((data: any[]) => {
      this.categories = data;
      this.spinner.hide();
    });

    this.spinner.hide();
  }

  ngOnDestroy() {
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('login-page');

    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');

    this.inventoryService.removeSelection();
    this.bookingService.removeSelection();
  }

  // convenience getter for easy access to form fields
  get f() { return this.bookingForm.controls; }

  get e() { return this.equipmentForm.controls }

  async changeDate(event: any) {
    var end = moment(this.parserFormatter.format(this.bookingForm.get('dropOffDate').value));
    var start = moment(this.parserFormatter.format(this.bookingForm.get('pickUpDate').value));
    var diff = end.diff(start, 'days') + 1;
    if (diff > 0 && diff <= 14) {
      if (await this.loaded == true) {
        this.price = this.getSelctedEquipmentPrice() + (diff * this.vehicle.type.pricePerDay);
      }
    }
  }

  editBookingDate() {
    var start = this.parserFormatter.format(this.bookingForm.get('pickUpDate').value);
    var end = this.parserFormatter.format(this.bookingForm.get('dropOffDate').value);
    var initialEnd = moment(this.booking.vehicleBooking.endTime).startOf('days');
    var mend = moment(end);
    var mstart = moment(start);
    var diff = mend.diff(mstart, 'days') + 1;
    if (diff > 0 && diff <= 14) {
      this.price = this.getSelctedEquipmentPrice() + (diff * this.vehicle.type.pricePerDay);
      diff = mend.diff(initialEnd, 'days') + 1;
      if (diff > 1) {
        this.edited = true;
      } else {
        this.edited = false;
      }
      this.generateTimeSlots();
    }
  }

  assignValuesToForm() {
    let start = moment(this.booking.vehicleBooking.startTime);
    let end = moment(this.booking.vehicleBooking.endTime);

    this.bookingForm = this.formBuilder.group({
      pickUpDate: [moment(start, 'yyyy-mm-dd'), Validators.required],
      pickUpTime: [this.getTimeSlot(moment(start).format('HH:mm')), Validators.required],
      dropOffDate: [moment(end, 'yyyy-mm-dd'), Validators.required],
      dropOffTime: [this.getTimeSlot(moment(end).format('HH:mm')), Validators.required]
    });
    this.equipmentForm = this.formBuilder.group({
      equipmentStartDate: [moment(start, 'yyyy-mm-dd')],
      equipmentStartTime: [this.getTimeSlot(moment(start).format('HH:mm'))],
    });
    this.startDate = { year: start.year(), month: start.month() + 1, day: start.date() };
    this.endDate = { year: end.year(), month: end.month() + 1, day: end.date() };
    this.maxDate = { year: end.year(), month: end.month() + 1, day: end.date() + 1 };
    this.spinner.hide();
  }

  getTimeSlot(time): string {
    return this.timeArray.filter(x => x == time)[0];
  }

  generateTimeSlots() {
    var startTime = moment('08:00', 'HH:mm');
    var endTime = moment('18:00', 'HH:mm');
    if (this.edited) {
      endTime = moment('16:00', 'HH:mm');
    }
    this.timeArray = [];
    var nextSlot = 30;
    let time;

    while (startTime <= endTime) {
      time = moment(startTime).format('HH:mm');
      this.timeArray.push(time);
      startTime.add(nextSlot, 'minutes');
    }
  }

  getSelctedEquipmentPrice(): number {
    let total = 0;
    this.selectedEquipment.forEach(element => {
      total += element.equipment.category.price;
    });
    return total;
  }

  bookingConfirmed() {
    this.booking.vehicleBooking = this.vehicleBooking;
    this.booking.equipmentBookings = this.selectedEquipment;
    if (this.editBooking) {
      //update booking
      this.bookingService.updateBooking(this.booking)
        .subscribe(data => {
          this.toastr.success('Your update was successful');
          this.router.navigate(['components/manage-bookings']);
        }, error => {
          console.log(error);
          this.error = 'Update failed. Please try again later.'
          this.toastr.error('Booking failed.');
        });
    }
    else {
      //create new booking
      this.bookingService.createBooking(this.booking)
        .subscribe(data => {
          this.toastr.success('Your booking was successful');
          this.router.navigate(['']);
        }, error => {
          console.log(error);
          this.error = 'Booking failed. Please try again later.'
          this.toastr.error('Booking failed.');
        });
    }
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
          if (error == "Conflict") {
            this.toastr.error('Vehicle is unavaible for the duration');
            this.error = 'Invalid range booked';
          } else {
            this.toastr.error('Booking creation failed.');
          }
        });
  }

  getAvailableEquipment() {
    this.bookingService.getAvailableEquipment(this.vehicleBooking).subscribe((data: any[]) => {
      this.equipment = data;
      this.spinner.hide();
    });
  }

  extractFormValues() {
    if (this.vehicleBooking.id == null || this.vehicleBooking.id == 0) {
      this.vehicleBooking.status = "Confirmed";
      this.vehicleBooking.createdOn = moment().format("YYYY-MM-DD HH:mm:ss");
      this.vehicleBooking.accountId = parseInt(this.authenticationService.currentUserValue.nameid);
    }
    this.vehicleBooking.totalCost = this.price;
    this.vehicleBooking.vehicleId = this.vehicleId;
  }

  validateEquipmentDate(): boolean {
    var date = this.parserFormatter.format(this.bookingForm.get('pickUpDate').value);
    var time = this.bookingForm.get('pickUpTime').value;
    var startTime = moment(date + ' ' + time);

    date = this.parserFormatter.format(this.bookingForm.get('dropOffDate').value);
    time = this.bookingForm.get('dropOffTime').value;
    var endTime = moment(date + ' ' + time);

    date = this.parserFormatter.format(this.equipmentForm.get('equipmentStartDate').value);
    time = this.equipmentForm.get('equipmentStartTime').value;
    let equipmentStart = moment(date + ' ' + time);
    var valid = equipmentStart.isSameOrAfter(startTime) && equipmentStart.isBefore(endTime) ? true : false;
    if (valid) {
      this.assignEquipmentTime(equipmentStart, startTime);
    }
    return valid;
  }

  assignEquipmentTime(equipmentStart, startTime) {
    for (var e of this.selectedEquipment) {
      if (e.id == null || e.id == 0) {
        e.startTime = equipmentStart.format("YYYY-MM-DD HH:mm:ss");
      } else {
        e.startTime = startTime.format("YYYY-MM-DD HH:mm:ss");
      }
    }
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
    if (this.selectedEquipment.length < 3) {
      let name = event.target.value;
      if (this.verifyEquipmentSelected(name) == false) {
        for (var e of this.filteredEquipment) {
          if (e.name === name) {
            this.price += e.category.price;
            this.extractEquipmentBookingDetails(e);
            if (this.editBooking) {
              this.equipEdit = true;
            }
            break;
          }
        }
      }
    }
  }

  verifyEquipmentSelected(e): boolean {
    for (var v of this.selectedEquipment) {
      if (v.equipment.name == e) {
        return true;
      }
    }
    return false;
  }

  onSubmittingEquipments(stepper: MatStepper) {
    if (this.selectedEquipment.length == 0) {
      this.error = '';
      stepper.next();
      this.getAccountDetails();
    } else {
      this.spinner.show();
      if (this.editBooking) {
        //edit booking
        if (this.equipEdit && !this.validateEquipmentDate()) {
          //equipment time invalid
          this.toastr.error('Equipment booking start time invalid');
          this.error = 'Invalid range booked';
        } else {
          stepper.next();
          this.getAccountDetails();
        }
      } else {
        //new booking
        stepper.next();
        this.getAccountDetails();
      }
      this.vehicleBooking.totalCost = this.price;
      this.spinner.hide();
    }
  }

  extractEquipmentBookingDetails(e) {
    var booked = {
      startTime: this.vehicleBooking.startTime,
      endTime: this.vehicleBooking.endTime,
      vehicleBookingId: this.vehicleBooking.id,
      createdOn: moment(),
      equipment: e,
      equipmentId: e.id,
      vehicle: this.vehicle,
      vehicleId: this.vehicle.id
    }
    this.selectedEquipment.push(booked);
  }

  getAccountDetails() {
    this.verifyLicense();
    this.account.dob = moment(this.account.dob).format("YYYY-MM-DD");
    this.vehicleBooking.accountId = this.accountId;
    this.account.dob = moment(this.account.dob).format("YYYY-MM-DD");
    this.account.age = moment().diff(this.account.dob, 'years');
  }

  verifyLicense(){
    this.spinner.show();
    this.dmvService.validateLicense(this.account.licenseId, this.accountId).subscribe((data: any) => {
      if(data == true){
        this.toastr.error("Booking request rejected");
        this.error = 'Sorry, but you are not eligible to make this booking. Your driving license has been reported as lost or suspended';
        this.loading = true;
      }else{
        this.validateIfLicenseIsFraud();
      }
    },  err =>{
    this.toastr.error ('There was a server error. Cannot process your request');
    this.loading = true;
    this.spinner.hide();
    });
  }

  validateIfLicenseIsFraud(){
    this.fraudLicenseService.validateLicense(this.account.licenseId).subscribe((data) =>{
      if(data == true){
        this.toastr.error("Booking request rejected");
        this.error = 'Sorry, but you are not eligible to make this booking. Your driving license has been reported as fraudulent license.';
        this.loading = true;
      }else{
        this.loading = false;
        this.error = 'You are eligible to make this booking';
      }
      this.spinner.hide();
    },  err =>{
      this.toastr.error ('There was a server error. Cannot process your request');
      this.loading = true;
      this.spinner.hide();
      });
  }

  removeEquipment(remove) {
    this.price -= remove.equipment.category.price;
    this.selectedEquipment = this.selectedEquipment.filter(e => e.equipmentId !== remove.equipmentId);
  }

  cancel() {
    this.inventoryService.removeSelection();
    this.bookingService.removeSelection();
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
