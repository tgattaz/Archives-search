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

    HAL$:  Observable<any>;

    ARXIV$:  Observable<any>;

    checkHAL: Boolean;

    checkARXIV: Boolean;
    

    constructor(private http: HttpClient) {
        this.checkHAL=true;
        this.checkARXIV=true;
    }

    ngOnInit() {}


    SearchHAL(filter: string) {


        const headers = new HttpHeaders({'Content-Type' : 'application/json', 'Access-Control-Allow-Origin' : '*'});

        const httpGet$ = this.http
            .get("/hal/?q="+filter+"&wt=json&fl=*", {headers})
            .pipe(map(data => _.values(data)));

        httpGet$.subscribe(
            (val) => console.log(val)
        );

        this.HAL$ = httpGet$;
        //this.ARXIV$ = null;

    }

    ParseString(data: string){
        var result: any;
        parser.Parser().parseString(data, (e, r) => {result = r});
        return result;  
    }


    SearchARXIV(filter: string) {

        const my_headers = new HttpHeaders({ 'Content-Type': 'application/xml' }).set('Accept', 'application/xml');
        
        const options: {
            headers?: HttpHeaders,
            observe?: 'body',
            params?: HttpParams,
            reportProgress?: boolean,
            responseType: 'text',
            withCredentials?: boolean
        } = {
            headers: my_headers,
            responseType: 'text'
        };

        const httpGet$ = this.http
            .get("/arxiv/query?search_query="+filter,options)
            .pipe(map(data => _.values(this.ParseString(data))));

        httpGet$.subscribe(
            (val) => console.log(val)
        );

        this.ARXIV$ = httpGet$;
        //this.HAL$ = null;

        

        //this.result$ = httpGet$;

    }

}
