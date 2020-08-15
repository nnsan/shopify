import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { CheckoutService , CheckoutInterface} from '../services';
import { Subscription } from 'rxjs';

interface NavItem {
  name: string,
  path: string,
  isActive: boolean
}

@Component({
  selector: 'anvy-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
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

  totalCheckoutItem: number;
  subscriptions: Array<Subscription> = [];

  constructor(private router: Router, private checkoutService: CheckoutService) {
    this.totalCheckoutItem = 0;
    const checkoutSubscription = this.checkoutService.cart.subscribe((checkout: CheckoutInterface) => {
      if (checkout.lineItems) {
        this.totalCheckoutItem = checkout.lineItems.length;
      }
    });

    this.subscriptions.push(checkoutSubscription);
  }

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

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  goCheckout() {
    this.router.navigate(['checkout']);
  }
}
