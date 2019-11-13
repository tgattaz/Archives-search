import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import * as parser from 'xml2js';
import { map } from 'rxjs/operators';

@Component({
    selector: 'as-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    DATA$:  Observable<any>;

    checkHAL: Boolean;
    checkARXIV: Boolean;
    
    constructor(private http: HttpClient) {
        this.checkHAL=true;
        this.checkARXIV=true;
    }

    ngOnInit() {}

    Search(filter: string) {
        const headers = new HttpHeaders({'Content-Type' : 'application/json', 'Access-Control-Allow-Origin' : '*'});

        const httpGet$ = this.http
            .get("/api/archives/"+filter, {headers})
            .pipe(map(data => _.values(data)));

        httpGet$.subscribe(
            (val) => console.log(val)
        );

        this.DATA$ = httpGet$;
    }
    
}