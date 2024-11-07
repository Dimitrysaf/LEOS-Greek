import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {
  getI18nState,
  getUserPreferences,
  getUserState,
  I18nState,
  UpdateUserPreferencesAction,
  UserPreferences,
  UserService,
  UserState,
} from '@eui/core';
import {Store} from '@ngrx/store';
import {TranslateService} from '@ngx-translate/core';
import {Observable, Subject, take, takeUntil,} from 'rxjs';

import {AppConfigService} from '@/core/services/app-config.service';
import {AppLocalStorageService} from '@/core/services/app-local-storage.service';

import {Profile} from './shared/models/leos.model';
import {Notification} from './shared/models/notification.model';
import {CoEditionServiceWS} from './shared/services/coEdition.websocket.service';
import {NotificationsService} from './shared/services/notifications.service';
import {DocumentService} from "@/shared/services/document.service";
import {DomSanitizer, Title} from '@angular/platform-browser';

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
  i18nState: Observable<I18nState>;
  userPreferencesState: Observable<UserPreferences>;
  profile: Profile;
  isNotificationsShown$: Observable<boolean>;
  listSupportButtons = [
    { id: 1, label: 'app.support.contact-us' },
    { id: 2, label: 'app.support.learn' },
    { id: 3, label: 'app.support.go-pro' },
    { id: 4, label: 'app.support.decide' },
  ];

  notifications: Notification[];

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<any>,
    private config: AppConfigService,
    private translateService: TranslateService,
    private webSocket: CoEditionServiceWS,
    private storage: AppLocalStorageService,
    private notificationsService: NotificationsService,
    private userService: UserService,
    private documentService: DocumentService,
    private titleService: Title,
    private domSanitizer: DomSanitizer
  ) {
    this.isNotificationsShown$ = this.notificationsService.isShown$;
    this.i18nState = this.store.select(getI18nState);
    this.userPreferencesState = this.store.select(getUserPreferences);
    this.userState = this.store.select(getUserState);
    this.userState
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: UserState) => {
        this.userInfos = { ...user };
      });
    this.webSocket.connect();
  }

  ngOnInit() {
    const lang = this.storage.get('lang') ?? 'en';
    this.store.dispatch(new UpdateUserPreferencesAction({ lang }));

    this.config.config.pipe(takeUntil(this.destroy$)).subscribe((config) => {
      this.headerTitleHtml = config.headerTitle;
      const plainTextTitle = this.stripHtmlTags(this.headerTitleHtml);
      this.titleService.setTitle(plainTextTitle);
    });

    this.documentService.documentConfig$
      .pipe(takeUntil(this.destroy$))
      .subscribe((config) => {
        this.profile = config.profile;
      });

    this.notificationsService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe((notifs) => {
        this.notifications = notifs;
      });

    this.notificationsService.fetchNotifications().pipe(take(1)).subscribe();

    this.i18nState.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      const activeLang = state.activeLang ?? 'en';
      this.translateService.use(activeLang);
      this.storage.set('lang', activeLang);
    });
  }

  stripHtmlTags(html: string): string {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;
    return tempElement.textContent || tempElement.innerText || '';
  }

  get showLoggedUser() {
    return !this.profile || this.profile.showLoggedUser;
  }

  ngOnDestroy() {
    this.webSocket.removeSession();
    this.webSocket.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
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
          'https://eceuropaeu.sharepoint.com/sites/gopro',
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
}
