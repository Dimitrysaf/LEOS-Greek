import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-proposal-last-updated-on',
  templateUrl: './proposal-last-updated-on.component.html',
  styleUrls: ['./proposal-last-updated-on.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalLastUpdatedOnComponent {
  @Input() date: number;
  @Input() name: string;
}
