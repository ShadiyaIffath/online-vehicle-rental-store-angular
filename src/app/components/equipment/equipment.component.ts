import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";

import { InventoryService } from 'app/services/inventory/inventory.service';
import { AuthenticationService } from 'app/services/authentication/authentication.service';
import { Equipment } from 'app/models/Equipment';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css']
})
export class EquipmentComponent implements OnInit {
  equipmentForm: FormGroup;
  submitted: boolean = false;
  equipment: Equipment = new Equipment();
  error: string = '';
  title: string = '';
  button: string = '';

  constructor(private formBuilder: FormBuilder,
    private inventoryService: InventoryService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {

    if (!this.authenticationService.currentUserValue || this.authenticationService.currentUserValue.role !== 'admin') {
      this.router.navigate(['']);
    }
    this.spinner.show();
    var body = document.getElementsByTagName('body')[0];
    body.classList.add('login-page');

    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');

    this.equipmentForm = this.formBuilder.group({
      name: ['', Validators.required],
      features: [''],
      price:[Validators.pattern("^[0-9]*$"), Validators.required],
      category: ['', Validators.required]
    });

    this.title = 'New Equipment';
    this.button = 'Add Equipment';
    this.spinner.hide();
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('login-page');

    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
  }

  // convenience getter for easy access to form fields
  get f() { return this.equipmentForm.controls; }

  back(){
    this.router.navigate(['/components/manage-equipment']);
  }
}
