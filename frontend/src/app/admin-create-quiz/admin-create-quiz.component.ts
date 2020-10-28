import { Component, OnInit } from '@angular/core';
import { FormGroup,Validators,FormBuilder, FormControl, FormArray} from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-admin-create-quiz',
  templateUrl: './admin-create-quiz.component.html',
  styleUrls: ['./admin-create-quiz.component.css']
})
export class AdminCreateQuizComponent implements OnInit {
quizForm:FormGroup;

public Title;
public Description;
  constructor(private fb:FormBuilder) { }

  ngOnInit(): void {
this.quizForm=this.fb.group({
      title: ['ll',Validators.required],
      description: [''],
      questions:this.fb.array([
        this.addQuectionFormGroup()
      ])
})}

  logKeyValuePairs(group:FormGroup):void{
Object.keys(group.controls).forEach((key: string)=>{
const abstractControl=group.get(key);
if (abstractControl instanceof FormGroup) {
  this.logKeyValuePairs(abstractControl);
  
}else{
  console.log();
}
  });}
  
  addQuectionFormGroup():FormGroup{

   return this.fb.group({
      question:['test'],
      type:['Multiple'],
      options:this.fb.array([
        this.addAnswerFormGroup()
      ])
    });

  }
  addAnswerFormGroup():FormGroup{

    return this.fb.group({
    value:['test'],
   isCorrect:['enabled']
     });
 
   }
  addQuestionbtn():void{
    (<FormArray>this.quizForm.get('questions')).push(this.addQuectionFormGroup());
    console.log('this form',this.quizForm)
    console.log('this answer',this.quizForm.get('questions.options'))
    console.log('this answer',this.quizForm.get('questions'))
    console.log('this answer',this.quizForm.get('questions').get('options'))
    console.log('this answer',this.quizForm.get('questions'))
    
  }
  addAnswerbtn():void{
   // (<FormArray>this.quizForm.get('options')).push(this.addAnswerFormGroup());
    console.log('this form',this.quizForm.get('questions').get('options'))
  }

  removeQuestionbtn(removeQuizId:number):void{
    (<FormArray>this.quizForm.get('questions')).removeAt(removeQuizId);
    console.log('this remove QuizId',removeQuizId)
  }
  addQuiz(){

this.Title =this.quizForm.get('title').value;
this.Description =this.quizForm.get('description').value;
    console.log('Quiz',this.Title,this.Description);
  }
  onSubmit():void{
  
  }
}


