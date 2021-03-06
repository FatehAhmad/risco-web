import { Component, OnInit } from '@angular/core';
import { Helper } from '../../shared/helpers/utilities';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home-group',
  templateUrl: './home-group.component.html',
  styleUrls: ['./home-group.component.css'],
  providers: [Title]
})
export class HomeGroupComponent implements OnInit {
  imagePath: any;

  constructor(private title: Title) { 
    this.imagePath= environment.imagePath;
  }

  ngOnInit() {

    
    this.title.setTitle('Home Group | Risco');

    Helper.setBodyClass("home-page");
  }

}
