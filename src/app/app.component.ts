import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { LoggingService } from './logging.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private loggindService: LoggingService
  ) {}

  ngOnInit(): void {
    this.authService.autoLogin();

    // this.loggindService.printLog("Hello I'm in AppComponent");
  }
}
