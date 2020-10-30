import { Component, OnInit } from '@angular/core';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../admin.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  

  constructor(private  http: Http,private route: ActivatedRoute,private Adminservice:AdminService) { }

   username = this.Adminservice.getUsername();

  ngOnInit(): void {console.log('oops',this.username )
  }

}
