import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmNewWorkflowDefinitionComponent } from './confirm-new-workflow-definition.component';

describe('ConfirmNewWorkflowDefinitionComponent', () => {
  let component: ConfirmNewWorkflowDefinitionComponent;
  let fixture: ComponentFixture<ConfirmNewWorkflowDefinitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmNewWorkflowDefinitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmNewWorkflowDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
