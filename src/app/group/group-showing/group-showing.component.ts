import { Component, OnInit } from '@angular/core';
import { Helper } from '../../shared/helpers/utilities';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-group-showing',
  templateUrl: './group-showing.component.html',
  styleUrls: ['./group-showing.component.css'],
  providers: [Title]
})
export class GroupShowingComponent implements OnInit {
  imagePath: any;

  constructor(private title: Title) { 
    this.imagePath= environment.imagePath;
  }

  ngOnInit() {
    
    this.title.setTitle('Group Showing | Risco');

    Helper.setBodyClass("home-page");
  }

}
