import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor{
    public constructor(private authService: AuthService){}

    //Appends the token to outgoing http requests 
    intercept(req: HttpRequest<any>, next: HttpHandler){
        const token = this.authService.getToken();
        const updatedRequest = req.clone({
            headers: req.headers.set("Token", token)
        });

        return next.handle(updatedRequest);

        // return next.handle(req);
    }
}