import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreateQuizComponent } from './admin-create-quiz.component';

describe('AdminCreateQuizComponent', () => {
  let component: AdminCreateQuizComponent;
  let fixture: ComponentFixture<AdminCreateQuizComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCreateQuizComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCreateQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
