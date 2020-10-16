import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateasurveyComponent } from './createasurvey.component';

describe('CreateasurveyComponent', () => {
  let component: CreateasurveyComponent;
  let fixture: ComponentFixture<CreateasurveyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateasurveyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateasurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
