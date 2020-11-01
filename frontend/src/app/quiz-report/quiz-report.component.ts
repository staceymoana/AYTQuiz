import { Component, OnInit } from '@angular/core';
import { Question } from '../question';
import { Report } from '../report';
import { QuizService } from '../quiz.service';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../admin.service';
@Component({
  selector: 'app-quiz-report',
  templateUrl: './quiz-report.component.html',
  styleUrls: ['./quiz-report.component.css']
})
export class QuizReportComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,private Adminservice:AdminService
  ) { }

  ngOnInit(): void {
    this.getQuestions()
    this.demographicFilter = "age"
    this.questionFilter = "overall"
    this.loadReport();
    
    
  }
  username = this.Adminservice.getUsername();
  
  demographicFilter = ""
  questionFilter = ""
  
  // chart data
  barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    suggestedMax: 100,
    scales: {
        xAxes: [{
            ticks: {
                suggestedMax: 100,
                beginAtZero: true
            }
        }]
    },
    legend: {
      display: false
    }
  }

  barChartLabels = []
  barChartType = 'horizontalBar'
  barChartLegend = true

  chartData = []
  barChartData = []

  changeDemographic(demographic) {
    this.demographicFilter = demographic
    this.loadReport()    
  }

  changeQuestion(questionID) {
    this.questionFilter = questionID //overall if no specific question selected   
    this.loadReport()
  }

  quizID = this.route.snapshot.paramMap.get('quizID')  
  questions: Question[];
  reports: Report;

  getQuestions(): void {
    this.quizService.getQuizQuestions(this.quizID,this.username)
      .subscribe(questions => this.questions = questions)
  }

  loadReport(): void {

    if (this.questionFilter == "overall") {
      this.quizService.getQuizDetails(this.username, this.quizID, this.demographicFilter)
      .subscribe(aggregates => 
        {
          this.reports = aggregates
          this.updateChartData()
        })      
    }
    else {
      this.quizService.getQuestionDetails(this.quizID, this.questionFilter, this.demographicFilter)
      .subscribe(aggregates => 
        {
          this.reports = aggregates
          this.updateChartData()
        })
    }

  }

  updateChartData(): void {

    this.barChartLabels.length = 0
    this.chartData.length = 0

    //update chart labels
    if (this.reports.PercentMale != "none")
      this.barChartLabels.push("Male")
    if (this.reports.PercentFemale != "none")
      this.barChartLabels.push("Female")
    if (this.reports.PercentOther != "none")
      this.barChartLabels.push("Other")
    if (this.reports.Percent10Under != "none")
      this.barChartLabels.push("10 and under")
    if (this.reports.Percent1120 != "none")
      this.barChartLabels.push("11-20")
    if (this.reports.Percent2130 != "none")
      this.barChartLabels.push("21-30")
    if (this.reports.Percent3140 != "none")
      this.barChartLabels.push("31-40")
    if (this.reports.Percent4150 != "none")
      this.barChartLabels.push("41-50")
    if (this.reports.Percent5160 != "none")
      this.barChartLabels.push("51-60")
    if (this.reports.Percent61Over != "none")
      this.barChartLabels.push("61 and over")

    //update chart values
    if (this.reports.PercentMale != "none")
      this.chartData.push(this.reports.PercentMale)
    if (this.reports.PercentFemale != "none")
      this.chartData.push(this.reports.PercentFemale)
    if (this.reports.PercentOther != "none")
      this.chartData.push(this.reports.PercentOther)
    if (this.reports.Percent10Under != "none")
      this.chartData.push(this.reports.Percent10Under)
    if (this.reports.Percent1120 != "none")
      this.chartData.push(this.reports.Percent1120)
    if (this.reports.Percent2130 != "none")
      this.chartData.push(this.reports.Percent2130)
    if (this.reports.Percent3140 != "none")
      this.chartData.push(this.reports.Percent3140)
    if (this.reports.Percent4150 != "none")
      this.chartData.push(this.reports.Percent4150)
    if (this.reports.Percent5160 != "none")
      this.chartData.push(this.reports.Percent5160)
    if (this.reports.Percent61Over != "none")
      this.chartData.push(this.reports.Percent61Over)

    this.barChartData = [{data: this.chartData, backgroundColor: ["orange", "gray", "orange", "gray", "orange", "gray", "orange", "gray", "orange", "gray"], hoverBackgroundColor: ["orange", "gray", "orange", "gray", "orange", "gray", "orange", "gray", "orange", "gray"]}]
  }

}
