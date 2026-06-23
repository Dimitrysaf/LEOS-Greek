import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {CommonModule} from '@angular/common';
import {EuiCardModule} from '@eui/components/eui-card';
import {EuiButtonModule} from '@eui/components/eui-button';
import {EuiEditorModule} from '@eui/components/externals/eui-editor';
import {EuiChipModule} from '@eui/components/eui-chip';
import {EuiIconModule} from '@eui/components/eui-icon';
import {EuiLabelModule} from '@eui/components/eui-label';
import {APPLICATION_ROLES, Entity, Permission, User, UserEntity, UserUpdate} from "@/shared";
import {EuiAllModule} from "@eui/components";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AdministrationService} from "@/shared/services/administration.service";
import {SharedModule} from "@/shared/shared.module";
import {LeosDialogService} from "@/shared/services/leos-dialog.service";
import {EuiSelectComponent} from "@eui/components/eui-select";
import {EuiTableComponent} from "@eui/components/eui-table";
import {AppConfigService} from "@/core/services/app-config.service";

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [
    EuiAllModule,
    CommonModule,
    ReactiveFormsModule,
    EuiCardModule,
    EuiButtonModule,
    EuiEditorModule,
    EuiChipModule,
    EuiIconModule,
    EuiLabelModule,
    TranslateModule,
    SharedModule
  ],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss',
})
export class UserInfoComponent implements OnInit, OnDestroy {

  private static readonly VALIDATORS_MAP = new Map<string, any[]>([
    ['firstName', [Validators.required, Validators.maxLength(50), Validators.pattern(/^(?=.*\p{L})[\p{L}\s'-]+$/u)]],
    ['lastName', [Validators.required, Validators.maxLength(50), Validators.pattern(/^(?=.*\p{L})[\p{L}\s'-]+$/u)]],
    ['email', [Validators.required, Validators.email]],
    ['login', [Validators.required, Validators.maxLength(50), Validators.pattern(/^\w+$/)]],
  ]);

  protected readonly APPLICATION_ROLES = APPLICATION_ROLES.filter(role => role !== 'USER');

  @ViewChild('selectedEntitiesTable') selectedEntitiesTable: EuiTableComponent;
  @ViewChild('availableEntitiesSelect') availableEntitiesSelect: EuiSelectComponent;

  private _selectedUser: User;
  private permissionsForUser: Permission[];
  get selectedUser(): User {
    return this._selectedUser;
  }
  @Input() set selectedUser(user: User) {
    this._selectedUser = user;
    this.isEditActive = !user || !user.login;
    this.buildForm();
  }

  @Output() public userEditComplete = new EventEmitter<User>();

  public _isEditActive = false;
  public get isEditActive(): boolean {
    return this._isEditActive;
  }
  public set isEditActive(value: boolean) {
    this._isEditActive = value;
    this.onIsActiveChanged(value);
  }
  form: FormGroup;
  rolesGroup: FormGroup;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private allEntities: Entity[] = [];
  private searchTerm = '';
  availableEntities = new Map<string, UserEntity>();
  selectedEntities = new Map<string, UserEntity>();

  updateAddedEntities = new Map<string, UserEntity>();
  updateRemovedEntities = new Set<string>();
  selectedUserEntityRows = new Set<string>();
  errorInEntities: boolean;

  private _showExtendedViewerColumn: boolean;


  get availableEntitiesArray() {
    return Array.from(this.availableEntities.values());
  }

  get selectedEntitiesArray() {
    return Array.from(this.selectedEntities.values());
  }

  get entityRolesGroup(): FormGroup {
    return this.form.get('entityRoles') as FormGroup;
  }

  constructor(protected adminService: AdministrationService,
              private fb: FormBuilder,
              private dialogService: LeosDialogService,
              private configService: AppConfigService,
              private translateService: TranslateService) {}

  ngOnInit(): void {
    this.configService.config.subscribe((config) => {
      this.permissionsForUser = config.userAppPermissions;
    });
    this.buildForm()
  }


  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public onToggleEdit(): void {
    this.isEditActive = true;
  }

  public buildForm() {
    this.loadEntities();
    this.rolesGroup = new FormGroup({});

    for (const role of APPLICATION_ROLES) {
      const userRole = this.selectedUser?.userRoles?.find(ur => ur.role == role);
      this.rolesGroup.addControl(role, new FormControl({
        value: this.selectedUser?.roles?.includes(role) || false,
        disabled: !!userRole && !userRole.special
      }));
    }
    this._showExtendedViewerColumn = this.selectedUser?.roles?.includes('EXTENDED_VIEWER');
    this.rolesGroup.get('EXTENDED_VIEWER')?.valueChanges.subscribe((selected) => this._showExtendedViewerColumn = selected);

    this.selectedEntities.clear();
    this.selectedUser?.entities?.forEach(e => this.selectedEntities.set(e.id, e));
    const entityRolesGroup = this.fb.group(
      Object.fromEntries(
        Array.from(this.selectedEntities.values()).map(e => [e.id, new FormControl(e.role === 'EXTENDED_VIEWER')])
      )
    );
    this.form = this.fb.group({
      // Will add validators dynamically, so no validators at init time
      firstName: ['', []],
      lastName: ['', []],
      email: ['', []],
      login: ['', []],
      rolesGroup: this.rolesGroup,
      entities: [[], []],
      entityRoles: entityRolesGroup
    });
    this.form.patchValue(this.selectedUser?.login ? this.selectedUser : {
      firstName: '',
      lastName: '',
      email: '',
      login: '',
      roles: [],
      entities: []
    });

    entityRolesGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((values: Record<string, boolean>) => {
        for (const [entityId, checked] of Object.entries(values)) {
          const originalRole = this.selectedUser?.entities?.find(e => e.id === entityId)?.role ?? null;
          const newRole = checked ? 'EXTENDED_VIEWER' : null;
          if (newRole !== originalRole) {
            this.updateAddedEntities.set(entityId, this.selectedEntities.get(entityId));
          } else if (this.selectedUser?.entities?.some(e => e.id === entityId)) {
            this.updateAddedEntities.delete(entityId);
          }
        }
      });

    UserInfoComponent.VALIDATORS_MAP.forEach((validators, fieldName) => {
      const control = this.form.get(fieldName)!;
      if (this.selectedUser?.login) { // User update
        // Add validators on valueChanges, allows skipping validation for the fields that are not modified
        control.valueChanges.subscribe(() => {
          if (!control.hasValidator(validators[0])) {
            control.setValidators(validators);
            control.updateValueAndValidity({emitEvent: false});
          }
        });
      } else { // User creation
        // Add validators directly as the fields will always be validated
        control.setValidators(validators);
      }
    });
  }

  protected onSave() {
    const model = this.userIsEnrolled ? this.toUpdateModel() : this.toModel(this.selectedUser.special);
    const method: ((user: User | UserUpdate) => Observable<User>) = this.userIsEnrolled
      ? this.adminService.updateUser.bind(this.adminService)
      : this.adminService.createUser.bind(this.adminService);
    const methodName = this.selectedUser.login ? 'updateUser' : 'createUser';
      method(model).subscribe({
        next: (updated) => {
          this.selectedUser = updated;
          this.onToggleEdit();
          this.userEditComplete.next(updated);
          this.dialogService.showDialog({
            title: `page.workspace.administration.user-info.${methodName}-success-title`,
            message: `page.workspace.administration.user-info.${methodName}-success-content`,
            i18nParams: {firstName: this.selectedUser.firstName, lastName: this.selectedUser.lastName}});
        },
        error: (error) => {
          const errorMap = error.error?.errors;
          let combinedMessage = this.translateService.instant('page.workspace.administration.user-info.form-validation-error');
          if (!!errorMap && Object.keys(errorMap).length > 0) {
            combinedMessage += '<ul>'
            Object.entries(errorMap).forEach((e) => {
              const control = this.form.get(e[0]);
              if (!!control) {
                control.markAsTouched();
                if (!control.errors) {
                  control.setErrors({});
                }
              }
              combinedMessage += '<li>' + (e[1] as string).split(';').map(s => s.trim()).map(s => this.translateService.instant(s)).reduce((prev, curr) => prev + '<br>' + curr) + '</li>';
              this.errorInEntities = Object.keys(errorMap).includes('entities');
            });
            combinedMessage += '</ul>'
          }
          this.dialogService.showDialog({
            title: `page.workspace.administration.user-info.${methodName}-error-title`,
            message: combinedMessage ?? error.error?.message ?? error.message ?? 'global.actions.unknown-error',
            clearGrowl: true
          });
        }
      });
  }

  private get userIsEnrolled() {
    return this.selectedUser.login && this.selectedUser.special;
  }

  protected onCancel() {
    this.isEditActive = false;
    this.buildForm();
    this.userEditComplete.next(this.selectedUser);
  }

  protected addEntityToUser() {
    const len = this.availableEntitiesSelect["elementRef"].nativeElement.selectedOptions.length;
    for (let i = 0; i < len; i++) {
      const selectedId = this.getEUiSelectOptionValue(this.availableEntitiesSelect, i);
      this.selectedEntities.set(selectedId, this.availableEntities.get(selectedId));
      this.availableEntities.delete(selectedId);
      this.entityRolesGroup.addControl(selectedId, new FormControl(false));

      this.updateAddedEntities.set(selectedId, this.selectedEntities.get(selectedId));
      this.updateRemovedEntities.delete(selectedId);
    }
    this.form.controls['entities'].setValue((this.selectedEntities.values() as any).toArray());
    this.errorInEntities = false;
  }

  protected removeEntityFromUser() {
    for (let selectedId of this.selectedUserEntityRows.values()) {
      this.availableEntities.set(selectedId, this.selectedEntities.get(selectedId));
      this.selectedEntities.delete(selectedId);
      this.entityRolesGroup.removeControl(selectedId);

      this.updateRemovedEntities.add(selectedId);
      this.updateAddedEntities.delete(selectedId);
    }
    this.selectedUserEntityRows.clear();
    this.form.controls['entities'].setValue((this.selectedEntities.values() as any).toArray());
  }

  protected searchEntities(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.populateAvailableEntities();
  }

  private entitiesWithRoles(): UserEntity[] {
    return Array.from(this.updateAddedEntities.values()).map(e => ({
      ...e,
      role: this.entityRolesGroup.get(e.id)?.value ? 'EXTENDED_VIEWER' : null
    }));
  }

  private toModel(ignoreCleanFields: boolean): User {
    const roles = Object.keys(this.rolesGroup.controls)
      .filter(role => this.APPLICATION_ROLES.includes(role as any) && this.rolesGroup.get(role)?.value)
      .map(role => role);

    return {
      ...this.form.value,
      firstName: !ignoreCleanFields || this.form.get("firstName")?.dirty ? this.form.value.firstName : null,
      lastName: !ignoreCleanFields || this.form.get("lastName")?.dirty ? this.form.value.lastName : null,
      email: !ignoreCleanFields || this.form.get("email")?.dirty ? this.form.value.email : null,
      roles: roles,
      entities: this.entitiesWithRoles(),
      rolesGroup: undefined,
      entityRoles: undefined
    } as User;
  }

  private toUpdateModel(): UserUpdate {
    const user = this.toModel(true) as any as UserUpdate;
    user.addedEntities = this.entitiesWithRoles();
    user.removedEntities = [...this.updateRemovedEntities];
    user['entities'] = undefined;
    return user;
  }

  private loadEntities() {
    this.searchTerm = '';
    this.updateAddedEntities.clear();
    this.updateRemovedEntities.clear();
    this.adminService.getUserEntities().subscribe( entities => {
      this.allEntities = entities;
      this.populateAvailableEntities();
    });
    this.errorInEntities = false;
  }

  private populateAvailableEntities() {
    this.availableEntities.clear();
    this.allEntities
      .filter(e => !this.selectedEntities.has(e.id))
      .filter(e => !this.searchTerm || e.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
      .forEach(e => this.availableEntities.set(e.id, e as any));
  }

  // Handle a quirk in eUiSelectComponent
  private getEUiSelectOptionValue(euiSelect: EuiSelectComponent, index: number) {
    const value = euiSelect["elementRef"].nativeElement.selectedOptions.item(index).value;
    return value.indexOf(': \'') >= 0 ? value.substring(value.indexOf(': \'') + 3, value.length - 1) : value;
  }

  protected onClose() {
    this.isEditActive = false;
    this.userEditComplete.next(null);
  }

  toggleUserEntitySelect(row: UserEntity) {
    if (this.selectedUserEntityRows.has(row.id)) {
      this.selectedUserEntityRows.delete(row.id);
    } else if (!!this.isEditActive) {
      this.selectedUserEntityRows.add(row.id);
    }
  }

  showExtendedViewer(): boolean {
    return this._showExtendedViewerColumn && this.permissionsForUser.includes('CAN_MANAGE_USERS_ROLES');
  }

  private onIsActiveChanged(value: boolean) {
    this.selectedUserEntityRows.clear();
  }
}
