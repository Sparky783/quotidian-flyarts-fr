import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { fakeBackendInterceptor } from './_helpers/fake-backend.interceptor';
import { jwtInterceptor } from './_helpers/jwt.interceptor';
import { errorInterceptor } from './_helpers/error.interceptor';
import { AccountService } from './_services/account.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        jwtInterceptor,
        errorInterceptor,
        //fakeBackendInterceptor // Enable it just for test
      ])
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [AccountService],
      multi: true,
    }
  ]
};

export function initApp(accountService: AccountService): () => void {
  return () => accountService.autoLogin();
}