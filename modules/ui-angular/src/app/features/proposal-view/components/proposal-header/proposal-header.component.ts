import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-proposal-header',
  templateUrl: './proposal-header.component.html',
  styleUrls: ['./proposal-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalHeaderComponent implements OnInit {
  @Input() nonEditablePartOfTitle: string;
  @Input() editableTitle: string;

  constructor() {}

  ngOnInit(): void {}

  handleEdit() {}
}
