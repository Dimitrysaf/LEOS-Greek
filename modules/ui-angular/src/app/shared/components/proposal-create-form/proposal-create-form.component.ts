import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-proposal-create-form',
  templateUrl: './proposal-create-form.component.html',
  styleUrls: ['./proposal-create-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalCreateFormComponent implements OnInit {
  @Input() createForm: FormGroup;

  constructor() {}

  ngOnInit() {}
}
