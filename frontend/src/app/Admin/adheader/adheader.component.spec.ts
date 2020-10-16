import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdheaderComponent } from './adheader.component';

describe('AdheaderComponent', () => {
  let component: AdheaderComponent;
  let fixture: ComponentFixture<AdheaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdheaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
