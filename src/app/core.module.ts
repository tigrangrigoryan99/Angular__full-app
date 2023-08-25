import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { ShoppingService } from './shopping-list/shopping.service';
// import { LoggingService } from './logging.service';

@NgModule({
  providers: [
    ShoppingService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    // LoggingService
  ],
})
export class CoreModule {}
