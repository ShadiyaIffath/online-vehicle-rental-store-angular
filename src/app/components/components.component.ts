import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import * as Rellax from 'rellax';
import * as moment from 'moment';
import { NgxSpinnerService } from "ngx-spinner";
import { InventoryService } from 'app/services/inventory/inventory.service';

const now = new Date();
@Component({
    selector: 'app-components',
    templateUrl: './components.component.html',
    styles: [`
    ngb-progressbar {
        margin-top: 5rem;
    }
    `]
})

export class ComponentsComponent implements OnInit, OnDestroy {
    vehicleList;
    vehicles;
    noVehicles: boolean = false;
    constructor(private renderer: Renderer2,
        private inventoryService: InventoryService,
        private spinner: NgxSpinnerService) { }

    ngOnInit() {
        var rellaxHeader = new Rellax('.rellax-header');
        var body = document.getElementsByTagName('body')[0];
        body.classList.add('index-page');
        this.spinner.show();
        this.inventoryService.getVehicles().subscribe((data: any[]) => {
            this.vehicleList = data.filter(function(x) { return  x.active == true});
            this.vehicles = data.filter(function(x) { return  x.active == true});
            if (this.vehicleList.length === 0) {
                this.noVehicles = true;
            }
            else {
                this.noVehicles = false;
            }
            this.spinner.hide();
        });

        (function(d, m){
            var kommunicateSettings = {"appId":"149c4042aa8bbb4cabfc4e65a27ca2d56","popupWidget":true,"automaticChatOpenOnNavigation":true};
            var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
            s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
            var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
            (window as any).kommunicate = m; m._globals = kommunicateSettings;
        })(document, (window as any).kommunicate || {});
    }

    ngOnDestroy() {
        var body = document.getElementsByTagName('body')[0];
        body.classList.remove('index-page');
    }
}
