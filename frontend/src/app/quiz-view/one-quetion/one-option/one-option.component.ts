import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-one-option',
  templateUrl: './one-option.component.html',
  styleUrls: ['./one-option.component.css']
})
export class OneOptionComponent implements OnInit {

  constructor() { }

  @Input() i;
  @Output() countChanged: EventEmitter<any> =   new EventEmitter();

  isShow: any = true;

  value = '';
  isCorrect = false;


  ngOnInit(): void {
  }
  
  getValue(){
    this.countChanged.emit({
      value : this.value,
      isCorrect : this.isCorrect,
      isShow : this.isShow,
      i : this.i
    });
  }

  removeOption(){
    this.isShow = false;
    this.getValue();
  }

}
