import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from "./auth-data.model";
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.BACKEND_URL + "user/";

@Injectable({providedIn: 'root'})
export class AuthService{
    

    private token: string = "";
    private isAuthenticated = false;
    private tokenTimer: any;
    private userId: string | null;
    private authStatusListener: Subject<boolean> = new Subject();

    public constructor(public http: HttpClient, private router: Router){}

    public getToken(){
        return this.token;
    }

    public getAuthStatus(){
        return this.isAuthenticated;
    }

    public getUserId(){
        return this.userId;
    }

    public getAuthStatusListener(){
        return this.authStatusListener.asObservable();
    }

    createUser(email: string, password: string){
        const AuthData: AuthData = {email: email, password: password};
        this.http.post(BACKEND_URL + "signup", AuthData)
        .subscribe( response =>{
            this.loginUser(email, password);
        }, (error) =>{
            this.authStatusListener.next(false);
        });
    }

    loginUser(email: string, password: string){
        const AuthData: AuthData = {email: email, password: password};
        this.http.post<{token: string, expiresIn: number, userId: string}>(BACKEND_URL + "login", AuthData)
        .subscribe( response =>{
            console.log(response);
            this.token = response.token;
            if(response.token){
               this.setTokenTimer(response.expiresIn);
                this.saveTokenInLocalStorage(response.token, new Date((new Date).getTime() + response.expiresIn * 1000), response.userId);
                this.userId = response.userId;
                this.authStatusListener.next(true);
                this.isAuthenticated = true;
                this.router.navigate(["/"]);
            }
            
        }, (error) =>{
            this.authStatusListener.next(false);
        });
    }

    logout(){
        clearTimeout(this.tokenTimer);
        this.token = "";
        this.isAuthenticated = false;
        this.userId = null;
        this.authStatusListener.next(false);
        this.clearLocalStorage();
        this.router.navigate(["/"]);
    }

     autoLoginUser(){
        const tokenData = this.fetchTokenFromLocalStorage();
        if(tokenData){
            let remainingTime = new Date(tokenData.expirationDate).getTime() - (new Date()).getTime() 
            if(remainingTime > 0){
                this.token = tokenData.token;
                this.isAuthenticated = true;
                this.userId = tokenData.userId;
                this.authStatusListener.next(true);
                this.setTokenTimer(remainingTime / 1000);
            }
        }
    }

    private setTokenTimer(seconds: number){
        this.tokenTimer = setTimeout(() => { //guardo el timer para clearearlo si el usuario loguea por su cuenta
            this.logout();
        }, seconds * 1000);
    }

    private saveTokenInLocalStorage(token: string, expirationDate: Date, userId: string){
        localStorage.setItem("token", token);
        localStorage.setItem("expirationDate", expirationDate.toISOString());
        localStorage.setItem("userId", userId);
    }

    private fetchTokenFromLocalStorage(){
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem("expirationDate");
        const userId = localStorage.getItem("userId");
        if(token && expirationDate && userId){
            return {token: token, expirationDate: expirationDate, userId: userId}
        } else {
            return null;
        }
    }

    private clearLocalStorage(){
        localStorage.removeItem("token");
        localStorage.removeItem("expirationDate");
        localStorage.removeItem("userId");
    }
}