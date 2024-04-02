import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SecurityContext,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject, catchError, of, takeUntil } from 'rxjs';

import { AppConfigService } from '@/core/services/app-config.service';
import { Permission } from '@/shared';
import { noWhitespaceValidator } from '@/shared/utils/validators';

import { ProposalDetailsService } from '../../services/proposal-details.service';
import { LandingPageService } from '@/features/landing-page/services/landing-page.service';

@Component({
  selector: 'app-proposal-header',
  templateUrl: './proposal-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalHeaderComponent implements OnInit, OnDestroy, OnChanges {
  @Input() nonEditablePartOfTitle: string;
  @Input() editableTitle: string;
  @Input() isClonedProposal: boolean;
  @Input() originRef: string | null;
  @Input() proposalState: string;

  title: string;
  createForm: FormGroup;
  permissions: Permission[];
  collectionCloseButtonEnabled: boolean;
  isFavourite: boolean;
  private destroy$: Subject<void> = new Subject();

  constructor(
    private fb: FormBuilder,
    private proposalDetailsService: ProposalDetailsService,
    private router: Router,
    private appConfig: AppConfigService,
    private domSanitizer: DomSanitizer,
    private landingPageService: LandingPageService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('editableTitle' in changes) {
      const updatedTitle = changes['editableTitle'].currentValue;
      this.setPageTitle(updatedTitle);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.setPageTitle(this.editableTitle);
    if (this.proposalDetailsService.proposalRef) {
      this.landingPageService
        .checkAndUpdateFavouriteStatus(this.proposalDetailsService.proposalRef)
        .pipe(takeUntil(this.destroy$))
        .subscribe();
    }

    this.landingPageService.isFavourite$
      .pipe(takeUntil(this.destroy$))
      .subscribe((status) => {
        this.isFavourite = status;
        this.cdr.markForCheck();
      });

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

  handleClose() {
    this.router.navigate([`/workspace`]);
  }

  private setPageTitle(newTitle: any) {
    this.title = [this.nonEditablePartOfTitle, newTitle]
      .filter(Boolean)
      .join(' ');

    this.title = this.title.replace(/<del[^>]*?>[\s\S]*?<\/del>/gi, '');
    this.title = this.title.replace(/<\/?ins[^>]*?>/gi, '');
    this.title =
      this.domSanitizer.sanitize(SecurityContext.HTML, this.title) || '';
  }

  toggleFavourite(): void {
    if (this.proposalDetailsService.proposalRef) {
      this.landingPageService
        .toggleFavouritePackage(this.proposalDetailsService.proposalRef)
        .subscribe({
          next: (isFavourite) => {
            this.isFavourite = isFavourite;
            this.cdr.markForCheck();
          },
        });
    }
  }
}
