import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Helper } from "../../shared/helpers/utilities";
import { Title } from "@angular/platform-browser";
import { environment } from "../../../environments/environment";
import { UserService } from "../../shared/services/user.service";
import { PostService } from "../../shared/services/post.service";
import { AppComponent } from "../../app.component";
import { LoggedInUser } from "../../shared/classes/loggedInUser";
import { InterestsModel } from "src/app/shared/models/interests";
import { LanguageService } from './../../shared/services/language.service';
import { LanguageModel } from "src/app/shared/models/language";

declare var $;

@Component({
  selector: "app-topics",
  templateUrl: "./topics.component.html",
  styleUrls: ["./topics.component.css"],
  providers: [Title],
})
export class TopicsComponent implements OnInit {
  imagePath: any;
  btnloader: boolean;
  TopicsData = {
    Email: "",
    Code: "",
    Authorization: "abc",
  };
  errorMessage = "";

  Languages: LanguageModel[] = [];

  public PostService = PostService;
  public userInterestList: InterestsModel[] = [];

  public selectedInterests: string[] = [];
  public selectedLanguages: string[] = [];


  public sportsInterests: InterestsModel;
  public technologyInterests: InterestsModel;
  public mediaInterests: InterestsModel;
  public informationSecurityInterests: InterestsModel;
  public medicalInterests: InterestsModel;
  public naturalInterests: InterestsModel;
  public newsInterests: InterestsModel;
  public tourismInterests: InterestsModel;

  checkCodeAndEmail: boolean = false;

  constructor(
    public appComponent: AppComponent,
    private title: Title,
    private objUserService: UserService,
    private router: Router,
    public postService: PostService,
    private languageService: LanguageService,
  ) {
    this.imagePath = environment.imagePath;
    this.btnloader = false;
  }

  ngOnInit() {

    this.getInterests();
    this.getLanguages();


    this.title.setTitle("Topics | Risco");
    Helper.setBodyClass("signupPage scrool-none");
  }

  getInterests() {

    this.postService.getInterests().subscribe((res) => {
      if (res.StatusCode == 200) {
        this.userInterestList = res.Result;

        this.sportsInterests = res.Result.filter((x) => x.Name == "Sports")[0];
        this.technologyInterests = res.Result.filter(
          (x) => x.Name == "Technology"
        )[0];
        this.mediaInterests = res.Result.filter((x) => x.Name == "Media")[0];
        this.informationSecurityInterests = res.Result.filter(
          (x) => x.Name == "Information Security"
        )[0];
        this.medicalInterests = res.Result.filter(
          (x) => x.Name == "Medical"
        )[0];
        this.naturalInterests = res.Result.filter(
          (x) => x.Name == "Natural"
        )[0];
        this.newsInterests = res.Result.filter((x) => x.Name == "News")[0];
        this.tourismInterests = res.Result.filter(
          (x) => x.Name == "Tourism"
        )[0];
      }
    });
  }

  getLanguages() {

    this.languageService.getAllLanguages()
    .subscribe(res => {

      if (res.StatusCode == 200) {
        this.Languages = res.Result;
      }

    });
  }

  setInterests(childInterest) {
    childInterest.Selected = !childInterest.Selected;

    if (childInterest.Selected) {
      this.selectedInterests.push(childInterest.Id);
    } else if (!childInterest.Selected) {
      this.selectedInterests.splice(
        this.selectedInterests.indexOf(childInterest.Id),
        1
      );
    }
  }

  setLanguages(language) {

    debugger

    language.Selected = !language.Selected;

    if (language.Selected) {

      this.selectedLanguages.push(language.Id);
    }
    else if (!language.Selected) {

      this.selectedLanguages.splice(this.selectedLanguages.indexOf(language.Id), 1);
    }
  }

  updateUserInterests() {


    this.btnloader = true;
    this.objUserService.updateUserInterests(this.selectedInterests.toString(), this.selectedLanguages.toString()).subscribe((res) => {

      if (res.StatusCode == 200) {

        // $.notify(
        //   { message: 'Your account has been successfully set up. Welcome to Risco' },
        //   { type: 'success' }
        // );

        this.router.navigate(['/index'])
        this.btnloader = false;
      }
    });
  }
}
