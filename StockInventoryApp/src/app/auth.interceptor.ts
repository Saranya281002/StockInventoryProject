import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: { clone: (arg0: { setHeaders: { Authorization: string; }; }) => any; }, next: { handle: (arg0: any) => any; }) {
  const token = localStorage.getItem('token');

  const cloned = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next.handle(cloned);
}
}
