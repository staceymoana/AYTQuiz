export interface Quiz {
  PartitionKey: string;
  SortKey: string,
  Title: string,
  Description: string,
  TotalAttempt: number,
  TotalAttempt10Under: number,
  TotalAttempt1120: number
  TotalAttempt2130: number,
  TotalAttempt3140: number,
  TotalAttempt4150: number,
  TotalAttempt5160: number,
  TotalAttempt61Over: number,
  TotalAttemptFemale: number,
  TotalAttemptMale: number,
  TotalAttemptOther: number,
  TotalScore: number,
  TotalScore10Under: number,
  TotalScore1120: number
  TotalScore2130: number,
  TotalScore3140: number,
  TotalScore4150: number,
  TotalScore5160: number,
  TotalScore61Over: number,
  TotalScoreFemale: number,
  TotalScoreMale: number,
  TotalScoreOther: number
}