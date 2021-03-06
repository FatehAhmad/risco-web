import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { UserService } from '../../../../../app/shared/services/user.service';
import { GroupService } from '../../../../../app/shared/services/group.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModel } from '../../../../../app/shared/models/userModel';
import { GroupsModel } from '../../../../../app/shared/models/groups';
import { JoinModel } from '../../../../../app/shared/models/join-model';
import { debug } from 'util';
import { DataService } from '../../../../../app/shared/services/data-service';

declare var $;

@Component({
  selector: 'app-group-sidebar',
  templateUrl: './group-sidebar.component.html',
  styleUrls: ['./group-sidebar.component.css']
})
export class GroupSidebarComponent implements OnInit {
  @ViewChild('inPictureCover') inPictureCover;
  imagePath: any;
  Group_Id:number;
  objUserSettings:UserModel= new UserModel();
  objGroupInfo:GroupsModel= new GroupsModel();
  objJoinModel:JoinModel = new JoinModel();
  aboutContent = "";

  constructor(private objDataService:DataService,
    private objRouter:Router,private objUserService:UserService, private objGroupService:GroupService, private objRoute:ActivatedRoute) {
    this.imagePath= environment.imagePath;
  }

  ngOnInit() {

  this.objRoute.params.subscribe(paramsId => {
    this.Group_Id=paramsId["Id"];
      this.getUserData();
      this.getGroupInfo(paramsId["Id"]);
   });
 }

 onFileChangeCoverGroupDetail(event){
    let files = event.target.files;
    var ext = files[files.length-1].name.split('.').pop();
    if (ext == "jpg" || ext == "png" || ext == "jpeg") {

    var reader = new FileReader();
    var that = this;
    reader.onload = function (e) {
      $('.coverImage').css('background-image', 'url(' + (<any>e.target).result + ')');

         let fileBrowser = that.inPictureCover.nativeElement;
         let file = fileBrowser.files[0];

         that.objGroupService.updateGroupImage(file,that.Group_Id)
         .subscribe(
           res => {
             if(res.StatusCode==200){

             }
           }
         );
    }
    reader.readAsDataURL(files[files.length-1]);
  }
 }

  getUserData(){
    this.objUserService.getUserData()
    .subscribe(res => {
        if (res.StatusCode == 200) {
          this.objUserSettings = res.Result;
        }
    });
  }

  getGroupInfo(Id){

    debugger

    this.objGroupService.getGroupInfo(Id)
    .subscribe(res => {
        if (res.StatusCode == 200) {
            this.objGroupInfo=res.Result;
            this.aboutContent = this.objGroupInfo.Description;
        }
        if(res.StatusCode == 500){
          this.objRouter.navigate(['/index']);
      }
    });
  }

  joinGroup(Id){
    this.objGroupService.joinGroup(Id)
    .subscribe(res=>{
      this.objGroupInfo.Status=res.Result.Status;
    })
  }

  cancelJoinRequest(Id){
    this.objGroupService.cancelJoinRequest(Id)
    .subscribe(res=>{
      this.objGroupInfo.Status=res.Result.Status;
    })
  }

  leftGroupByUser(Id){
    this.objGroupService.leftGroupByUser(Id)
    .subscribe(res=>{
      this.objGroupInfo.Status=res.Result.Status;
      this.objDataService.leaveGroup({});
    })
  }

  deleteGroup(Id){
    this.objGroupService.deleteGroup(Id)
    .subscribe(res=>{
      this.objRouter.navigate(['/index']);
    })
  }

}
