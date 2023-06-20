import { Component, OnInit } from '@angular/core';
import * as cluster from "cluster";

@Component({
  selector: 'app-revision-pane-group',
  templateUrl: './revision-pane-group.component.html',
  styleUrls: ['./revision-pane-group.component.scss']
})
export class RevisionPaneGroupComponent implements OnInit {

  revisionVersion:string;
  originatingApplication:string;
  revisionTitle : string;
  updatedAtBy: string;
  status:string;

  constructor() { }

  ngOnInit(): void {
  }

}
