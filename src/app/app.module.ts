import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from "@angular/material/button";
import {SpeedTestModule} from "ng-speed-test";
import {AgmCoreModule} from "@agm/core";
import { LoginModalComponent } from './components/login-modal/login-modal.component';
import {MatDialogModule} from "@angular/material/dialog";
import { AlertComponent } from './components/elements/alert/alert.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {HttpClientModule} from "@angular/common/http";
import { RegisterModalComponent } from './components/register-modal/register-modal.component';
import { SettingsModalComponent } from './components/settings-modal/settings-modal.component';
import {MatTableModule} from "@angular/material/table";
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    LoginModalComponent,
    AlertComponent,
    RegisterModalComponent,
    SettingsModalComponent
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatButtonModule,
        SpeedTestModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyDANiqm84isxdpf4IpHLu8jTA51wYiwQgQ'
        }),
        MatDialogModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        HttpClientModule,
        MatTableModule,
        NgChartsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
