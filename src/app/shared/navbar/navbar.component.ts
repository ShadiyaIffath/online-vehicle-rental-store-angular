import { Component, OnInit, ElementRef, Input, Output } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from 'app/services/authentication/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { EventEmitter } from '@angular/core';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    @Input() userLoggedIn: any =null;
    @Output()open: EventEmitter<boolean> = new EventEmitter();
    private toggleButton: any;
    private sidebarVisible: boolean;
    adminControls: boolean = false;
    loggedIn: boolean = false;

    constructor(public location: Location,
        private element: ElementRef,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private toastr: ToastrService) {
        this.sidebarVisible = false;
        if (!this.authenticationService.isTokenExpired()) {
            this.loggedIn = true;
            if (this.authenticationService.currentUserValue.role == 'admin') {
                this.adminControls = true;
            }
        }
    }

    ngOnInit() {
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
        this.authenticationService.getEmitter().subscribe((customObject) => {
            if (!this.authenticationService.isTokenExpired()) {
                this.loggedIn = true;
                if (customObject != null) {
                    if (customObject.role == 'admin') {
                        this.adminControls = true;
                    }
                }
            }
        });
    }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const html = document.getElementsByTagName('html')[0];
        setTimeout(function () {
            toggleButton.classList.add('toggled');
        }, 500);
        html.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const html = document.getElementsByTagName('html')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        html.classList.remove('nav-open');
    };
    sidebarToggle() {
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    };

    logout() {
        this.authenticationService.logout();
        this.loggedIn = false;
        this.adminControls = false;
        this.open.emit(false);
        this.toastr.success('Logged out', 'Successful');
    }

    toggleSidebar(){
         this.open.emit();
    }

}
