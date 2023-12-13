import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  SecurityContext,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { AppConfigService } from '@/core/services/app-config.service';
import { Permission } from '@/shared';
import { noWhitespaceValidator } from '@/shared/utils/validators';

import { ProposalDetailsService } from '../../services/proposal-details.service';

@Component({
  selector: 'app-proposal-header',
  templateUrl: './proposal-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalHeaderComponent implements OnInit, OnDestroy {
  @Input() nonEditablePartOfTitle: string;
  @Input() editableTitle: string;
  @Input() isClonedProposal: boolean;
  @Input() originRef: string | null;
  @Input() proposalState: string;

  title: string;
  createForm: FormGroup;
  permissions: Permission[];
  collectionCloseButtonEnabled: boolean;

  private destroy$: Subject<void> = new Subject();

  constructor(
    private fb: FormBuilder,
    private proposalDetailsService: ProposalDetailsService,
    private router: Router,
    private appConfig: AppConfigService,
    private domSanitizer: DomSanitizer,
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.setPageTitle();
    this.createForm = this.fb.group({
      docPurpose: new FormControl(this.title, {
        validators: [Validators.required, noWhitespaceValidator],
      }),
    });
    this.proposalDetailsService.permissions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((perms) => (this.permissions = perms));
    this.appConfig.config.pipe(takeUntil(this.destroy$)).subscribe((config) => {
      this.collectionCloseButtonEnabled = config.collectionCloseButtonEnabled;
    });
  }

  private setPageTitle() {
    this.title = [this.nonEditablePartOfTitle, this.editableTitle]
      .filter(Boolean)
      .join(' ');

    this.title =
      this.domSanitizer.sanitize(SecurityContext.HTML, this.title) || '';

    console.log(this.title);
  }

  handleClose() {
    this.router.navigate([`/workspace`]);
  }
}
