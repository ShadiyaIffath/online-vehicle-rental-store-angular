import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";

import { AuthenticationService } from 'app/services/authentication/authentication.service';
import { Equipment } from 'app/models/Equipment';
import { EquipmentService } from 'app/services/equipment/equipment.service';
import { ToastrService } from 'ngx-toastr';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

const now = new Date();

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css']
})
export class EquipmentComponent implements OnInit {
  equipmentForm: FormGroup;
  submitted: boolean = false;
  equipment: Equipment = new Equipment();
  equipmentId: any;
  categories: any[];
  error: string = '';
  title: string = '';
  button: string = '';
  today: NgbDateStruct = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };

  constructor(private formBuilder: FormBuilder,
    private equipmentService: EquipmentService,
    private authenticationService: AuthenticationService,
    private parserFormatter: NgbDateParserFormatter,
    private toastr: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {

    if (!this.authenticationService.currentUserValue || this.authenticationService.currentUserValue.role !== 'admin') {
      this.router.navigate(['']);
    }
    this.spinner.show();

    this.equipmentService.getEquipmentCategories().subscribe((data: any[]) => {
      this.categories = data;
    });
    var body = document.getElementsByTagName('body')[0];
    body.classList.add('login-page');

    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');

    this.equipmentForm = this.formBuilder.group({
      name: ['', Validators.required],
      features: [''],
      price: [Validators.pattern("^[0-9]*$"), Validators.required],
      category: ['', Validators.required]
    });

    if (this.equipmentService.equipmentId != null && this.equipmentService.equipmentId.value != 0) {
      this.equipmentId = this.equipmentService.equipmentId.value;
      this.equipmentService.getEquipmentById(this.equipmentId).subscribe((data) => {
        this.equipment = data;
        this.title = 'Edit Equipment';
        this.button = 'Confirm edit';
        this.assignValuesToForm();
        this.spinner.hide();
      }, err => {
        this.router.navigate(['/components/equipment-vehicles']);
        this.spinner.hide();
      }
      );
    } else {
      this.title = 'New Equipment';
      this.button = 'Add Equipment';
      this.spinner.hide();
    }

  }
  ngOnDestroy() {
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('login-page');

    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
    this.equipmentService.removeSelection();
  }

  // convenience getter for easy access to form fields
  get f() { return this.equipmentForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.equipmentForm.errors || this.equipmentForm.invalid) {
      this.error = 'Invalid data, please check again';
      this.toastr.error('Form incomplete', 'Failed!');
      return;
    }

    this.error = '';
    this.extractFormValues();
    this.spinner.show();
    if (this.equipmentId == null) {
      this.equipmentService.createVehicle(this.equipment)
        .subscribe(data => {
          this.toastr.success('Successful', 'Equipment successfully created');
          this.router.navigate(['/components/manage-equipment']);
        }, error => {
          if (error === "Conflict") {
            this.equipmentForm.controls['name'].setErrors({ 'incorrect': true });
            this.error = "Equipment name entered already exists";
          }
          else {
            this.error = 'Equipment creation failed. Please try again later.'
          }
          this.toastr.error('Equipment creation failed.', 'Failed!');
        });
    }
    else{
      this.equipmentService.updateEquipment(this.equipment)
      .subscribe(data => {
        this.toastr.success('Equipment successfully equipment','Successful');
        this.equipmentService.removeSelection();
        this.router.navigate(['/components/manage-equipment']);
      }, error => {
        if (error === "Conflict") {
          this.equipmentForm.controls['name'].setErrors({ 'incorrect': true });
          this.error = "Equipment name entered already exists";
        }
        else {
          this.error = 'Equipment update failed. Please try again later.'
        }
        this.toastr.error('Equipment update failed.', 'Failed!');
      });
    }
    this.spinner.hide();
  }

  back() {
    this.equipmentService.removeSelection();
    this.router.navigate(['/components/manage-equipment']);
  }

  extractFormValues(): void {
    this.equipment.categoryId = this.equipmentForm.get('category').value;
    this.equipment.features = this.equipmentForm.get('features').value;
    this.equipment.name = this.equipmentForm.get('name').value;
    this.equipment.purchasedPrice = this.equipmentForm.get('price').value;
    if (this.equipment.id == null) { 
    this.equipment.dayAdded = this.parserFormatter.format(this.today);
    }
  }

  assignValuesToForm(){
    this.equipmentForm = this.formBuilder.group({
      name: [this.equipment.name, Validators.required],
      features: [this.equipment.features, Validators.required],
      price: [this.equipment.purchasedPrice, Validators.required],
      category: [this.equipment.category.id, Validators.required]
    });   
  }
}
