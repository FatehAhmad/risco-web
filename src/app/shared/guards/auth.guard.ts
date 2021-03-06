import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { } 
  
    canActivate() {
        if (localStorage.getItem('loggedInUser')) {
            return true;
        }
        this.router.navigate(['/login']);
        return false;
    }
}
