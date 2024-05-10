import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule, routingComponent } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './Plantillas/footer/footer.component';
import { HeaderComponent } from './Plantillas/header/header.component';
import { SidebarComponent } from './Plantillas/sidebar/sidebar.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './Control/jwt-interceptor.interceptor';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    routingComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    CarouselModule.forRoot(),
    NgApexchartsModule,
    NgbModule,
    
  ],
  exports: [    
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },

    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


