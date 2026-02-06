import {
  ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EuiAutoCompleteItem } from '@eui/components/eui-autocomplete';
import { Subject, takeUntil } from 'rxjs';

import { MilestoneDescriptor } from '@/shared/components/proposal-milestone-view/proposal-milestone-view.component';
import { ProposalDetailsService } from '../../services/proposal-details.service';
import { EuiDialogComponent } from '@eui/components/eui-dialog';
import {AppConfigService} from "@/core/services/app-config.service";
import {Document} from "@/shared";

type DGOption = { code: string; label: string };

@Component({
  selector: 'app-proposal-milestone-publish-to-catalog-dialog',
  templateUrl: './proposal-milestone-publish-to-catalog-dialog.component.html',
  styleUrls: ['./proposal-milestone-publish-to-catalog-dialog.component.scss'],
})
export class ProposalMilestonePublishToCatalogDialogComponent implements OnInit, OnDestroy {
  @Input() milestone: MilestoneDescriptor;
  @Input() document: Document;
  @Output() closed = new EventEmitter<void>();

  @ViewChild('dgAuto')
  dgAuto: any;
  @ViewChild('sendMilestonePublishToDgTemplateCatalog')
  sendMilestonePublishToDgTemplateCatalog: EuiDialogComponent;

  targetUserForm: FormGroup;
  submitted = false;
  defaultEntity: string;
  isLoadingTemplateInfo = false;
  adminView = false

  /** Organizations loaded from API */
  private ALL_DGS: DGOption[] = [];

  /** Map label -> option for quick resolution */
  private dgByLabel = new Map<string, DGOption>();

  /** EUI items for the autocomplete (display only) */
  allDgItems: EuiAutoCompleteItem[] = [];

  filteredDgItems: EuiAutoCompleteItem[] = [...this.allDgItems];

  /** Current selections used for chips */
  selectedDgs: DGOption[] = [];

  /** Show/hide suggestions dropdown */
  showSuggestions = false;

  /** Dropdown positioning */
  dropdownTop = 0;
  dropdownLeft = 0;
  dropdownWidth = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private detailsService: ProposalDetailsService,
    private appConfig: AppConfigService
  ) {}

  ngOnInit(): void {
    this.adminView = false;
    this.appConfig.config.subscribe((config) => {
      this.defaultEntity = config.user.defaultEntity.organizationName;
    });

    this.targetUserForm = this.fb.group({
      templateName: this.fb.control({value: '', disabled: this.isLoadingTemplateInfo}, Validators.required),
      dgSearch: [{value: '', disabled: this.isLoadingTemplateInfo}],
      dgCodes: this.fb.control<string[]>([])
    });

    if (this.document?.ref) {
      this.loadTemplateInfo(this.document?.ref);
    }

    // Load organizations from API
    this.detailsService.getAllOrganizations()
      .pipe(takeUntil(this.destroy$))
      .subscribe(organizations => {
        this.ALL_DGS = organizations.map(org => ({ code: org, label: org }));
        this.dgByLabel = new Map<string, DGOption>(this.ALL_DGS.map(o => [o.label, o]));
        this.allDgItems = this.ALL_DGS.map(o => new EuiAutoCompleteItem({ label: o.label, tooltip: { tooltipMessage: o.label } }));
        this.filteredDgItems = [...this.allDgItems];

        // Set default DG selection (user's default entity)
        if (this.defaultEntity) {
          const defaultDg = this.ALL_DGS.find(dg => dg.code === this.defaultEntity);
          if (defaultDg) {
            this.addDg(defaultDg);
          }
        }
      });

    // React to autocomplete value changes (label or item), unify as label string
    this.targetUserForm.controls['dgSearch'].valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        const label =
          typeof val === 'string' ? val :
            (val && (val as any).label) ? (val as any).label : null;

        // If the control equals a known item label, treat it as a pick
        const picked = label ? this.dgByLabel.get(label) : null;
        if (picked) {
          this.addDg(picked);
          // Clear the search box without re-triggering logic
          this.targetUserForm.controls['dgSearch'].setValue('', { emitEvent: false });
          this.onDgSearch('');
        } else {
          // While typing, keep filtering
          this.onDgSearch(typeof val === 'string' ? val : '');
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  open() {
    this.sendMilestonePublishToDgTemplateCatalog.openDialog();
  }

  openNameAndDgTemplateCatalog(documentRef) {
    this.adminView = true;
    this.loadTemplateInfo(documentRef);
    this.sendMilestonePublishToDgTemplateCatalog.openDialog();
  }


  close() {
    this.sendMilestonePublishToDgTemplateCatalog.closeDialog();
    this.resetModal();
    this.closed.emit();
    this.adminView = false;
  }

  /** Reset dialog state */
  resetModal() {
    this.selectedDgs = [];
    this.filteredDgItems = [...this.allDgItems];
    this.submitted = false;

    if (this.targetUserForm) {
      this.targetUserForm.reset({ templateName: '', dgSearch: '', dgCodes: [] });
      this.templateNameCtrl.markAsPristine();
      this.templateNameCtrl.markAsUntouched();
      this.dgCtrl.markAsPristine();
      this.dgCtrl.markAsUntouched();
    }
  }

  /** Local search over labels; hide already-selected */
  onDgSearch(query: string): void {
    const q = (query || '').toLowerCase().trim();
    const selectedCodes = new Set(this.selectedDgs.map(d => d.code));

    this.filteredDgItems = this.allDgItems.filter(item => {
      const opt = this.dgByLabel.get(item.label);
      if (!opt) return false;
      if (selectedCodes.has(opt.code)) return false;
      return !q || item.label.toLowerCase().includes(q);
    });
  }

  /** Select DG from suggestions */
  selectDg(label: string): void {
    const opt = this.dgByLabel.get(label);
    if (opt) {
      this.addDg(opt);
      this.targetUserForm.controls['dgSearch'].setValue('', { emitEvent: false });
      this.onDgSearch('');
      this.showSuggestions = false;
    }
  }

  /** Input focus handler */
  onInputFocus(): void {
    this.showSuggestions = true;
    this.updateDropdownPosition();
  }

  /** Input blur handler */
  onInputBlur(): void {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200); // Delay to allow click on suggestions
  }

  /** Update dropdown position */
  private updateDropdownPosition(): void {
    setTimeout(() => {
      const container = document.querySelector('.dg-select-container') as HTMLElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        this.dropdownTop = rect.bottom;
        this.dropdownLeft = rect.left;
        this.dropdownWidth = rect.width;
      }
    }, 0);
  }

  /** Add DG to chips + form array */
  private addDg(opt: DGOption): void {
    if (this.selectedDgs.some(d => d.code === opt.code)) return;

    this.selectedDgs = [...this.selectedDgs, opt];

    const nextCodes = [...this.dgCtrl.value, opt.code];
    this.dgCtrl.setValue(nextCodes);
    this.dgCtrl.markAsDirty();
    this.dgCtrl.markAsTouched();
  }

  /** Remove a chip */
  removeDg(index: number): void {
    const removed = this.selectedDgs[index];

    if (removed.code === this.defaultEntity) {
      return;
    }

    this.selectedDgs = this.selectedDgs.filter((_, i) => i !== index);

    const nextCodes = (this.dgCtrl.value as string[]).filter(c => c !== removed.code);
    this.dgCtrl.setValue(nextCodes);

    // Optional UX: when empty, make it pristine/untouched again
    if (nextCodes.length === 0) {
      this.dgCtrl.markAsPristine();
      this.dgCtrl.markAsUntouched();
    }

    this.onDgSearch('');
  }

  /** Valid when template name is provided */
  get isFormValid(): boolean {
    return this.templateNameCtrl.valid;
  }

  /** Helper accessors */
  get dgCtrl() { return this.targetUserForm.get('dgCodes')!; }

  /** Error visibility (after submit or when user has interacted) */
  get showDgError(): boolean {
    const c = this.dgCtrl;
    return c.invalid && (this.submitted || c.dirty);
  }

  get templateNameCtrl() { return this.targetUserForm.get('templateName')!; }

  get showTemplateNameError(): boolean {
    const c = this.templateNameCtrl;
    return c.invalid && (this.submitted || c.dirty);
  }

  loadTemplateInfo(ref: string): void {
    this.isLoadingTemplateInfo = true;

    this.detailsService.getTemplateInfo(ref)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: templateInfo => {
          if (templateInfo.templateName) {
            this.templateNameCtrl.setValue(templateInfo.templateName);
          }
          if (templateInfo.templateVisibility) {
            templateInfo.templateVisibility.forEach(dgCode => {
              const dg = this.ALL_DGS.find(d => d.code === dgCode);
              if (dg) {
                this.addDg(dg);
              }
            });
          }
          this.isLoadingTemplateInfo = false;
          this.templateNameCtrl.enable();
          this.targetUserForm.get('dgSearch')?.enable();
        },
        error: () => {
          this.isLoadingTemplateInfo = false;
          this.templateNameCtrl.enable();
          this.targetUserForm.get('dgSearch')?.enable();
        }
      });
  }

  publishTemplate(): void {
    this.submitted = true;
    if (this.templateNameCtrl.invalid) {
      this.templateNameCtrl.markAsTouched();
      return;
    }

    const templateName = this.templateNameCtrl.value as string;
    const dgCodes = this.dgCtrl.value as string[];

    this.detailsService.publishTemplateToDgCatalog(this.milestone, templateName, dgCodes);

    this.close();
  }

  updateTemplate(): void {
    this.submitted = true;
    if (this.templateNameCtrl.invalid) {
      this.templateNameCtrl.markAsTouched();
      return;
    }

    const templateName = this.templateNameCtrl.value as string;
    const dgCodes = this.dgCtrl.value as string[];

    this.detailsService.updateTemplate(this.milestone, templateName, dgCodes)
      .subscribe({
        next: () => {
          // Notification is already handled by the service
          this.close(); // safe to reload templates after update
        },
        error: () => {
          // Error notification is handled by service
        }
      });
  }
}
