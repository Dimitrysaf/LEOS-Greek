import {Component, OnInit} from '@angular/core';
import {AdministrationService} from "@/shared/services/administration.service";
import {Entity, LeosAppConfig, LeosConfig} from "@/shared";
import {EuiPaginationEvent} from "@eui/components/eui-paginator";
import {EuiDialogService} from "@eui/components/eui-dialog";
import {LeosDialogService} from "@/shared/services/leos-dialog.service";
import {AppConfigService} from "@/core/services/app-config.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-entities-manager',
  templateUrl: './entities-manager.component.html',
  styleUrl: './entities-manager.component.scss',
  providers: [AdministrationService]
})
export class EntitiesManagerComponent implements OnInit {
  protected entities: Entity[] =  [];
  public paginatedEntities: any[] = [];
  public page = 0;
  public pageSize = 10;
  selectedEntity: Entity;
  protected loading = false;
  private config: LeosConfig & LeosAppConfig;
  private searchTerm: string | undefined;

  constructor(private adminService: AdministrationService,
              private euiDialogService: EuiDialogService,
              private leosDialogService: LeosDialogService,
              private appConfig: AppConfigService,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.appConfig.config.subscribe( config => {
      this.config = config;
    });
    this.loadEntities();
    this.updatePagination();
  }

  protected search($event: string) {
    this.searchTerm = $event?.toLowerCase().trim();
    this.selectedEntity = null;
    this.loadEntities(this.searchTerm);
  }


  onPageChange(event: EuiPaginationEvent) {
    this.page = event.page;
    this.pageSize = event.pageSize;
    this.updatePagination();
  }

  onEntitySelect(entity: any) {
    this.selectedEntity = entity;
  }

  private updatePagination() {
    const start = this.page * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedEntities = this.entities?.slice(start, end);
  }

  protected addEntity() {
    this.selectedEntity = {name: undefined, id: undefined, organizationName: undefined};
  }

  protected loadEntities(searchTerm: string = '') {
    this.loading = true;
    this.adminService.getUserEntities().subscribe(entities => {
      this.loading = false;
      this.entities = entities.filter(entity => entity.name?.toLowerCase().includes(searchTerm));
      this.updatePagination();
    });
  }

  protected onEntityEditComplete(entity: Entity) {
    if (!entity?.id) {
      this.selectedEntity = null;
    } else {
      this.selectedEntity = entity;
      this.loadEntities(this.searchTerm);
    }
  }

  protected onDelete(entity: Entity) {
    this.loading = true;
    this.adminService.getEntityUsers(entity.id, 0, 1, 'lastName', 'asc')
      .subscribe((response) => {
        this.loading = false;
        if (response.totalElements > 0) {
          this.leosDialogService.showDialog({
            title: "page.workspace.administration.entity-info.entity-has-users.title",
            message: "page.workspace.administration.entity-info.entity-has-users.content"
        });
          this.selectedEntity = entity;
        } else {
          this.delete(entity);
        }
      });
  }

  private delete(entity: Entity) {
    this.euiDialogService.openDialog({
      title: "page.workspace.administration.entity-info.entity-delete-dialog.title",
      content: this.translateService.instant("page.workspace.administration.entity-info.entity-delete-dialog.content", {entity: entity}),
      typeClass: "warning",
      isMessageBox: true,
      accept: () => this.adminService.deleteEntity(entity.id).subscribe({
        next: () => {
          this.selectedEntity = null;
          this.loadEntities(this.searchTerm);
        },
        error: (error) => {
          this.leosDialogService.showDialog({
            title: "page.workspace.administration.entity-info.entity-delete-error-title",
            message: error.error?.message ?? error.message ?? "global.actions.unknown-error",
            clearGrowl: true})
        }
      })
    })
  }

  canBeDeleted(entity: Entity) {
    if (!this.config?.userAppPermissions.includes('CAN_MANAGE_ALL_ENTITIES')) {
      return !this.isTheDefaultEntityOrganization(entity);
    }
    return true;
  };

  private isTheDefaultEntityOrganization(entity: Entity) {
    return entity.name === this.config?.user.defaultEntity.organizationName;
  }
}
