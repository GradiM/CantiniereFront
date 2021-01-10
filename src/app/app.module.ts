import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';

import { TemplateComponent } from './components/template/template.component';
import { MealsOfMenuComponent } from './pages/meals-of-menu/meals-of-menu.component';
import { LoginComponent } from './pages/authentication/login/login.component';
import { RegisterComponent } from './pages/authentication/register/register.component';
import { ForgotComponent } from './pages/authentication/forgot/forgot.component';
import { LogoutComponent } from './pages/authentication/logout/logout.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FooterComponent } from './components/footer/footer.component';

import { OrderService } from './shared/services/order.service';

import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './shared/auth/auth.service';
export function tokenGetter(): string {
  let token = localStorage.getItem('jwt');
  if (token) {
    token = token.replace('Bearer ', '');
  }
  return token;
}

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { PictureDialogComponent } from './components/picture-dialog/picture-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    TemplateComponent,
    MealsOfMenuComponent,
    LoginComponent,
    RegisterComponent,
    ForgotComponent,
    LogoutComponent,
    ProfileComponent,
    NavBarComponent,
    FooterComponent,
    PictureDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: ['localhost:8080'],
        disallowedRoutes: []
      }
    }),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  providers: [
    AuthService,
    OrderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
