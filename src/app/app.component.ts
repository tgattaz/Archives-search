import {Component, OnInit} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';

@Component({
    selector: 'as-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    cookieValue: string;

    DATA$:  Observable<any>;

    checkHAL: Boolean;
    checkARXIV: Boolean;
    loading: Boolean;
    error: Boolean;
    cookie: Boolean;
    cookie_getted: Boolean;
    
    constructor(private http: HttpClient, private cookieService: CookieService) {
        this.checkHAL = true;
        this.checkARXIV = true;
        this.loading = false;
        this.error = false;
        this.cookie = false;
        this.cookie_getted = false;
    }

    ngOnInit() {
        this.cookieValue = this.cookieService.get('token');
        if(this.cookieValue==""){
            this.cookie = false;
        }else{
            this.cookie = true;
        };
    }

    SetCookie(token: string){
        this.cookieService.set('token', token);
    }

    GetToken() {
        this.error = false;
        const headers = new HttpHeaders({'Content-Type' : 'application/json', 'Access-Control-Allow-Origin' : '*'});

        const httpGetToken$ = this.http
        .get("/api/token", {headers})
        .pipe(map(data => _.values(data)));

        httpGetToken$.subscribe(
            (val) => this.SetCookie(val[0]))

        this.cookie = true;
        this.cookie_getted = true;
    }

    Search(filter: string) {
        this.cookie_getted = false;
        let headers_content;
        this.error = false;

        this.cookieValue = this.cookieService.get('token');
        if(this.cookieValue==""){
            headers_content = new HttpHeaders({'Content-Type' : 'application/json', 'Access-Control-Allow-Origin' : '*'});
        }else{
            headers_content = new HttpHeaders({'Content-Type' : 'application/json', 'Access-Control-Allow-Origin' : '*', 'token' : this.cookieValue});
        };
        
        const headers = headers_content;
        this.loading = true;
              
        const httpGet$ = this.http
            .get("/api/archives/json/"+filter, {headers})
            .pipe(map(data => _.values(data)));

        httpGet$.subscribe(
            (val) => this.loading = false,
            (error) => {
                if(error.status==409){
                    this.loading = false;
                    this.error = true;
                } 
            }
        );

        this.DATA$ = httpGet$;
    }
    
    checkShowed(source: string) {
        switch(source) {
            case "HAL" : 
                return this.checkHAL;
            case "ARXIV" : 
                return this.checkARXIV;
            default : 
                return false;
        }
    }
}