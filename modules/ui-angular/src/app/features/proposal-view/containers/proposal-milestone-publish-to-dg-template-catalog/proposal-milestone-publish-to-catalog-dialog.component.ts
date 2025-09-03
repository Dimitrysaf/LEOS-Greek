import {
  ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EuiAutoCompleteItem } from '@eui/components/eui-autocomplete';
import { Subject, takeUntil } from 'rxjs';

import { MilestoneDescriptor } from '@/shared/components/proposal-milestone-view/proposal-milestone-view.component';
import { ProposalDetailsService } from '../../services/proposal-details.service';
import { EuiDialogComponent } from '@eui/components/eui-dialog';

type DGOption = { code: string; label: string };

@Component({
  selector: 'app-proposal-milestone-publish-to-catalog-dialog',
  templateUrl: './proposal-milestone-publish-to-catalog-dialog.component.html',
  styleUrls: ['./proposal-milestone-publish-to-catalog-dialog.component.scss'],
})
export class ProposalMilestonePublishToCatalogDialogComponent implements OnInit, OnDestroy {
  @Input() milestone: MilestoneDescriptor;
  @Output() closed = new EventEmitter<void>();

  @ViewChild('dgAuto')
  dgAuto: any;
  @ViewChild('sendMilestonePublishToDgTemplateCatalog')
  sendMilestonePublishToDgTemplateCatalog: EuiDialogComponent;

  targetUserForm: FormGroup;
  submitted = false;

  /** Organizations loaded from API */
  private ALL_DGS: DGOption[] = [];

  /** Map label -> option for quick resolution */
  private dgByLabel = new Map<string, DGOption>();

  /** EUI items for the autocomplete (display only) */
  allDgItems: EuiAutoCompleteItem[] = [];

  filteredDgItems: EuiAutoCompleteItem[] = [...this.allDgItems];

  /** Current selections used for chips */
  selectedDgs: DGOption[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private detailsService: ProposalDetailsService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    this.targetUserForm = this.fb.group({
      templateName: this.fb.control('', Validators.required),
      dgSearch: [''],
      dgCodes: this.fb.control<string[]>([], Validators.required)
    });

    // Load organizations from API
    this.detailsService.getAllOrganizations()
      .pipe(takeUntil(this.destroy$))
      .subscribe(organizations => {
        this.ALL_DGS = organizations.map(org => ({ code: org, label: org }));
        this.dgByLabel = new Map<string, DGOption>(this.ALL_DGS.map(o => [o.label, o]));
        this.allDgItems = this.ALL_DGS.map(o => new EuiAutoCompleteItem({ label: o.label, tooltip: { tooltipMessage: o.label } }));
        this.filteredDgItems = [...this.allDgItems];
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

  close() {
    this.sendMilestonePublishToDgTemplateCatalog.closeDialog();
    this.resetModal();
    this.closed.emit();
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

  /** Valid when at least one DG is selected */
  get isFormValid(): boolean {
    return (this.dgCtrl.value ?? []).length > 0;
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

  publishTemplate(): void {
    this.submitted = true;
    if (this.targetUserForm.invalid) {
      this.templateNameCtrl.markAsTouched();
      this.dgCtrl.markAsTouched();
      return;
    }

    const templateName = this.templateNameCtrl.value as string;
    const dgCodes = this.dgCtrl.value as string[];

    this.detailsService.publishTemplateToDgCatalog(this.milestone, templateName, dgCodes);

    this.close();
  }
}
