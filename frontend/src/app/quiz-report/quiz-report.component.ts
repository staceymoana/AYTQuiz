import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quiz-report',
  templateUrl: './quiz-report.component.html',
  styleUrls: ['./quiz-report.component.css']
})
export class QuizReportComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  barChartOptions = {
  	scaleShowVerticalLines: false,
  	responsive: true
  }

  barChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012']
  barChartType = 'horizontalBar'
  barChartLegend = true

  barChartData = [
  	{data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
  	{data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  ]  

  loadReport(value) {
  	
  }

}
