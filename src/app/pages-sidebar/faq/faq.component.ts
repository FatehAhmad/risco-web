import { Component, OnInit } from '@angular/core';
import { Helper } from '../../shared/helpers/utilities';
import {StaticPagesModel} from '../../shared/models/staticpagesModel';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { SettingsService } from 'src/app/shared/services/settings';
import { SettingsModel } from 'src/app/shared/models/settings';

declare var $;
@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
  providers: [Title]
})
export class FaqComponent implements OnInit {

  objStaticPagesModel : StaticPagesModel = new StaticPagesModel();
  imagePath: any;
  objGetSettings:SettingsModel=new SettingsModel();

  constructor(private objSettingsService:SettingsService, private title: Title) {
    this.imagePath= environment.imagePath;

  }

  ngOnInit() {

    this.title.setTitle('FAQs | Risco');
    Helper.setBodyClass("faqPage");

    this.objSettingsService.getFAQs()
    .subscribe(res=>{

      if(res.StatusCode==200){

        this.objGetSettings = res.Result;

        var faqs: any[] = res.Result;

        for (var i = 0; i < faqs.length; i++) {

          // $(".activity-panel").html(faqs[i]);
          $(".activity-panel").append(faqs[i].Question);
          $(".activity-panel").append(faqs[i].Answer);
        }
      }
    });
  }

}
