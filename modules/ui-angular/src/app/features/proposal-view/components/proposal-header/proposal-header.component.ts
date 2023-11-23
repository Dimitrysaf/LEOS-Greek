import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { Permission } from '@/shared';
import { noWhitespaceValidator } from '@/shared/utils/validators';

import { ProposalDetailsService } from '../../services/proposal-details.service';
import {Router} from "@angular/router";
import {AppConfigService} from "@/core/services/app-config.service";

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

  title: string;
  createForm: FormGroup;
  permissions: Permission[];
  collectionCloseButtonEnabled: boolean;

  private destroy$: Subject<void> = new Subject();

  constructor(
    private fb: FormBuilder,
    private proposalDetailsService: ProposalDetailsService,
    private router: Router,
    private appConfig: AppConfigService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.title = this.editableTitle;
    this.createForm = this.fb.group({
      docPurpose: new FormControl(this.title, {
        validators: [Validators.required, noWhitespaceValidator],
      }),
    });
    this.proposalDetailsService.permissions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((perms) => (this.permissions = perms));
    this.appConfig.config.pipe(
      takeUntil(this.destroy$)
    ).subscribe((config) => {
      this.collectionCloseButtonEnabled = config.collectionCloseButtonEnabled;
    })
  }

  handleClose() {
    this.router.navigate([`/workspace`]);
  }
}
