import { Component, OnInit, EventEmitter } from '@angular/core';
import { PostModel } from '../shared/models/post';
import { PostService } from '../shared/services/post.service';
import { AppComponent } from '../app.component';
declare var $: any;


@Component({
  selector: 'app-pages-sidebar',
  templateUrl: './pages-sidebar.component.html',
  styleUrls: ['./pages-sidebar.component.css']
})
export class PagesSidebarComponent implements OnInit {
  public PostService = PostService;
  public url = window.location.href;
  public isVerification: boolean = false;
  public imagePath = "";
  isotopeGrid: any;

  constructor(public appComponent: AppComponent) { }

  ngOnInit() {

    this.isotopeGrid = $('.grid').isotope({
      layoutMode: 'packery',
      itemSelector: '.grid-item',
      packery: {
          gutter: 0
      }
    })


    // this.appComponent.eventWhenShareComplete.subscribe((postedObj) => {


    //   debugger

    //     postedObj.CreatedDate = new Date(postedObj.CreatedDate + 'Z');
    //     postedObj.Text = Helper.detectAndCreateLinks(postedObj.Text);


    //     this.objGetPostSettings.Posts.push(postedObj);
    // });



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
