import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Entity, LeosAppConfig, LeosConfig, User} from "@/shared";
import {EuiPaginationEvent} from "@eui/components/eui-paginator";
import {EuiButtonModule} from "@eui/components/eui-button";
import {SharedModule} from "@/shared/shared.module";
import {TranslateModule} from "@ngx-translate/core";
import {AdministrationService} from "@/shared/services/administration.service";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {LeosDialogService} from "@/shared/services/leos-dialog.service";
import {validate} from "@/shared/utils/form.utils";
import {SortEvent} from "@eui/components/eui-table";
import {AppConfigService} from "@/core/services/app-config.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-entity-info',
  standalone: true,
  imports: [
    EuiButtonModule,
    SharedModule,
    TranslateModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './entity-info.component.html',
  styleUrl: './entity-info.component.scss'
})
export class EntityInfoComponent implements OnInit {

  @Output() entityEditComplete = new EventEmitter<Entity>();

  @Input() users: User[] = [];
  public entityForm: FormGroup;

  private _selectedEntity: Entity;
  page = 0;
  pageSize = 10;
  sort: string = 'lastName';
  order: string = 'asc';
  totalElements: number = 0;

  private firstFromPageChange = true;
  private firstFromSortChange = true;
  private config: LeosConfig & LeosAppConfig


  @Input() set selectedEntity(value: Entity) {
    this._selectedEntity = value;
    if (!!value) {
      if (this.config) {
        this.setupNameValue(value.name);
      }
      if (value.id === undefined) {
        this.editing = true;
        this.users = [];
      } else {
        this.editing = false;
        this.loading = true;
        this.users = [];
        this.loadUsers();
      }
    }
  }
  get selectedEntity(): Entity {
    return this._selectedEntity;
  }

  protected entities: Entity[] =  [];
  protected loading = false;
  protected editing = false;
  protected entityPrefix = '';

  constructor(private adminService: AdministrationService,
              private fb: FormBuilder,
              private dialogService: LeosDialogService,
              private appConfig: AppConfigService) {
    this.entityForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^([a-zA-Z0-9_])+(\.?[a-zA-Z0-9_])*$/)]]
    });
  }

  ngOnInit(): void {
    this.appConfig.config.subscribe( config => {
      this.config = config;
      this.setupNameValue(this.selectedEntity?.name);
    });
  }

  private setupNameValue(name: string) {
    if (!this.config.userAppPermissions.includes('CAN_MANAGE_ALL_ENTITIES')) {
      this.entityPrefix = !this.isTheDefaultEntityOrganization
        ? this.config.user.defaultEntity.organizationName + '.'
        : '';
      if (this.selectedEntity) {
        const dotIndex = name?.indexOf(this.entityPrefix);
        const editablePart = !name || dotIndex < 0 ? name : name.substring(this.entityPrefix.length);
        this.entityForm.patchValue({name: editablePart}, {emitEvent: false});
      }
    } else {
      this.entityForm.patchValue({name: name}, {emitEvent: false});
    }
  }

  private loadUsers() {
    this.adminService.getEntityUsers(this.selectedEntity.id, this.page, this.pageSize, this.sort, this.order)
      .subscribe((response) => {
        this.users = response.content;
        this.page = response.number;
        this.totalElements = response.totalElements;
        this.loading = false;
      });
  }

  onPageChange(event: EuiPaginationEvent) {
    this.page = event.page;
    this.pageSize = event.pageSize;
    if (this.firstFromPageChange) {
      // workaround for fake event at page load
      this.firstFromPageChange = false;
    } else {
      this.loadUsers();
    }
  }

  sortChanged(event: SortEvent) {
    this.sort = event.sort;
    this.order = event.order;
    if (this.firstFromSortChange) {
      // workaround for fake event at page load
      this.firstFromSortChange = false;
    } else {
      this.loadUsers();
    }
  }

  editSaveEntity() {
    const method: ((user: Entity) => Observable<Entity>) = !!this.selectedEntity.id
      ? this.adminService.updateEntity.bind(this.adminService)
      : this.adminService.addEntity.bind(this.adminService);
    const methodName = method.name.substring(6); // 'bound ' prepended to the method name after binding
    if (validate(this.entityForm, {
      service: this.dialogService,
      title: `page.workspace.administration.entity-info.${methodName}-error-title`,
      content: 'page.workspace.administration.entity-info.entity-create-error-validation'
    })) {

      if (this.entityForm.valid) {
        method(this.toModel()).subscribe({
          next: (entity: Entity) => {
            this.editing = false;
            this.selectedEntity = entity;
            this.entityEditComplete.emit(entity);
            this.dialogService.showSuccess(
              `page.workspace.administration.entity-info.${methodName}-success-title`,
              `page.workspace.administration.entity-info.${methodName}-success-content`,
              {entityName: this.selectedEntity.name});
          },
          error: (error) => {
            this.dialogService.showError(
              `page.workspace.administration.entity-info.${methodName}-error-title`,
              error.error?.message ?? error.message ?? 'global.actions.unknown-error',
              {},
              true);
          }
        });
      }
    }
  }

  private toModel(): Entity {
    return {
      name: this.entityForm.value.name,
      id: this.selectedEntity?.id
    } as Entity
  }

  cancelEdit() {
    this.editing = false;
    this.entityEditComplete.emit(this.selectedEntity?.id ? this.selectedEntity : null);
  }

  onToggleEdit() {
    this.editing = !this.editing;
  }

  get canBeEdited() {
    if (!this.config?.userAppPermissions.includes('CAN_MANAGE_ALL_ENTITIES')) {
      return !this.isTheDefaultEntityOrganization;
    }
    return true;
  };

  private get isTheDefaultEntityOrganization() {
    return this.selectedEntity?.name === this.config?.user.defaultEntity.organizationName;
  }
}
