import {Component, Inject} from '@angular/core';
import {DIALOG_COMPONENT_CONFIG} from "@eui/components/eui-dialog";
import {ProposalDetailsService} from "@/features/proposal-view/services/proposal-details.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {noWhitespaceValidator} from "@/shared/utils/validators";
import {Document} from "@/shared";
@Component({
  selector: 'app-proposal-annex-upload',
  templateUrl: './proposal-annex-upload.component.html',
  styleUrl: './proposal-annex-upload.component.scss'
})
export class ProposalAnnexUploadComponent {

  renameFileForm: FormGroup;
  fileName: string;
  fileExtension: string;
  childDocuments: Document[];

  constructor(
    @Inject(DIALOG_COMPONENT_CONFIG) private config,
    private proposalDetailsService: ProposalDetailsService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.fileName = this.config.file.name.substring(0, this.config.file.name.lastIndexOf('.'));
    this.fileExtension = this.config.file.name.substring(this.config.file.name.lastIndexOf('.'));
    this.childDocuments = this.config.childDocuments;
    this.renameFileForm = this.fb.group({
      renameFile: new FormControl(this.fileName, {
        validators: [Validators.required, noWhitespaceValidator],
      })
    });
  }

  closeDialog() {
    this.config.closeDialog();
  }

  updateForeignAnnex() {
    this.proposalDetailsService.createForeignAnnex(this.config.file, this.renameFileForm.get('renameFile').value + this.fileExtension);
    this.config.closeDialog();
  }

  isFormValid() {
    let annexWithSameName = this.childDocuments?.find(e => e.category === 'BILL')?.childDocuments?.find(e => e.category === 'ANNEX' && e.originalFilename.toUpperCase() === (this.renameFileForm.get('renameFile').value + this.fileExtension).toUpperCase());
    return this.renameFileForm.valid && !annexWithSameName;
  }

}
