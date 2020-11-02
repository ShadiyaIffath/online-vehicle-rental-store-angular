import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { Booking } from 'app/models/Booking';
import { BookingService } from 'app/services/booking/booking.service';
import { InventoryService } from 'app/services/inventory/inventory.service';
import { User } from 'app/models/User';
import { UsersService } from 'app/services/users/users.service';
import { first } from 'rxjs/operators';

const now = new Date();
@Component({
  selector: 'app-manage-booking',
  templateUrl: './manage-booking.component.html',
  styleUrls: ['./manage-booking.component.css']
})
export class ManageBookingComponent implements OnInit {
  total: number;
  noBookings: boolean = false;
  noEquipment: boolean = false;
  confirmed: boolean = true;
  selectedBooking: Booking;
  currentIndex = -1;
  currentBooking = null;
  vehicleTypes: any[];
  status = [{ id: 0, type: 'All' }, { id: 1, type: 'Confirmed' }, { id: 2, type: 'Cancelled' }, { id: 3, type: 'Abandoned' }, { id: 4, type: 'Completed' }];
  activeStatus = [{ id: 1, type: 'Confirmed' }, { id: 2, type: 'Cancelled' }, { id: 3, type: 'Abandoned' }, { id: 4, type: 'Completed' }];
  booking: any[];
  selectedEquipment = [];
  filteredBookings: Booking[] = [];
  bookingStatus: any;
  //pagination attributes
  config: any;
  statusForm: FormGroup;

  constructor(private router: Router,
    private toastr: ToastrService,
    private inventoryService: InventoryService,
    private userService: UsersService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private bookingService: BookingService) {
    this.spinner.show();
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
      this.bookingService.getAllBooking().subscribe((data: any[]) => {
        this.booking = data;
        this.filteredBookings = this.booking;
        this.setFilterPagination();
        this.noBookingFlag();
        this.modalService.dismissAll();
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        this.toastr.error('Booking removal failed');
      });
    });
  }

  openBookingContent(bookingContent, booking) {
    this.spinner.show();
    this.selectedBooking = booking;
    this.selectedEquipment = [];
    this.selectedEquipment = booking.equipmentBookings;
    this.noEquipment = this.selectedEquipment.length > 0 ? false : true;
    this.createStatusForm();
    this.bookingStatus = this.activeStatus.filter(x => x.type == this.selectedBooking.vehicleBooking.status)[0].type;
    this.modalService.open(bookingContent, { size: 'lg', scrollable: true, backdropClass: 'light-red-backdrop', centered: true });
    this.spinner.hide();
  }

  createStatusForm(){
    let status = this.activeStatus.filter(x => x.type == this.selectedBooking.vehicleBooking.status)[0].type;
    console.log(status);
    this.statusForm = this.formBuilder.group({
      bookStatus : [ this.selectedBooking.vehicleBooking.status]
    });
  }

  banCustomer(selected: User) {
    this.userService.updateStatus(selected).subscribe(x => {
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
  }

  confirmUpdateBooking() {
    this.selectedBooking.vehicleBooking.status = this.statusForm.get('bookStatus').value;
    console.log(this.selectedBooking.vehicleBooking.status);
    this.bookingService.updateBookingStatus(this.selectedBooking).pipe(first())
      .subscribe(
        data => {
          this.toastr.success('Booking update successful');
          this.bookingService.getAllBooking().subscribe((data: any[]) => {
            this.booking = data;
            this.filteredBookings = this.booking;
            this.setFilterPagination();
            this.noBookingFlag();
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

  navigateToEdit(){
    this.modalService.dismissAll();
    this.bookingService.selectBooking(this.selectedBooking.vehicleBooking.id)
    this.inventoryService.selectVehicle(this.selectedBooking.vehicleBooking.vehicleId);
    this.router.navigate(['components/booking']);   
  }
}
