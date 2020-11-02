import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-one-quetion',
  templateUrl: './one-quetion.component.html',
  styleUrls: ['./one-quetion.component.css']
})
export class OneQuetionComponent implements OnInit {

  constructor() { }

  @Input() i;
  @Input() queArr;
  @Output() countChanged: EventEmitter<any> =   new EventEmitter();

  options: any = [{ value: '', isShow: true, isCorrect: false }];
  optionValue: any = []
  isShow: any = true;

  quetion: any = '';
  type: any = 'Multi-choice';
  optionsArr: any = [];

  ngOnInit(): void {
  }

  getValue() {
    let oneQuetionData = {
      question: this.quetion,
      type : this.type,
      options : this.optionsArr,
      isShow : this.isShow,
      i : this.i
    }
    this.countChanged.emit(oneQuetionData);
  }

  addOption() {
    this.options.push({ value: '', isShow: true, isCorrect: false });
  }

  countChangedHandler(data) {
    this.optionValue[data.i] = data;
    let options = []
    this.optionValue.forEach(function (value) {
      if (value.isShow == true) {
        options.push({ value: value.value, isCorrect: value.isCorrect })
      }
    });
    this.optionsArr = options;
    this.getValue();
  }

  removeQuetionInput(index) {
    this.queArr.splice(index,1)
    // this.isShow = false;
    //this.queArr.pop(index,1)
  }

}
