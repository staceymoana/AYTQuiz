import { Component, OnInit } from '@angular/core';
export class User {
  public name: string;
  public email: string;
  public password: string;
  public hobbies: string;
}
@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent {

  model = new User();
  
  
  



 Hobbies: string[] = [
    'Acrobatics',
    'Acting',
    'Animation',
    'Astronomy',
    'Baking'
  ];
  constructor() { }

 
  onSubmit(form) {
    console.log(form.value)
  }
}
