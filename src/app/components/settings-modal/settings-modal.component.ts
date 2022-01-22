import {Component, OnInit} from '@angular/core';
import {RestService} from "../../services/rest.service";
import {AbstractControl, FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss']
})
export class SettingsModalComponent implements OnInit {

  constructor(private fb: FormBuilder,
              private restService: RestService) {
  }

  ngOnInit(): void {
  }

  // Email form -----------------------------------------------------

  public changeEmailForm = this.fb.group({
    newEmail: ['', [Validators.required, Validators.email]]
  }, {
    updateOn: 'submit'
  });
  public changeEmailFormSubmitted = false;
  public changeEmailFormSucceed = false;
  public changeEmailFormEmailInUse = false;
  public changeEmailFormServerError = false;

  public changeEmail(): void {
    this.changeEmailFormSubmitted = true;
    this.changeEmailFormSucceed = false;
    this.changeEmailFormEmailInUse = false;
    this.changeEmailFormServerError = false;
    if (this.changeEmailForm.invalid) {
      return;
    }
    this.restService.changeEmail(this.newEmail?.value).subscribe((response) => {
      if (response.message == 'Provided mail is already used by other user') {
        this.changeEmailFormEmailInUse = true;
      } else {
        this.changeEmailFormSubmitted = false;
        this.changeEmailFormSucceed = true;
        this.restService.userEmail = this.newEmail?.value;
      }
    }, () => {
      this.changeEmailFormServerError = true;
    });
  }

  get newEmail(): AbstractControl | null {
    return this.changeEmailForm.get('newEmail');
  }

  // Password form -----------------------------------------------------

  public changePasswordForm = this.fb.group({
    oldPassword: ['', Validators.required],
    newPassword: ['', Validators.required]
  }, {
    updateOn: 'submit'
  });
  public changePasswordFormSubmitted = false;
  public changePasswordFormSucceed = false;
  public changePasswordFormWrongOldPassword = false;
  public changePasswordFormServerError = false;

  public changePassword(): void {
    this.changePasswordFormSubmitted = true;
    this.changePasswordFormSucceed = false;
    this.changePasswordFormWrongOldPassword = false;
    this.changePasswordFormServerError = false;
    if (this.changePasswordForm.invalid) {
      return;
    }
    this.restService.changePassword(this.oldPassword?.value, this.newPassword?.value).subscribe((response) => {
      if (response.message == 'Provided old password is wrong!') {
        this.changePasswordFormWrongOldPassword = true;
      } else {
        this.changePasswordFormSubmitted = false;
        this.changePasswordFormSucceed = true;
      }
    }, () => {
      this.changePasswordFormServerError = true;
    });
  }

  get newPassword(): AbstractControl | null {
    return this.changePasswordForm.get('newPassword');
  }

  get oldPassword(): AbstractControl | null {
    return this.changePasswordForm.get('oldPassword');
  }


}
