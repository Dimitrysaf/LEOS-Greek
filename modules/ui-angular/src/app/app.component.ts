import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import {
  getI18nState,
  getUserPreferences,
  getUserState,
  I18nState,
  UpdateUserPreferencesAction,
  UserPreferences,
  UserState,
} from '@eui/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';

import { AppConfigService } from '@/core/services/app-config.service';

import { LocalStorageService } from './core/services/local-storage.service';
import { CoEditionServiceWS } from './shared/services/coEdition.websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  // Add `leos` class on the root element. It is required for some style
  // selectors. It used to reside on the VAADIN .v-app root element.
  @HostBinding('class') class = 'leos';

  headerTitleHtml = '';
  headerLogoUrl = document.baseURI;
  headerLogoImgUrl =
    process.env.NG_APP_LEOS_INSTANCE === 'cn'
      ? 'assets/images/logo-cn-w.svg'
      : '';
  userInfos: UserState;
  // Observe state changes
  userState: Observable<UserState>;
  // an array to keep all subscriptions and easily unsubscribe
  subs: Subscription[] = [];
  i18nState: Observable<I18nState>;
  userPreferencesState: Observable<UserPreferences>;
  private storage = new LocalStorageService();

  constructor(
    private store: Store<any>,
    private config: AppConfigService,
    private translateService: TranslateService,
    private webSocket: CoEditionServiceWS,
  ) {
    this.i18nState = this.store.select(getI18nState);
    this.userPreferencesState = this.store.select(getUserPreferences);
    this.userState = this.store.select(getUserState);
    this.subs.push(
      this.userState.subscribe((user: UserState) => {
        this.userInfos = { ...user };
      }),
    );
    this.webSocket.connect();
  }

  ngOnInit() {
    const lang = this.storage.get('lang');
    this.store.dispatch(new UpdateUserPreferencesAction({ lang }));
    this.subs.push(
      this.config.config.subscribe(
        (config) => (this.headerTitleHtml = config.headerTitle),
      ),
    );

    this.subs.push(
      this.i18nState.subscribe((state) => {
        this.translateService.use(state.activeLang);
        this.storage.set('lang', state.activeLang);
      }),
    );
  }

  ngOnDestroy() {
    this.webSocket.removeSession();
    this.webSocket.disconnect();
    this.subs.forEach((s: Subscription) => s.unsubscribe());
  }
}
