import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';

@Component({
  selector: 'anvy-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  navItems: Array<NavItem> = [
    {
      name: 'Product',
      path: '/product',
      isActive: false
    },
    {
      name: 'Contact',
      path: '/contact',
      isActive: false
    }
  ];
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe((_event: Event) => {
      if (_event instanceof NavigationEnd) {
        this.navItems = this.navItems.map(item => {
          item.isActive = item.path === _event.url;
          return item;
        })
      }
    })
  }
}

interface NavItem {
  name: string,
  path: string,
  isActive: boolean
}
