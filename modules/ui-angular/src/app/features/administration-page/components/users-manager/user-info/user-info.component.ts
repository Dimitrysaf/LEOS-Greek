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
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule, ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {Observable, Subject} from 'rxjs';
import {CommonModule} from '@angular/common';
import {EuiCardModule} from '@eui/components/eui-card';
import {EuiButtonModule} from '@eui/components/eui-button';
import {EuiEditorModule} from '@eui/components/externals/eui-editor';
import {EuiChipModule} from '@eui/components/eui-chip';
import {EuiIconModule} from '@eui/components/eui-icon';
import {EuiLabelModule} from '@eui/components/eui-label';
import {APPLICATION_ROLES, User, UserEntity, UserUpdate} from "@/shared";
import {EuiAllModule} from "@eui/components";
import {TranslateModule} from "@ngx-translate/core";
import {AdministrationService} from "@/shared/services/administration.service";
import {SharedModule} from "@/shared/shared.module";
import {LeosDialogService} from "@/shared/services/leos-dialog.service";
import {validate} from "@/shared/utils/form.utils";
import {EuiSelectComponent} from "@eui/components/eui-select";

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
    ['firstName', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[\p{L}\s'-]+$/u)]],
    ['lastName', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[\p{L}\s'-]+$/u)]],
    ['email', [Validators.required, Validators.email]],
    ['login', [Validators.required, Validators.maxLength(50), Validators.pattern(/^\w+$/)]],
  ]);

  protected readonly APPLICATION_ROLES = APPLICATION_ROLES.filter(role => role !== 'USER');

  @ViewChild('userEntitiesSelect') userEntitiesSelect: EuiSelectComponent;
  @ViewChild('availableEntitiesSelect') availableEntitiesSelect: EuiSelectComponent;

  private _selectedUser: User;
  rolesGroup: any;
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
  }
  public form: FormGroup;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private allEntities: UserEntity[] = [];
  private searchTerm = '';
  availableEntities = new Map<string, UserEntity>();
  selectedEntities = new Map<string, UserEntity>();

  updateAddedEntities = new Set<string>();
  updateRemovedEntities = new Set<string>();

  get availableEntitiesArray() {
    return Array.from(this.availableEntities.values());
  }

  get selectedEntitiesArray() {
    return Array.from(this.selectedEntities.values());
  }

  constructor(protected adminService: AdministrationService,
              private fb: FormBuilder,
              private dialogService: LeosDialogService) {}

  ngOnInit(): void {
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
      this.rolesGroup.addControl(role, new FormControl({
        value: this.selectedUser?.roles?.includes(role) || false,
        disabled: false
      }));
    }
    this.form = this.fb.group({
      // Will add validators dynamically, so no validators at init time
      firstName: ['', []],
      lastName: ['', []],
      email: ['', []],
      login: ['', []],
      rolesGroup: this.rolesGroup,
      entities: [[], []]
    });
    this.selectedEntities.clear();
    this.selectedUser?.entities?.forEach(e => this.selectedEntities.set(e.id, e));
    this.form?.patchValue(this.selectedUser?.login ? this.selectedUser : {
      firstName: '',
      lastName: '',
      email: '',
      login: '',
      roles: [],
      entities: []
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
    if (this.selectedUser && !this.selectedUser.login) {
      // Entities are mandatory on user CREATION only.
      this.form.controls['entities'].setValidators(entitiesValidator());
    }
  }

  protected onSave() {
    const model = !!this.selectedUser.login ? this.toUpdateModel() : this.toModel();
    const method: ((user: User | UserUpdate) => Observable<User>) = !!this.selectedUser.login
      ? this.adminService.updateUser.bind(this.adminService)
      : this.adminService.createUser.bind(this.adminService);
    const methodName = method.name.substring(6); // 'bound ' prepended to the method name after binding
    if (validate(this.form, {
      service: this.dialogService,
      title: `page.workspace.administration.user-info.${methodName}-error-title`,
      content: 'page.workspace.administration.user-info.form-validation-error'
    })) {
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
          this.dialogService.showDialog({
            title: `page.workspace.administration.user-info.${methodName}-error-title`,
            message: error.error?.message ?? error.message ?? 'global.actions.unknown-error',
            clearGrowl: true
          });
        }
      });
    }
  }

  protected onCancel() {
    this.isEditActive = false;
    this.userEditComplete.next(this.selectedUser);
  }

  protected addEntityToUser() {
    const len = this.availableEntitiesSelect["elementRef"].nativeElement.selectedOptions.length;
    for (let i = 0; i < len; i++) {
      const selectedId = this.getEUiSelectOptionValue(this.availableEntitiesSelect, i);
      this.selectedEntities.set(selectedId, this.availableEntities.get(selectedId));
      this.availableEntities.delete(selectedId);

      this.updateAddedEntities.add(selectedId);
      this.updateRemovedEntities.delete(selectedId);
    }
    this.form.controls['entities'].setValue((this.selectedEntities.values() as any).toArray());
  }

  protected removeEntityFromUser() {
    const len = this.userEntitiesSelect["elementRef"].nativeElement.selectedOptions.length;
    for (let i = 0; i < len; i++) {
      const selectedId = this.getEUiSelectOptionValue(this.userEntitiesSelect, i);
      this.availableEntities.set(selectedId, this.selectedEntities.get(selectedId));
      this.selectedEntities.delete(selectedId);

      this.updateRemovedEntities.add(selectedId);
      this.updateAddedEntities.delete(selectedId);
    }
    this.form.controls['entities'].setValue((this.selectedEntities.values() as any).toArray());
  }

  protected searchEntities(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.populateAvailableEntities();
  }

  private toModel(): User {
    const roles = Object.keys(this.rolesGroup.controls)
      .filter(role => this.rolesGroup.get(role)?.value)
      .map(role => role);

    return {
      ...this.form.value,
      firstName: this.form.get("firstName")?.dirty ? this.form.value.firstName : null,
      lastName: this.form.get("lastName")?.dirty ? this.form.value.lastName : null,
      email: this.form.get("email")?.dirty ? this.form.value.email : null,
      roles: roles,
      rolesGroup: undefined
    } as User;
  }

  private toUpdateModel(): UserUpdate {
    const user = this.toModel() as any as UserUpdate;
    user.addedEntities = [...this.updateAddedEntities];
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
  }

  private populateAvailableEntities() {
    this.availableEntities.clear();
    this.allEntities
      .filter(e => !this.selectedEntities.has(e.id))
      .filter(e => !this.searchTerm || e.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
      .forEach(e => this.availableEntities.set(e.id, e));
  }

  get canBeEdited() {
    return !this.selectedUser.login || this.selectedUser.special;
  }

  // Handle a quirk in eUiSelectComponent
  private getEUiSelectOptionValue(euiSelect: EuiSelectComponent, index: number) {
    const value = euiSelect["elementRef"].nativeElement.selectedOptions.item(index).value;
    return value.indexOf(': \'') >= 0 ? value.substring(value.indexOf(': \'') + 3, value.length - 1) : value;
  }
}

export function entitiesValidator(): ValidatorFn | null {
  return (control:AbstractControl) : ValidationErrors | null => {
    const value = control.value as [];
    return !value || value.length === 0 ? {empty: true}: null;
  }
}
