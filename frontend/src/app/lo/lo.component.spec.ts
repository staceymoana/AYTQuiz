import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoComponent } from './lo.component';

describe('LoComponent', () => {
  let component: LoComponent;
  let fixture: ComponentFixture<LoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
