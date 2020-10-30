import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizLeaderboardComponent } from './quiz-leaderboard.component';

describe('QuizLeaderboardComponent', () => {
  let component: QuizLeaderboardComponent;
  let fixture: ComponentFixture<QuizLeaderboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizLeaderboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizLeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
