import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import {
  DEFAULT_SORT_ORDER,
} from '@/features/proposals/models';
import {SharedModule} from "@/shared/shared.module";


@Component({
  selector: 'app-searchbox',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.scss'],
})
export class SearchBoxComponent implements OnInit {
  sortOrder = DEFAULT_SORT_ORDER;
  @Input() label: string;
  @Input() placeholder = 'app.search.button';
  @Output() searchInitiation: EventEmitter<string | null> = new EventEmitter();
  @Output() searchTermChange: EventEmitter<string> = new EventEmitter();
  searchTerm = '';

  ngOnInit(): void {}

  buttonWatchForChanges() {
    this.searchInitiation.emit(this.searchTerm || null);
  }

  protected clear() {
    if (!!this.searchTerm) {
      this.searchTerm = '';
      this.searchInitiation.emit('');
    }
  }
}
