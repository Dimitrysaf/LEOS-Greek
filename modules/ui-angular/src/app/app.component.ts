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
import { map, Observable, of, Subscription } from 'rxjs';

import { AppConfigService } from '@/core/services/app-config.service';
import { AppLocalStorageService } from '@/core/services/app-local-storage.service';

import { Profile } from './shared/models/leos.model';
import { Notification } from './shared/models/notification.model';
import { CoEditionServiceWS } from './shared/services/coEdition.websocket.service';
import { NotificationsService } from './shared/services/notifications.service';

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
  profile: Profile;
  isNotificationsShown$: Observable<boolean>;
  contentAvailable$: Observable<boolean>;
  listSupportButtons = [
    { id: 1, label: 'app.support.contact-us' },
    { id: 2, label: 'app.support.learn' },
    { id: 3, label: 'app.support.go-pro' },
    { id: 4, label: 'app.support.decide' },
  ];

  notifications: Notification[];

  constructor(
    private store: Store<any>,
    private config: AppConfigService,
    private translateService: TranslateService,
    private webSocket: CoEditionServiceWS,
    private storage: AppLocalStorageService,
    private notificationsService: NotificationsService,
  ) {
    this.isNotificationsShown$ = this.notificationsService.isShown$;
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
    this.checkIfContentAvailable();
    this.store.dispatch(new UpdateUserPreferencesAction({ lang }));
    this.subs.push(
      this.config.config.subscribe((config) => {
        this.headerTitleHtml = config.headerTitle;
        this.profile = config.profile;
      }),
    );

    this.subs.push(
      this.notificationsService
        .fetchNotifications()
        .subscribe((notifications) => {
          this.notifications = notifications;
          this.checkIfContentAvailable();
        }),
    );

    this.subs.push(
      this.i18nState.subscribe((state) => {
        this.translateService.use(state.activeLang);
        this.storage.set('lang', state.activeLang);
      }),
    );
  }

  get showLoggedUser() {
    return !this.profile || this.profile.showLoggedUser;
  }

  ngOnDestroy() {
    this.webSocket.removeSession();
    this.webSocket.disconnect();
    this.subs.forEach((s: Subscription) => s.unsubscribe());
  }

  onListItemClicked(item) {
    switch (item.id) {
      case 1: {
        window.location.href =
          'mailto:SG-DECIDE-FORMATION-SUPPORT@ec.europa.eu';
        break;
      }
      case 2: {
        window.location.href =
          'https://eceuropaeu.sharepoint.com/teams/GRP-PRO-SG-EU-PMH-IT-training-support/SitePages/Edit.aspx';
        break;
      }
      case 3: {
        window.open(
          'https://webgate.ec.europa.eu/fpfis/wikis/pages/viewpage.action?spaceKey=REGISTRY&title=Home',
          '_blank',
        );
        break;
      }
      case 4: {
        window.location.href =
          'https://intragate.ec.europa.eu/decide/sep/entrance';
        break;
      }
    }
  }

  toggleNotifications(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    setTimeout(() => {
      this.notificationsService.toggleNotifications();
    }, 10);
  }

  checkIfContentAvailable(): void {
    if (this.notifications) {
      this.contentAvailable$ = of(this.notifications).pipe(
        map((notifications) =>
          notifications.some((notification) => {
            const currentTime = Math.floor(Date.now() / 1000);
            return notification.end > currentTime;
          }),
        ),
      );
    } else {
      this.contentAvailable$ = of(false);
    }
  }
}
