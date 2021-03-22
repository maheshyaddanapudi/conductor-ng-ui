import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WireNewWorkflowDefinitionComponent } from './wire-new-workflow-definition.component';

describe('WireNewWorkflowDefinitionComponent', () => {
  let component: WireNewWorkflowDefinitionComponent;
  let fixture: ComponentFixture<WireNewWorkflowDefinitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WireNewWorkflowDefinitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WireNewWorkflowDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
