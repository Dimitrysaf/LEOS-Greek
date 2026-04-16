import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User, Entity} from "@/shared";
import {apiBaseUrl} from "../../../config";
import {Observable, Subject, takeUntil} from "rxjs";
import {Page} from "@/shared/models/page.model";
import {Store} from "@ngrx/store";
import {getUserState, UserState} from "@eui/core";

@Injectable()
export class AdministrationService implements OnDestroy {
  private userState: Observable<UserState<any>>;
  private destroy$ = new Subject<void>();
  private userInfos: UserState;


  constructor(private httpClient: HttpClient, private store: Store<any>) {
    this.userState = this.store.select(getUserState);
    this.userState
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: UserState) => {
        this.userInfos = { ...user };
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    }

  getUserEntities() {
    return this.httpClient.get<Entity[]>(
      `${apiBaseUrl}/secured/administration/entities`,
    );
  }

  getEntityUsers(entityId: string, page: number, size: number, sortBy: string, sortOrder: string): Observable<Page<User>> {
    return this.httpClient.get<Page<User>>(
      `${apiBaseUrl}/secured/administration/users?entityId=${entityId}&page=${page}&size=${size}&sort=${sortBy},${sortOrder}`
    );
  }

  addEntity(entity: Entity) {
    return this.httpClient.post(
      `${apiBaseUrl}/secured/administration/entities`,
      entity,
    );
  }

  updateEntity(entity: Entity) {
    return this.httpClient.patch(
      `${apiBaseUrl}/secured/administration/entities`,
      entity,
    );
  }

  searchUsers(query: string, page: number, size: number, sortBy: string, sortOrder: string): Observable<Page<User>> {
    return this.httpClient.get<Page<User>>(
      `${apiBaseUrl}/secured/administration/users?query=${query}&page=${page}&size=${size}&sort=${sortBy},${sortOrder}`,
    );
  }

  createUser(user: User): Observable<User> {
    return this.httpClient.post<User>(
      `${apiBaseUrl}/secured/administration/users`,
      user
    );
  }

  updateUser(user: User): Observable<User> {
    return this.httpClient.patch<User>(
      `${apiBaseUrl}/secured/administration/users`,
      user
    );
  }

  deleteUser(login: string) {
      return this.httpClient.delete(`${apiBaseUrl}/secured/administration/users/${login}`);
  }

  deleteEntity(id: string) {
    return this.httpClient.delete(`${apiBaseUrl}/secured/administration/entities/${id}`);
  }

  getUserDetails(login: string): Observable<User> {
    return this.httpClient.get<User>(`${apiBaseUrl}/secured/administration/users/${login}`);
  }
}
