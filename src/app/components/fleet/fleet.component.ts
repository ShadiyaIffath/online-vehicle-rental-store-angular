import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fleet',
  templateUrl: './fleet.component.html',
  styleUrls: ['./fleet.component.css']
})
export class FleetComponent implements OnInit {
  vehicleTypes: any []= [
    {
      id: 1,
      type: "Small town car",
      pricePerDay: 40,
      image: "https://www.malkey.lk/wp-content/uploads/2019/09/suzuki-alto-premium-sri-lanka.jpg"
    },
    {
      id: 2,
      type: "Small family hatchback",
      pricePerDay: 55,
      image: "https://www.malkey.lk/wp-content/uploads/2019/09/suzuki-alto-premium-sri-lanka.jpg"
    },
    {
      id: 3,
      type: "Large family saloon",
      pricePerDay: 60,
      image: "https://www.malkey.lk/wp-content/uploads/2019/09/suzuki-alto-premium-sri-lanka.jpg"
    },
    {
      id: 4,
      type: "Large family estate",
      pricePerDay: 75,
      image: "https://www.malkey.lk/wp-content/uploads/2019/09/suzuki-alto-premium-sri-lanka.jpg"
    },
    {
      id: 5,
      type: "Medium vans",
      pricePerDay: 70,
      image: "https://www.malkey.lk/wp-content/uploads/2019/09/suzuki-alto-premium-sri-lanka.jpg"
    }
  ];
  filteredTypes: any[];

  constructor() {
    this.filteredTypes = this.vehicleTypes;
   }

  ngOnInit(): void {
  }

  typeChecked() : void{
    this.filteredTypes.filter(item=> { return item.checked;} );
  }
  
  filteredInventory(){
    this.typeChecked();
    return this.filteredTypes;
  }
}

