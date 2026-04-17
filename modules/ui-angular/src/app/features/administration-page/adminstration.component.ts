import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {EuiTabsComponent} from "@eui/components/eui-tabs";

@Component({
  selector: 'app-adminstration',
  templateUrl: './adminstration.component.html',
  styleUrl: './adminstration.component.scss'
})
export class AdminstrationComponent implements OnInit {

  @ViewChild("tabs") tabs: EuiTabsComponent;

  private tabsIndexes = {
    'users': 0,
    'entities': 1
  }

  initialLoginForUser: string;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const login = params['login'];
      if (login) {
        this.initialLoginForUser = login;
        this.tabs.changeTab(this.tabsIndexes['users']);
        this.router.navigate([], {relativeTo: this.route, queryParams: {}, replaceUrl: true});
      }
    });
  }
}
