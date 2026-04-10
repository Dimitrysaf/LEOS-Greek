import {Component, Input, OnInit} from '@angular/core';
import {CreateProposalService} from "@/shared/services/create-proposal.service";
import {ApplicationRole} from "@/shared";
import {EnvironmentService} from "@/shared/services/enviroment.service";
import {AppConfigService} from "@/core/services/app-config.service";

@Component({
  selector: '.hero-image',
  templateUrl: './hero-buttons.component.html',
  styleUrls: ['./hero-buttons.component.scss']
})
export class HeroButtonsComponent implements OnInit{
  canUpload: boolean = false;
  userRoles: ApplicationRole[];
  isCouncil: boolean = false;

  constructor(private createProposalService: CreateProposalService,
              public environmentService: EnvironmentService,
              private appConfig: AppConfigService) {
  }

  ngOnInit(): void {
    this.isCouncil = this.environmentService.isCouncil();
    this.appConfig.config.subscribe((config) => {
      this.canUpload = config.userAppPermissions.includes('CAN_UPLOAD');
      this.userRoles =  config.user.roles;
    });
    }

  handleCreate() {
    this.createProposalService.openProposalCreateDialog(this.userRoles);
  }

  handleUpload() {
    this.createProposalService.openProposalUploadDialog();
  }

  handleCreateMandate() {
    this.createProposalService.openProposalUploadDialog();
  }

  handleCreateDraft() {
    this.createProposalService.openProposalCreateDraftDialog(false);
  }
}
