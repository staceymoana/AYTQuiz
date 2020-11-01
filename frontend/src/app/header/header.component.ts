import { Component, OnInit } from '@angular/core';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../admin.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  

  constructor(private  http: Http,private route: ActivatedRoute,private Adminservice:AdminService,private routers:Router) { }

   username = this.Adminservice.getUsername();

  ngOnInit(): void {
    console.log('oops',this.username )

    if (this.username==null||this.username=='') {
      this.routers.navigate(['/login']);
    } 
  }
  logout(){

    Swal.fire({
      title: 'Are you sure?',
      text: "You will we disconnected from your session.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f36f2d',
      cancelButtonColor: '#dae0e5',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Logout Successful',
          'Session disconnected.',
          'success',
          
        ),this.username=null;
        location.reload();
      }
    })
  }
}
