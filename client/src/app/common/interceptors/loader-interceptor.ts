import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

declare let NProgress: any;

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor() {
    NProgress.configure({
      showSpinner: false
    });
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    LoaderInterceptor.start();
    return next.handle(req).do(event => {
      LoaderInterceptor.stop();
    }).catch((error, caught) => {
      LoaderInterceptor.stop();
      return Observable.throw(error);
    })
  }

  // containsAllowedUrl(url) {
  //   return url !== '/api/user/all';
  // }

  static start() {
    try {
      NProgress.done();
      NProgress.start();
    } catch (err) {
      console.error('start error: ', err);
    }
  }

  static stop() {
    try {
      NProgress.done();
    } catch (error) {
      console.error('stop error: ', error);
    }
  }
}
