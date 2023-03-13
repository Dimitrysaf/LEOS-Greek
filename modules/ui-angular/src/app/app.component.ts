import { Component, OnDestroy, OnInit } from '@angular/core';
import { getUserState, UserState } from '@eui/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AppConfigService } from '@/core/services/app-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  headerTitleHtml = '';
  headerLogoUrl =
    process.env.NG_APP_LEOS_INSTANCE === 'cn'
      ? 'assets/images/logo-cn-w.svg'
      : '';
  userInfos: UserState;
  // Observe state changes
  userState: Observable<UserState>;
  // an array to keep all subscriptions and easily unsubscribe
  subs: Subscription[] = [];

  constructor(private store: Store<any>, private config: AppConfigService) {
    this.userState = this.store.select(getUserState);
    this.subs.push(
      this.userState.subscribe((user: UserState) => {
        this.userInfos = { ...user };
      }),
    );
  }

  ngOnInit() {
    this.config.config.subscribe(
      (config) => (this.headerTitleHtml = config.headerTitle),
    );
  }

  ngOnDestroy() {
    this.subs.forEach((s: Subscription) => s.unsubscribe());
  }
}
