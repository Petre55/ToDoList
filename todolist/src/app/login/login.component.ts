import { Component, inject } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http'
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    RouterLink, ReactiveFormsModule,HttpClientModule
  ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  fb=inject(FormBuilder);
  http=inject(HttpClient);
  authService=inject(AuthService)
  router=inject(Router);
form=this.fb.nonNullable.group({
  email:['',Validators.required],
  password:['',Validators.required],
});

errorMessage:string|null=null

onSubmit() {
 const rawForm=this.form.getRawValue()
 this.authService
 .login(rawForm.email,rawForm.password)
 .subscribe({next:()=>{
  this.router.navigateByUrl('/main')
 },
 error:(err)=> {
   this.errorMessage=err.code
 }
})
}
}
