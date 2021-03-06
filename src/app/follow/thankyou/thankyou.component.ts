import { Component, OnInit } from '@angular/core';
import { Helper } from '../../shared/helpers/utilities';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.css'],
  providers: [Title]
})
export class ThankyouComponent implements OnInit {
  imagePath: any;

  constructor(private title: Title ,private activatedRoute: ActivatedRoute) {
    this.imagePath= environment.imagePath;
  
   }

  ngOnInit() {
    this.activatedRoute.snapshot.url;
    this.title.setTitle('Thankyou | Risco');

    Helper.setBodyClass('loginPage thankuPage');

  }

}
