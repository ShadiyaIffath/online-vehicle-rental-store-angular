import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { NgbDateStruct,NgbDate } from '@ng-bootstrap/ng-bootstrap';
import * as Rellax from 'rellax';
import * as moment from 'moment';

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
    date : Date = new Date();
    dropOffDay: NgbDateStruct;
    pickUpDay: NgbDateStruct;

    displayMessage = "Sort by...";
    sortOptions = ["Balance", "Company", "Last Name"];
    gear = ["Automatic","Manual"];

    changeMessage(selectedItem: string){
       this.displayMessage = "Sort by " + selectedItem;
     }

    constructor( private renderer : Renderer2) {}

    ngOnInit() {
       var rellaxHeader = new Rellax('.rellax-header');
        var body = document.getElementsByTagName('body')[0];
        body.classList.add('index-page');
    }
    ngOnDestroy(){
        var body = document.getElementsByTagName('body')[0];
        body.classList.remove('index-page');
    }
}
