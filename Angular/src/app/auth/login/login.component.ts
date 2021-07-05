import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  authObservableSubscription: Subscription;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoading = false;

    this.authObservableSubscription = this.authService.getAuthStatusListener()
    .subscribe(authStatus =>{
      if(authStatus == false){
        this.isLoading = false;
      }
    })
  }

  ngOnDestroy(){
    this.authObservableSubscription.unsubscribe();
  }

  onLogin(form: NgForm){
    if(form.valid){
      this.authService.loginUser(form.value.email, form.value.password);
    }
  }

}
