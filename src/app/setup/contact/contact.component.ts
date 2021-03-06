import { Component, OnInit } from '@angular/core';
import { Helper } from '../../shared/helpers/utilities';
import { ContactService } from '../../shared/services/contact.service';
import { Router } from '@angular/router';
import { LoggedInUser } from '../../shared/classes/loggedInUser';
import { ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  providers: [Title]
})
export class ContactComponent implements OnInit {

  timer: any;
  SuccessVisible: boolean = false;
  ErrorVisible:boolean=false;
  ErrorMessage:string="";
  isSaveButtonClick:boolean = false;  
  
  @ViewChild('ContactForm') ContactForm;
  imagePath: any;



  constructor(private objContactService: ContactService, public objRouter: Router,private title: Title) { 
    this.imagePath= environment.imagePath;
  }


  onKeyUp($event,Description){
    if($event.key=="Enter"){
      this.onSubmit(Description);
    }
  }

  onSubmit(description){ 
    if(!this.ContactForm.valid){
      this.isSaveButtonClick = true;
      return;
    }
  
    this.isSaveButtonClick = false;

    this.objContactService.checkContactAuth(description.value)
    .subscribe(res => {      
        if(res.StatusCode == 200){      
          this.ErrorVisible = false;
          this.SuccessVisible =true; 

          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            this.objRouter.navigate(["/index"]);           
          }, 2000);

         
        }
        else{         
          this.SuccessVisible =false;          
          this.ErrorVisible = true;          
          this.ErrorMessage = res.Result.ErrorMessage;
        }
      }
    )
  }

  ngOnInit() {

    this.title.setTitle('Contact Us | Risco');
    Helper.setBodyClass("home-page");
  }

}
