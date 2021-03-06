import { Component, OnInit, EventEmitter } from '@angular/core';
import { PostModel } from '../shared/models/post';
import { PostService } from '../shared/services/post.service';
declare var $: any;

@Component({
  selector: 'app-groups',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
})
export class GroupComponent implements OnInit {
  public PostService = PostService;
  public url = window.location.href;
  public isVerification: boolean = false;
  public imagePath = "";
  isotopeGrid: any;

  constructor() { }

  ngOnInit() {

    this.isotopeGrid = $('.grid').isotope({
      layoutMode: 'packery',
      itemSelector: '.grid-item',
      packery: {
          gutter: 0
      }
    })



  }
  sharePostObject: PostModel;
  eventWhenShareComplete = new EventEmitter<PostModel>();
  sharePostClick(postObject) {
    this.sharePostObject = postObject;
    setInterval(() => {
      this.isotopeGrid.isotope('reloadItems').isotope();
    }, 300);
  }
  resetSharePostObj(postedObj: PostModel) {
    this.sharePostObject = undefined;
    this.eventWhenShareComplete.emit(postedObj);
    setInterval(() => {
      this.isotopeGrid.isotope('reloadItems').isotope();
    }, 300);
  }
}
