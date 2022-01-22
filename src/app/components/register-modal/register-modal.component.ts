import { Component, OnInit } from '@angular/core';
import {RestService} from "../../services/rest.service";
import {AbstractControl, FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.scss']
})
export class RegisterModalComponent implements OnInit {
  public registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    },
    {
      updateOn: 'submit'
    }
  );

  public showMessageServerError = false;
  public showMessageEmailInUse = false;
  public showMessageRegisterSucceed = false;
  public submitted = false;

  constructor(private restService: RestService,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
  }

  public register(): void {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    this.clearMessages()
    this.restService.register(this.email?.value, this.password?.value).subscribe(response => {
      if (response.message == 'Provided mail is already used by other user') {
        this.showMessageEmailInUse = true;
      } else {
        this.submitted = false;
        this.showMessageRegisterSucceed = true;
      }
    }, (error) => {
      this.showMessageServerError = true;
      console.log(error);
    });
  }

  private clearMessages(): void {
    this.showMessageEmailInUse = false;
    this.showMessageServerError = false;
    this.showMessageRegisterSucceed = false;
  }

  get email(): AbstractControl | null {
    return this.registerForm.get('email');
  }

  get password(): AbstractControl | null {
    return this.registerForm.get('password');
  }
}
