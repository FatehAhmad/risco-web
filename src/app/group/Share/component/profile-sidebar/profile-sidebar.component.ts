import { Component, OnInit } from '@angular/core';
import { TrendsModel } from '../../../../../app/Shared/models/tends';
import { PostService } from '../../../../../app/Shared/services/post.service';
import { UserService } from '../../../../../app/Shared/services/user.service';
import { UserModel } from '../../../../../app/Shared/models/userModel';
import { environment } from '../../../../../environments/environment';
import { GroupService } from '../../../../../app/Shared/services/group.service';
import { GroupDataModel } from '../../../../../app/Shared/models/group-data';
import { Router } from '@angular/router';
declare var $;
@Component({
  selector: 'app-profile-sidebar',
  templateUrl: './profile-sidebar.component.html',
  styleUrls: ['./profile-sidebar.component.css']
})
export class ProfileSidebarComponent implements OnInit {
  
  objTrends:TrendsModel[] = [];
  objUserSettings:UserModel;
  InterestsCount: boolean=false;
  public GroupService = GroupService;
  objGetGroups:GroupDataModel = new GroupDataModel();
  imagePath: any;
  PageSize: number;
  PageNo: number;

  constructor(private objRouter:Router,private objPostService:PostService,private objUserService:UserService,private objGroupService:GroupService){ 
    this.imagePath= environment.imagePath;
  }
  groupDetailsPage(Id){
    this.objRouter.navigate(["/group-detail/"+Id]);
  }

  heatMapRedirect(HashTag) {
    this.objRouter.navigate(["/heat-map/" + HashTag]);
  }
  
  ngOnInit() {
   $("#ts").parent().hide();

    
    this.objPostService.getTrending()
    .subscribe(res=>{
        if(res.StatusCode==200){                                    
            this.objTrends = res.Result.Trends;
        }
    });

    this.objUserService.getUserData()
    .subscribe(res => {
      if (res.StatusCode == 200) {        
        this.objUserSettings = res.Result;
        var i;
        for(i=0;i<this.objUserSettings.BasketSettings.Interests.length;i++){
          if(this.objUserSettings.BasketSettings.Interests[i].Checked==true){
            this.InterestsCount=true;
            break;
          }
         
        }       
      }
    });   

    this.PageSize=6;
    this.PageNo=0; 
    this.objGroupService.getGroups(this.PageSize,this.PageNo)
    .subscribe(res => {
        if (res.StatusCode == 200) {          
            this.objGetGroups=res.Result;
        }
    });

    var that=this;
    $(
      function($)
      {
        $('.wid_scroll').bind('scroll', function()
          {
            if($(this).scrollTop() + $(this).innerHeight()>=$(this)[0].scrollHeight)
            {             
              that.PageNo++; 
              that.objGroupService.getGroups(that.PageSize,that.PageNo)
              .subscribe(res => {
                  if (res.StatusCode == 200) {                     
                    res.Result.MyGroups.forEach(grp=>{
                      that.objGetGroups.MyGroups.push(grp);
                    });
                  }
              });
            }
          })
      }
    );
  } 
  
  
}


