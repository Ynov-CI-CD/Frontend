import {Component, inject} from '@angular/core';
import {UsersCreationFormComponent} from "../../components/users-creation-form/users-creation-form.component";
import {Router, RouterLink} from '@angular/router';
import {NgIf} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UsersService} from '../../services/users.service';
import {LoginDto} from '../../models/login.dto';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    UsersCreationFormComponent,
    RouterLink,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  loginForm!: FormGroup;
  submitted = false;
  errorMessage: string | null = '';
  successMessage: string | null = '';

  /**
   * Initializes the component by creating the user login form with validation rules.
   */
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  /**
   * Handles the form submission by logging a user and redirecting to the homepage.
   */
  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.loginForm.valid) {
      const loginDto: LoginDto = this.loginForm.value;
      this.authService.signIn(loginDto).subscribe({
        next: () => {
          this.successMessage = 'Login successful!';
          this.errorMessage = null;
          this.loginForm.reset();
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Login failed. Please try again.';
          this.successMessage = null;
        }
      });
    }
  }
}
