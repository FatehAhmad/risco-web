import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { LoggedInUser } from '../../shared/classes/loggedInUser';
declare var $: any;

@Component({
    template: ""
})
export class PostComponent implements OnInit {
    constructor(private route: ActivatedRoute, private router: Router) {
    }
    ngOnInit(): void {
        this.setPostIdIfPresent();
    }

    setPostIdIfPresent() {
        this.checkIsLoggedIn();
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                if (val.url.indexOf("/post/") > -1) {
                    this.checkIsLoggedIn();
                }
            }
        });
    }
    checkIsLoggedIn() {
        this.route.params.subscribe(params => {
            var postId = params["postId"];
            if (postId) {
                localStorage.setItem("postId", postId);

            }

            var user = LoggedInUser.getLoggedInUser();
            if (!user) {
                this.router.navigate(["signin"]);
            } else {
                this.router.navigate(["index"]);

            }
        });
    }

}