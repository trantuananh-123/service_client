import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { ShareModule } from './share/share.module';
import { HttpClientModule } from '@angular/common/http';
import { authProvider } from './helpers/auth-interceptor';
import { ToastrModule } from 'ngx-toastr';
import { AuthGuardService } from './services/auth-guard.service';
import { DatePipe } from '@angular/common';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ShareModule,
        ToastrModule.forRoot({
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-right-center',
        }),
    ],
    providers: [authProvider, AuthGuardService, DatePipe],
    bootstrap: [AppComponent]
})
export class AppModule { }
