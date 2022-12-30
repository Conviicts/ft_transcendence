import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Socket } from 'ngx-socket-io';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthTokenService } from 'src/app/services/auth/auth.service';
import { NavBarService } from 'src/app/services/user/navbar.service';



@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss']
})
export class TokenComponent implements OnInit {
  
  constructor ( 
	@Inject(Socket) private socket: Socket,
    private router: Router,
    private token: AuthTokenService,
    private jwtHelper: JwtHelperService,
    private navbar: NavBarService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
  ) {}

  tokenStr!: string;
  
  ngOnInit(): void {  
    this.tokenStr  = this.route.snapshot.params['id'];

    try {
      this.jwtHelper.decodeToken(this.tokenStr);
      this.token.saveToken(this.tokenStr);
      this.socket.disconnect();
      this.socket.ioSocket.io.opts.query = 'token=' + this.token.getToken();
      this.socket.connect();
      this.navbar.show();
      this.router.navigate(['/home']);
    } catch(Error) {
      this.snackBar.open("Vous devez vous reconnecter.", 'X', {
        duration: 3000,
      });
      this.router.navigate(['/']);
    }
  }
}
