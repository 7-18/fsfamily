import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MatSidenav, MatSidenavContainer } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  opened = false;
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  constructor(public _userService: UserService, private observer: BreakpointObserver) {}
  
  ngAfterViewInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
    this.observer.observe(['(min-width: 1000px)']).subscribe((res) => {
      if (res.matches) {
        if (this.sidenav.mode = 'over') {
        this.sidenav.mode = 'side'
        this.sidenav.open();
        };
      }
    })
  }
  ngOnInit(): void {}
}
