import { Component, OnInit } from '@angular/core';
import { TrendsModel } from '../../../../../app/shared/models/tends';
import { PostService } from '../../../../../app/shared/services/post.service';
import { UserService } from '../../../../../app/shared/services/user.service';
import { UserModel } from '../../../../../app/shared/models/userModel';
import { environment } from '../../../../../environments/environment';
import { GroupService } from '../../../../../app/shared/services/group.service';
import { GroupDataModel } from '../../../../../app/shared/models/group-data';
import { ActivatedRoute, Router } from '@angular/router';

declare var $;

@Component({
  selector: 'app-user-profile-sidebar',
  templateUrl: './user-profile-sidebar.component.html',
  styleUrls: ['./user-profile-sidebar.component.css']
})

export class UserProfileSidebarComponent implements OnInit {
  
  objTrends:TrendsModel[] = [];
  objUserSettings:UserModel;
  InterestsCount: boolean=false;
  objGetGroups:GroupDataModel = new GroupDataModel();
  imagePath: any;
  PageSize: number;
  PageNo: number;
  ParamId: any;

  constructor(private objRouter:Router,private objRoute:ActivatedRoute,private objPostService:PostService,private objUserService:UserService,private objGroupService:GroupService){ 
    this.imagePath= environment.imagePath;
  }

  heatMapRedirect(HashTag) {
    this.objRouter.navigate(["/heat-map/" + HashTag]);
  }

  ngOnInit() {
   $("#ts").parent().hide();
   this.objRoute.params.subscribe(paramsId => {
   this.ParamId=paramsId["Id"];            
});
    
    this.objPostService.getTrending()
    .subscribe(res=>{
        if(res.StatusCode==200){                                    
            this.objTrends = res.Result.Trends;
        }
    });

    this.objUserService.getUserById(this.ParamId)
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
  }  
}


