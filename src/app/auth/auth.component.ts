import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnDestroy {
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;

  isLoginMode = true;
  loading = false;
  error: string = null;

  authObservable: Observable<AuthResponseData>;

  closeDirecSub: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnDestroy(): void {
    this.closeDirecSub?.unsubscribe();
  }

  onSwitch() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(authForm: NgForm) {
    if (!authForm.valid) {
      return;
    }

    const email = authForm.value.email;
    const password = authForm.value.password;
    this.loading = true;
    if (this.isLoginMode) {
      this.authObservable = this.authService.login(email, password);
    } else {
      this.authObservable = this.authService.signUp(email, password);
    }

    this.authObservable.subscribe(
      (value) => {
        this.loading = false;
        this.router.navigate(['/recipes']);
        console.log(value, 'value');
      },
      (errorMessage) => {
        this.error = errorMessage;
        this.showErrorAlert(errorMessage);
        this.loading = false;
      }
    );
    authForm.reset();
  }

  public onCloseAlert() {
    this.error = null;
  }

  private showErrorAlert(error: string) {
    // const alertCom = new AlertComponent();

    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const viewContainerRef = this.alertHost.containerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    componentRef.instance.message = error;
    this.closeDirecSub = componentRef.instance.close.subscribe(() => {
      this.closeDirecSub.unsubscribe();
      viewContainerRef.clear();
    });
  }
}
