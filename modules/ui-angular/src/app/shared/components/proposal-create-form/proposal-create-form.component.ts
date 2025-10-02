import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges,} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {AppConfigService} from "@/core/services/app-config.service";

@Component({
  selector: 'app-proposal-create-form',
  templateUrl: './proposal-create-form.component.html',
  styleUrls: ['./proposal-create-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalCreateFormComponent implements OnInit, OnChanges {
  @Input() createForm: FormGroup;
  @Input() isCustomTemplate!: boolean;
  @Input() translationKey: 'document' | 'draft' = 'document';
  canCreateTemplate = false;

  constructor(private appConfig: AppConfigService) {}


  ngOnInit() {
    this.appConfig.config.subscribe((config) => {
      this.canCreateTemplate = config.userAppPermissions.includes('CAN_CREATE_TEMPLATE');
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isCustomTemplate?.currentValue) {
      this.createForm.patchValue({
        customTemplateAct: false
      });
    }
  }
}
