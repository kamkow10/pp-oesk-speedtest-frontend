import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AbstractControl, FormBuilder, Validators} from "@angular/forms";
import {RestService} from "../../services/rest.service";

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {
  public loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    },
    {
      updateOn: 'submit'
    }
  );

  public showMessageServerError = false;
  public showMessageBadEmailOrPassword = false;
  public submitted = false;

  constructor(private matDialog: MatDialog,
              private fb: FormBuilder,
              private restService: RestService) {
  }

  ngOnInit(): void {
  }

  public login(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.clearMessages();
    this.restService.login(this.email?.value, this.password?.value).subscribe((userData) => {
      localStorage.setItem('userId', userData.id);
      localStorage.setItem('userEmail', userData.userMail);
      window.location.reload();
      this.matDialog.closeAll();
    }, (error) => {
      if (error.status == 401) {
        this.showMessageBadEmailOrPassword = true;
      } else {
        this.showMessageServerError = true;
      }
    });
  }

  private clearMessages(): void {
    this.showMessageBadEmailOrPassword = false;
    this.showMessageServerError = false;
  }

  get email(): AbstractControl | null {
    return this.loginForm.get('email');
  }

  get password(): AbstractControl | null {
    return this.loginForm.get('password');
  }
}
