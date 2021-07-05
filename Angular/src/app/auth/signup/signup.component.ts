import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy{
  isLoading: boolean;
  authObservableSubscription: Subscription;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authObservableSubscription = this.authService.getAuthStatusListener().subscribe(
      authStatus =>{
        if(authStatus == false){
          this.isLoading = false;
        }
      }
    );
  }

  ngOnDestroy(){
    this.authObservableSubscription.unsubscribe();
  }

  onSignup(form: NgForm){
    this.isLoading = true;
    if(form.valid){
      this.authService.createUser(form.value.email, form.value.password);
    }
  }
}
