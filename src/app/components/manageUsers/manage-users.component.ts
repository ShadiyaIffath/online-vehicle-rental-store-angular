import { Component, OnInit } from '@angular/core';
import { formatDate } from "@angular/common";
import { Router } from '@angular/router';
import { User } from 'app/models/User';
import { UsersService } from 'app/services/users/users.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  availability = [{ id: 0, type: 'All' }, { id: 1, type: 'Active' }, { id: 2, type: 'Inactive' }];
  users: User[];
  filteredUsers: User[];
  noUsers: boolean = false;
  total: number = 0;

  constructor(private userService: UsersService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.userService.getUsers().subscribe((data: any[]) => {
      this.users = data;
      this.filteredUsers = this.users;
      this.total = this.getActiveUsersCount();
      this.noUsersTag();
      this.spinner.hide();
    });
  }

  getActiveUsersCount(): number {
    let count = 0;
    for (var index: number = 0; index < this.users.length; index++) {
      if (this.users[index].active == true) {
        count++;
      }
    }
    return count;
  }

  activeFilter(event: any) {
    let filter = event.target.value;
    if (filter == 'All') {
      this.filteredUsers = this.users;
    }
    else {
      let active = filter == 'Active' ? true : false;
      this.filteredUsers = this.users.filter(function (car) {
        return car.active === active;
      });
    }
    this.noUsersTag();
  }

  noUsersTag() {
    if (this.filteredUsers.length == 0) {
      this.noUsers = true;
    }
    else {
      this.noUsers = false;
    }
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe(() => {
      this.toastr.success('User removed successfully', 'Deleted');
      this.spinner.show();
      this.userService.getUsers().subscribe((data: any[]) => {
        this.users = data;
        this.filteredUsers = this.users;
        this.total = this.getActiveUsersCount();
        this.noUsersTag();
        this.spinner.hide();
      });
    }, error => {
      this.toastr.error('User removal failed', 'Failed');
    })
  }

  updateUserStatus(selected: User) {
    let user = selected;
    this.userService.updateStatus(selected).subscribe(x => {
      this.toastr.success('User status updated.', 'Successful');
      this.total = !user.active == true ? this.total - 1 : this.total + 1;
      selected = user;
    }, err => {
      console.log(err);
      this.toastr.error('Status update failed', 'Failed');
    });
  }

}
