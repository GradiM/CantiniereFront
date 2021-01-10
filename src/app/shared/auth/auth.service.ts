import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map, retry, catchError } from 'rxjs/operators';
import { API_URL } from '../constants/api-url';
import { handleError } from '../constants/handle-http-errors';
import { User /*UserOUT*/ } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private jwtHelper: JwtHelperService,
    private router: Router,
    private http: HttpClient
  ) {}

  login(credentials: any): any {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = {
      headers,
      observe: 'response' as 'body' // Pour récupérer toute la réponse du server et non uniquement le body
    };

    return this.http.post<any>(`${API_URL}/login`, credentials, options).pipe(
      map((results) => {
        retry(3), catchError(handleError);
        localStorage.setItem('jwt', results.headers.get('Authorization'));
        return results;
      })
    );
  }

  canActivate(): boolean {
    // On récupère le token
    const token = localStorage.getItem('jwt');
    // S'il existe est n'est pas expiré la méthode return true
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }
    // Donc si la méthode elle n'a pas return true on continue et on redirige vers la page d'accueil
    // Et cette fois on return false
    this.router.navigate(['/']);
    return false;
  }

  public logOut(): void {
    // Dès que le user perd son token il n'a plus acces à certaines pages du site
    // donc il est déconnecté en gros
    localStorage.removeItem('jwt');
    localStorage.removeItem('userChangedValues');
    // et on redirige vers la page d'accueil
    this.router.navigate(['/']);
 }

  isUserAuthenticated(): boolean {
    // On récuprère le Token
    const token: string = localStorage.getItem('jwt');
    // S'il existe et qu'il n'est pas expiré en return true sinon on return false
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }
    else {
      return false;
    }
  }

  public userLogged(): User /*UserOUT*/ {
    const token = this.tokenDecoded();
    const user = token.user;
    return user;
  }

  public userLoggedRoles(): string[] {
    return this.tokenDecoded().roles;
  }

  public tokenGetter(): string {
    return localStorage.getItem('jwt');
  }

  private tokenDecoded(): any {
    const token = this.tokenGetter();
    if (token) {
      const decodedToken = atob(token.split('.')[1]);
      const decodedTokenJsonFormat = JSON.parse(decodedToken);
      return decodedTokenJsonFormat;
    } else {
      return false;
    }
  }

  public tokenExpiration(): Date {
    return this.tokenDecoded().exp;
  }
}
