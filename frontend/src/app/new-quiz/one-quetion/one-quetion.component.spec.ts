import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneQuetionComponent } from './one-quetion.component';

describe('OneQuetionComponent', () => {
  let component: OneQuetionComponent;
  let fixture: ComponentFixture<OneQuetionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneQuetionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneQuetionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
