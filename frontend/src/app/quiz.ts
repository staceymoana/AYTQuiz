export interface Quiz {
  PartitionKey: string;
  SortKey: string,
  Title: string,
  Description: string,
  IsDemographicSelected: boolean,
  AccessLink: string
}