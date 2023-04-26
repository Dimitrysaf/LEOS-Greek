import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { TableOfContentItemVO } from '@/shared/models/toc.model';

@Component({
  selector: 'app-node-toc-actions',
  templateUrl: './node-toc-actions.component.html',
  styleUrls: ['./node-toc-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeTocActionsComponent implements OnInit {
  @Input() isEditMode: boolean;
  @Input() isNodeSelectedToMove: boolean;
  @Input() node: TableOfContentItemVO;

  @Output() handleMove = new EventEmitter<any>();
  @Output() handlePlaceAt = new EventEmitter<any>();
  @Output() handleCancelMove = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  onMove() {
    this.handleMove.emit();
  }

  onPlaceAt(location: string) {
    this.handlePlaceAt.emit(location);
  }

  onCancelMove() {
    this.handleCancelMove.emit();
  }
}
