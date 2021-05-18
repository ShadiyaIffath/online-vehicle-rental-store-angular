import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

import { Booking } from 'app/models/Booking';
import { BookingService } from 'app/services/booking/booking.service';
import { InventoryService } from 'app/services/inventory/inventory.service';
import { User } from 'app/models/User';
import { UsersService } from 'app/services/users/users.service';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'app/services/authentication/authentication.service';
import { VehicleBooking } from 'app/models/VehicleBooking';

const now = new Date();
@Component({
  selector: 'app-manage-booking',
  templateUrl: './manage-booking.component.html',
  styleUrls: ['./manage-booking.component.css']
})
export class ManageBookingComponent implements OnInit {
  total: number;
  adminControls: boolean = false;
  adminBooking: boolean = false;
  noBookings: boolean = false;
  expiredBooking: boolean = false;
  noEquipment: boolean = false;
  disableEdit: boolean = false;
  confirmed: boolean = true;
  selectedBooking: Booking;
  currentIndex = -1;
  currentBooking = null;
  vehicleTypes: any[];
  status = [{ id: 0, type: 'All' }, { id: 1, type: 'Confirmed' }, { id: 2, type: 'Cancelled' }, { id: 3, type: 'Collected' }, { id: 4, type: 'Completed' }];
  activeStatus = [{ id: 1, type: 'Confirmed' }, { id: 2, type: 'Cancelled' }, { id: 3, type: 'Collected' }, { id: 4, type: 'Completed' }];
  booking: any[];
  selectedEquipment = [];
  filteredBookings: Booking[] = [];
  //pagination attributes
  config: any;
  statusForm: FormGroup;

  constructor(private router: Router,
    private toastr: ToastrService,
    private inventoryService: InventoryService,
    private userService: UsersService,
    private authenticationService: AuthenticationService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private bookingService: BookingService) {
    this.spinner.show();

    if (this.authenticationService.currentUserValue.role == 'admin') {
      this.adminControls = true;
      this.bookingService.getAllBooking().subscribe((data: any[]) => {
        this.booking = data;
        this.filteredBookings = this.booking;
        this.setFilterPagination();
        this.noBookingFlag();
        this.spinner.hide();
      }, err => {
        this.toastr.error('An error occured.');
        this.router.navigate(['']);
      });
    } else {
      this.bookingService.getUsersBookings(this.authenticationService.currentUserValue.nameid).subscribe((data: any[]) => {
        this.booking = data;
        this.filteredBookings = this.booking;
        this.setFilterPagination();
        this.noBookingFlag();
        this.spinner.hide();
      }, err => {
        this.toastr.error('An error occured.');
        this.router.navigate(['']);
      });
    }

    this.inventoryService.getVehicleTypes().subscribe((data: any[]) => {
      this.vehicleTypes = data;
      this.vehicleTypes.unshift({ id: 0, type: 'All' });
    });
  }

  ngOnInit(): void {

  }


  noBookingFlag() {
    if (this.filteredBookings.length === 0) {
      this.noBookings = true;
    }
    else {
      this.noBookings = false;
    }
    this.total = this.filteredBookings.length
  }

  setFilterPagination() {
    this.config = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.filteredBookings.length
    };
    this.spinner.hide();
  }

  pageChanged(event) {
    this.config.currentPage = event;
  }

  statusFilter(event: any) {
    let filter = event.target.value;
    if (filter == 'All') {
      this.filteredBookings = this.booking;
    }
    else {
      this.filteredBookings = this.booking.filter(function (x) {
        return x.vehicleBooking.status === filter;
      });
    }
    this.setFilterPagination();
    this.noBookingFlag();
  }

  typeFilter(event: any) {
    let filter = event.target.value;
    if (filter == 'All') {
      this.filteredBookings = this.booking;
    }
    else {
      this.filteredBookings = this.booking.filter(function (x) {
        return x.vehicleBooking.vehicle.type.type === filter;
      });
    }
    this.setFilterPagination();
    this.noBookingFlag();
  }

  deleteBooking(id: number) {
    this.bookingService.deleteBooking(id).subscribe(() => {
      this.toastr.success('Booking removed successfully', 'Deleted');
      this.spinner.show();
      if (this.adminControls) {
        this.bookingService.getAllBooking().subscribe((data: any[]) => {
          this.booking = data;
          this.filteredBookings = this.booking;
          this.setFilterPagination();
          this.noBookingFlag();
          this.modalService.dismissAll();
          this.spinner.hide();
        }, err => {
          this.spinner.hide();
        });
      }else{
        this.bookingService.getUsersBookings(this.authenticationService.currentUserValue.nameid).subscribe((data: any[]) => {
          this.booking = data;
          this.filteredBookings = this.booking;
          this.setFilterPagination();
          this.noBookingFlag();
          this.spinner.hide();
        }, err => {
          this.toastr.error('An error occured.');
        });
      }
    });
  }

  openBookingContent(bookingContent, booking) {
    this.spinner.show();
    this.selectedBooking = booking;
    this.selectedEquipment = [];
    this.selectedEquipment = booking.equipmentBookings;
    this.expiredBooking = moment().isAfter(moment(booking.vehicleBooking.endTime));
    this.adminBooking = this.selectedBooking.vehicleBooking.account.typeId == 1 ? true : false;
    this.noEquipment = this.selectedEquipment.length > 0 ? false : true;
    this.createStatusForm();
    this.modalService.open(bookingContent, { size: 'lg', scrollable: true, backdropClass: 'light-red-backdrop', centered: true });
    this.spinner.hide();
  }

  createStatusForm() {
    this.statusForm = this.formBuilder.group({
      bookStatus: [this.selectedBooking.vehicleBooking.status]
    });
    if (this.selectedBooking.vehicleBooking.status == 'Confirmed' || this.selectedBooking.vehicleBooking.status == 'Collected') {
      this.disableEdit = false;
      this.statusForm.controls.bookStatus.enable();
    } else {
      this.disableEdit = true;
      this.statusForm.controls.bookStatus.disable();
    }
  }

  banCustomer(selected: Booking) {
    if (this.bookingCollectedStatus(selected.vehicleBooking)) {
      this.userService.updateStatus(selected.vehicleBooking.account).subscribe(x => {
        this.toastr.success('Customer banned successfully.');
        this.bookingService.getAllBooking().subscribe((data: any[]) => {
          this.booking = data;
          this.filteredBookings = this.booking;
          this.setFilterPagination();
          this.noBookingFlag();
          this.modalService.dismissAll();
          this.spinner.hide();
        }, err => {
          console.log(err);
          this.toastr.error('Customer ban failed', 'Failed');
        });
      });
    } else {
      if (selected.vehicleBooking.status == 'Collected') {
        this.toastr.error('The booked vehicle has already been collected');
      }
      else if (selected.vehicleBooking.status != 'Confirmed') {
        this.toastr.error('Booking has to be in confirmed status to ban customer');
      }
      else {
        this.toastr.info('The customer has ' + moment(selected.vehicleBooking.startTime).diff(moment(), 'minutes') + ' minutes for the booking.');
      }
    }
  }

  bookingCollectedStatus(booking: VehicleBooking): boolean {
    if (moment().isAfter(moment(booking.startTime)) && (booking.status == 'Confirmed' || booking.status == 'Cancelled')) {
      return true;
    }
    return false;
  }

  confirmUpdateBooking() {
    let status = this.statusForm.get('bookStatus').value;
    if (this.selectedBooking.vehicleBooking.status == 'Collected' && status == 'Confirmed') {
      this.toastr.error('Cannot update status to Confirmed');
    } else {
      this.selectedBooking.vehicleBooking.status = status;
      this.bookingService.updateBookingStatus(this.selectedBooking).pipe(first())
        .subscribe(
          data => {
            this.toastr.success('Booking update successful');
            this.bookingService.getAllBooking().subscribe((data: any[]) => {
              this.booking = data;
              this.filteredBookings = this.booking;
              this.setFilterPagination();
              this.noBookingFlag();
              if (status == 'Cancelled' || status == 'Completed') {
                this.disableEdit = true;
              }
              this.modalService.dismissAll();
              this.spinner.hide();
            });
            this.modalService.dismissAll();
          }, err => {
            console.log(err)
            if (err == 'Conflict') {
              this.toastr.error('Vehicle or equipment times conflicting');
            }
            else {
              this.toastr.error('Booking update failed');
            }
          });
    }
  }

  navigateToEdit() {
    if (this.expiredBooking) {
      this.toastr.info('The booking is already expired');
    } else {
      this.modalService.dismissAll();
      this.bookingService.selectBooking(this.selectedBooking.vehicleBooking.id)
      this.inventoryService.selectVehicle(this.selectedBooking.vehicleBooking.vehicleId);
      this.router.navigate(['components/booking']);
    }
  }
}
