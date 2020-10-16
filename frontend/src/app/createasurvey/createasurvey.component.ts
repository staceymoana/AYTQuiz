import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { jsonpFactory } from '@angular/http/src/http_module';
import { Observable } from 'rxjs';
import { QuectionService } from './quections';
import {DatabaseService} from "../services/db.service";
export class CreateQuiz1s {
  public name: string;
  public age: number;
  public gender: string;

}
@Component({
  selector: 'app-createasurvey',
  templateUrl: './createasurvey.component.html',
  styleUrls: ['./createasurvey.component.css'],
  providers:[DatabaseService]
})


export class CreateasurveyComponent implements OnInit {


  public  quections = [];


data: Array<any>
totalRecords:string
page:Number=1
results:string
 result:string;
  options = [
    { value: '1', label: 'Choose Gender' },
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
 
  ];
  selectedValue = '1';
//  constructor(private quectionService: QuectionService) { 
    constructor(private database: DatabaseService) { 
  // this.data=new Array<any>()
  }
 
getq(){

  this.database.getQuection("").subscribe(data => this.quections = data);

 // this.quectionService.getData().subscribe((data)=>{
 //   this.results=JSON.stringify(data.json);

   // console.log('data',data.Questions.Question)

   // this.data=data;
   // this.totalRecords=data.Questions.Question.length;
   //this.results=data;
 //dummy data
 //this.data=data.results
 //this.totalRecords=data.results.length
 console.log('new',this.data)
 console.log('countQuections',this.totalRecords)


 // this.quectionoptions.push(data.results);
   // this.quections.push(data.Quiz);
    //console.log('quections',this.quectionoptions)
   //console.log('quectionoptions',data.Options)




 // })
}


/*

items=[];
quections=[];
quectionoptions=[];
*/


  onSubmit(formValues: JSON) {        
     
    }
  

  model = new CreateQuiz1s();





  getQuctions(){
   /* this.httpclient.get('https://raw.githubusercontent.com/LakionML/BAP/master/1.json')
    .subscribe((data:any[])=>{
console.log(data);

for( let key in data)
if(data.hasOwnProperty(key))


this.quections.push(data[key]);
console.log(this.quections);
//console.log('sssssssssss',this.quections[0]);
//this.quectionoptions.push(this.quections[0]);
//console.log(this.quectionoptions);
    })
*/


    
      }

  ngOnInit(): void {
    this.getQuctions();
    this.getq();
  }
  /*
  onSubmit(form) {
    console.log(form.value.age)
    console.log(form.value.name)
  }*/

  getSelectedValue(value: any) {
  //  console.log('Selected value:', value);
this.model.gender=value;
  }

 

  btnClick(){
  /*  let url='http://httpbin.org/post';

    this.httpclient.post(url,
      {
        name:this.model.name,
        age: this.model.age,
        gender:this.model.gender
      }).toPromise().then((data:any)=>{
        console.log(data);
        
      this.result=JSON.stringify(data.json);
      })

*/
}



}
