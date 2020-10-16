import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
@Component({
  selector: 'app-quiz-view',
  templateUrl: './quiz-view.component.html',
  styleUrls: ['./quiz-view.component.css']
})
export class QuizViewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    
   var myChart = new Chart("myChart", {
    type: 'horizontalBar',
    
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            barThickness: 10,
            maxBarThickness: 10,
            minBarLength: 10,
            label: '# of Votes',
            data: [12, 19, 3, 5, 6, 3],
            backgroundColor: [
                'rgba(243, 111 ,45 ,1)',
                'rgba(243, 111 ,45 ,1)',
                'rgba(243, 111 ,45 ,1)',
                'rgba(243, 111 ,45 ,1)',
                'rgba(243, 111 ,45 ,1)',
                'rgba(243, 111 ,45 ,1)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
             
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});
  }

}
