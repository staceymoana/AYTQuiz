import { Component, OnInit } from '@angular/core';
import {DatabaseService} from "backend/services/database.service";
import {Observable, from} from "rxjs";
import {NgForm} from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
@Component({
  selector: 'app-lo',
  templateUrl: './lo.component.html',
  styleUrls: ['./lo.component.css']

})
export class LoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
