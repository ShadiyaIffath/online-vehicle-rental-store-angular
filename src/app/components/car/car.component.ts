import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

import { InventoryService } from '../../services/inventory/inventory.service'
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Vehicle } from 'app/models/Vehicle';
import { VehicleType } from 'app/models/VehicleType';

const now = new Date();

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {
  vehicleForm: FormGroup;
  vehicleId: any;
  engines = ['Petrol', 'Diesel', 'Hybrid'];
  submitted: boolean = false;
  vehicleTypes: any[];
  vehicle: Vehicle = new Vehicle();
  error: string = '';
  title: string = '';
  button: string = '';
  editing: boolean = false;
  imageUploaded: boolean = false;
  loading: boolean = false;
  today: NgbDateStruct = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };

  constructor(private formBuilder: FormBuilder,
    private inventoryService: InventoryService,
    private authenticationService: AuthenticationService,
    private parserFormatter: NgbDateParserFormatter,
    private _cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService) {
    this.inventoryService.getVehicleTypes().subscribe((data: any[]) => {
      this.vehicleTypes = data;
    });
  }

  ngOnInit(): void {
    var body = document.getElementsByTagName('body')[0];
    body.classList.add('login-page');

    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');

    if (!this.authenticationService.currentUserValue && this.authenticationService.currentUserValue.role !== 'admin') {
      this.router.navigate(['']);
    }
    this.spinner.show();
    if (this.inventoryService.vehicleId != null && this.inventoryService.vehicleId.value != 0) {
      this.vehicleId = this.inventoryService.vehicleId.value;
      this.inventoryService.getVehicleById(this.vehicleId).subscribe((data)=>{
        this.vehicle = data;
        this.title = 'Edit Vehicle';
        this.button = 'Confirm edit';
        this.imageUploaded = true;
        this.assignValuesToForm();
        this.spinner.hide();
      }, err =>{
        this.router.navigate(['/components/manage-vehicles']);
      });
    }else{
      this.spinner.hide();
      this.title = 'New Vehicle';
      this.button = 'Add Vehicle';
    }

      this.vehicleForm = this.formBuilder.group({
        carCode: ['', Validators.required],
        model: ['', Validators.required],
        engine: ['', Validators.required],
        gear: ['', Validators.required],
        type: ['', Validators.required],
        image: ['', Validators.required]
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
  get f() { return this.vehicleForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.vehicleForm.errors || this.vehicleForm.invalid) {
      this.error = 'Invalid data, please check again';
      this.toastr.error('Form incomplete','Failed!');
      return;
    }

    this.error = '';
    this.extractFormValues();
    this.loading = true;
    if(this.vehicle.id == null){
    this.inventoryService.createVehicle(this.vehicle)
      .subscribe(data => {
        this.toastr.success('Successful', 'Vehicle successfully created');
        this.router.navigate(['/components/manage-vehicles']);
      }, error => {
        console.log(error);
        this.error = 'Vehicle creation failed. Please try again later.'
        this.toastr.error( 'Vehicle creation failed.','Failed!');
      });
    }
    else{
      this.inventoryService.updateVehicle(this.vehicle)
      .subscribe(data => {
        this.toastr.success('Vehicle successfully updated','Successful');
        this.inventoryService.removeSelection();
        this.router.navigate(['/components/manage-vehicles']);
      }, error => {
        console.log(error);
        this.error = 'Vehicle update failed. Please try again later.'
        this.toastr.error('Vehicle update failed.','Failed!' );
      });
    }
    this.loading = false;
  }

  uploadImageFile = (files) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    let reader = new FileReader();
    reader.readAsDataURL(fileToUpload);
    reader.onload = () => {
      this.vehicle.image = {
        filename: fileToUpload.name,
        filetype: fileToUpload.type,
        value: (<string>reader.result).split(',')[1]
      }
      this.imageUploaded = true;
    };
    // need to run CD since file load runs outside of zone
    this._cdr.markForCheck();
  }

  extractFormValues(): void {
    this.vehicle.carCode = this.vehicleForm.get('carCode').value;
    this.vehicle.model = this.vehicleForm.get('model').value;
    this.vehicle.typeId = this.vehicleForm.get('type').value;
    if (this.vehicleForm.get('gear').value == 'automatic') {
      this.vehicle.automatic = true;
    }
    else {
      this.vehicle.automatic = false;
    }
    this.vehicle.engine = this.vehicleForm.get('engine').value;
    if (this.vehicle.id == null) { 
      this.vehicle.dayAdded = this.parserFormatter.format(this.today);
      this.vehicle.active = true;
    }
  }

  back() {
    this.inventoryService.removeSelection();
    this.router.navigate(['components/manage-vehicles']);
  }

  assignValuesToForm(){
    let gear = this.vehicle.automatic ==true ? 'automatic' : 'manual';
    this.vehicleForm = this.formBuilder.group({
      carCode: [this.vehicle.carCode, Validators.required],
      model: [this.vehicle.model, Validators.required],
      engine: [this.vehicle.engine, Validators.required],
      gear: [gear, Validators.required],
      type: [this.vehicle.typeId, Validators.required]
    });    
  }
}
