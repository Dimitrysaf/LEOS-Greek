/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

import { ProposalMilestonePublishToCatalogDialogComponent } from './proposal-milestone-publish-to-catalog-dialog.component';
import { ProposalDetailsService } from '../../services/proposal-details.service';

describe('ProposalMilestonePublishToCatalogDialogComponent', () => {
  let component: ProposalMilestonePublishToCatalogDialogComponent;
  let fixture: ComponentFixture<ProposalMilestonePublishToCatalogDialogComponent>;
  let mockDetailsService: jasmine.SpyObj<ProposalDetailsService>;

  beforeEach(async(() => {
    const spy = jasmine.createSpyObj('ProposalDetailsService', ['publishTemplateToDgCatalog']);

    TestBed.configureTestingModule({
      declarations: [ProposalMilestonePublishToCatalogDialogComponent],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        { provide: ProposalDetailsService, useValue: spy }
      ]
    }).compileComponents();

    mockDetailsService = TestBed.inject(ProposalDetailsService) as jasmine.SpyObj<ProposalDetailsService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalMilestonePublishToCatalogDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.targetUserForm.get('templateName')?.value).toBe('');
    expect(component.targetUserForm.get('dgCodes')?.value).toEqual([]);
  });

  it('should show validation errors when form is invalid and submitted', () => {
    component.publishTemplate();
    expect(component.submitted).toBe(true);
    expect(component.showTemplateNameError).toBe(true);
    expect(component.showDgError).toBe(true);
  });

  it('should add DG when selected from autocomplete', () => {
    const testDg = { code: 'CLIMA', label: 'CLIMA — Climate Action' };
    component.targetUserForm.get('dgSearch')?.setValue(testDg.label);

    expect(component.selectedDgs).toContain(jasmine.objectContaining(testDg));
    expect(component.dgCtrl.value).toContain(testDg.code);
  });

  it('should remove DG when chip is clicked', () => {
    const testDg = { code: 'CLIMA', label: 'CLIMA — Climate Action' };
    component.selectedDgs = [testDg];
    component.dgCtrl.setValue([testDg.code]);

    component.removeDg(0);

    expect(component.selectedDgs).toEqual([]);
    expect(component.dgCtrl.value).toEqual([]);
  });

  it('should call service when form is valid', () => {
    const milestone = { id: '1', title: 'Test Milestone' };
    component.milestone = milestone;
    component.targetUserForm.patchValue({
      templateName: 'Test Template',
      dgCodes: ['CLIMA']
    });

    component.publishTemplate();

    expect(mockDetailsService.publishTemplateToDgCatalog).toHaveBeenCalledWith(
      milestone, 'Test Template', ['CLIMA']
    );
  });

  it('should filter DGs based on search query', () => {
    component.onDgSearch('clima');

    const filtered = component.filteredDgItems.filter(item =>
      item.label.toLowerCase().includes('clima')
    );
    expect(filtered.length).toBeGreaterThan(0);
  });

  it('should reset form when modal is closed', () => {
    component.targetUserForm.patchValue({
      templateName: 'Test',
      dgCodes: ['CLIMA']
    });
    component.selectedDgs = [{ code: 'CLIMA', label: 'CLIMA — Climate Action' }];

    component.resetModal();

    expect(component.targetUserForm.get('templateName')?.value).toBe('');
    expect(component.selectedDgs).toEqual([]);
    expect(component.submitted).toBe(false);
  });
});
