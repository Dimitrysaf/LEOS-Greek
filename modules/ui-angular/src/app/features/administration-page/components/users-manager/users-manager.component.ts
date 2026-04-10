import {Component, OnInit} from '@angular/core';
import {AdministrationService} from "@/shared/services/administration.service";
import {User} from "@/shared";
import {EuiPaginationEvent} from "@eui/components/eui-paginator";
import {SortEvent} from "@eui/components/eui-table";
import {EuiDialogService} from "@eui/components/eui-dialog";
import {LeosDialogService} from "@/shared/services/leos-dialog.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-users-manager',
  templateUrl: './users-manager.component.html',
  styleUrl: './users-manager.component.scss',
  providers: [AdministrationService]
})
export class UsersManagerComponent implements OnInit {

  query: string = '';
  users: User[] = [];
  page = 0;
  pageSize = 10;
  totalElements: number = 0;
  loading = false;
  selectedUser: User;
  private sort: string = 'lastName';
  private order: string = 'asc';

  private firstFromPageChange = true;
  private firstFromSortChange = true;


  constructor(private adminService: AdministrationService,
              private euiDialogService: EuiDialogService,
              private leosDialogService: LeosDialogService,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.search();
  }

  protected search(query = this.query, page = this.page, pageSize = this.pageSize, sortBy = this.sort, sortOrder = this.order) {
    this.query = query ?? '';
    this.page = page ?? 0;
    this.pageSize = pageSize ?? 10;
    this.sort = sortBy ?? 'lastName';
    this.order = sortOrder ?? 'asc';
    this.loading = true;
    if (this.selectedUser && !this.selectedUser.login) {
      this.selectedUser = null;
    }
    this.adminService.searchUsers(this.query, this.page, this.pageSize, this.sort, this.order)
      .subscribe((response) => {
        this.users = response.content;
        this.page = response.number;
        this.totalElements = response.totalElements;
        this.loading = false;
      });
  }

  protected addUser() {
    this.selectedUser = {} as User;
  }

  protected onUserSelect(row: any) {
    this.selectedUser = row;
  }

  protected onPageChange(event: EuiPaginationEvent) {
    if (this.firstFromPageChange) {
      // workaround for fake event at page load
      this.firstFromPageChange = false;
    } else {
      this.search(this.query, event.page, event.pageSize);
    }
  }

  sortChanged(event: SortEvent) {
    if (this.firstFromSortChange) {
      // workaround for fake event at page load
      this.firstFromSortChange = false;
    } else {
      this.search(this.query, this.page, this.pageSize, event.sort, event.order);
    }
  }

  protected onUserEditComplete(user: User) {
    if (!user?.login) {
      this.selectedUser = null;
    } else {
      this.selectedUser = user;
      this.search();
    }
  }

  protected deleteUser(user: User) {
    this.onUserSelect(user);
    this.euiDialogService.openDialog({
      title: "page.workspace.administration.user-info.user-delete-dialog.title",
      content: this.translateService.instant("page.workspace.administration.user-info.user-delete-dialog.content", {user: user}),
      typeClass: "warning",
      isMessageBox: true,
      accept: () => this.adminService.deleteUser(user.login).subscribe({
          next: () => {
            this.selectedUser = null;
            this.search(this.query)
          },
          error: (error) => {
          this.leosDialogService.showError(
            "page.workspace.administration.user-info.user-delete-error-title",
            error.error?.message ?? error.message ?? "global.actions.unknown-error", {}, true)
        }
      })
    })
  }
}
