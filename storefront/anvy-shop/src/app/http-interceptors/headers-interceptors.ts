import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HeadersInterceptors implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let reqHeader = req.headers.append('Content-Type', 'application/json');
    reqHeader = reqHeader.set('Cache-Control', 'no-cache');
    reqHeader = reqHeader.set('Authorization', '');

    const defaultHeaderReq = req.clone({
      headers: reqHeader
    });
    return next.handle(defaultHeaderReq);
  }
}
