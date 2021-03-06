import { Component, OnInit } from '@angular/core';
import { Helper } from '../../shared/helpers/utilities';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { GroupService } from '../../shared/services/group.service';
import { GroupDataModel } from '../../shared/models/group-data';
import { Router } from '@angular/router';
import { JoinModel } from '../../shared/models/join-model';
import { GroupsModelGeneral } from '../../shared/models/groups-model';
import { UserService } from '../../shared/services/user.service';
import { GeneralSearchModel } from '../../shared/models/general-search';

declare var $;

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
  providers: [Title]
})
export class GroupsComponent implements OnInit {
  imagePath: any;
  PageSize: number;
  PageNo: number;
  objGetGroups:GroupsModelGeneral = new GroupsModelGeneral();
  objJoinModel:JoinModel = new JoinModel();
  searchText: string;
  objSearchModel:GeneralSearchModel= new GeneralSearchModel();
  searchTextGroup:string="";

  constructor(private objUserService:UserService,private objRouter:Router,private title: Title, private objGroupService:GroupService) { 
    this.imagePath= environment.imagePath;
  }

  initializeScripts() {
    $('.people_search span').on('click', function(e){
      e.stopPropagation();
      $(this).parent().find('.input').addClass('show');
    });
    
    $(".add_people_pnl .head a").click(function(event) {
      event.preventDefault();
      $(this).addClass("current");
      $(this).siblings().removeClass("current");
      var tab = $(this).attr("href");
      $(".tab").not(tab).css("display", "none");
      $(tab).stop(0,0).fadeIn();
  });

  }

  ngOnInit() {
    
    this.initializeScripts();

    this.title.setTitle('Groups | Risco');
    Helper.setBodyClass("home-page");

    this.PageSize=6;
    this.PageNo=0; 
    this.objGroupService.getGroups(this.PageSize,this.PageNo)
    .subscribe(res => {
        if (res.StatusCode == 200) {                         
            this.objGetGroups=res.Result;
        }
    });

  }

  search(){
    if(this.searchTextGroup==""){
      $('.autocomplete_pnl').fadeOut();
      return;
    }
    
    this.objGroupService.groupSearching(this.searchTextGroup)
    .subscribe(res=>{
      $('.group_search .autocomplete_pnl').fadeIn();
      this.objSearchModel=res.Result;
    })
  }

  groupDetailsPage(Id){
    this.objRouter.navigate(["/group-detail/"+Id]);
  }

  joinGroup(Id,index){
    this.objGroupService.joinGroup(Id)
    .subscribe(res=>{ 
      ;
      this.objGetGroups.SuggestedGroups[index].Status=res.Result.Status;  
    })
  }

  cancelJoinRequest(Id,index){
    this.objGroupService.cancelJoinRequest(Id)
    .subscribe(res=>{
      ;
      this.objGetGroups.SuggestedGroups[index].Status=res.Result.Status;  

    })
  }

}
