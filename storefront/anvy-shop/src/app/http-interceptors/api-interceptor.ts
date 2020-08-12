import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const urlReg = /^\/(\w|-|\/)*/;

    if (urlReg.test(req.url)) {
      // @ts-ignore
      const apiAddress = API_URL || '';
      const fullUrlReq = req.clone({
        url: `${apiAddress}${req.url}`
      });

      return next.handle(fullUrlReq);
    }

    return next.handle(req);
  }
}
