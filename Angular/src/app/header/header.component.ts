import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from "../auth/auth.service";
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuth: boolean = false;
  authSubscription: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userIsAuth = this.authService.getAuthStatus();
    this.authSubscription = this.authService.getAuthStatusListener().subscribe( (isAuth) =>{
      this.userIsAuth = isAuth;
    });
  }

  ngOnDestroy(): void{
    this.authSubscription.unsubscribe();
  }

  onLogout(){
    this.authService.logout();
  }

}
