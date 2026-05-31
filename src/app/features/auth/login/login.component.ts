import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@core/auth/auth.service';
import { LoginRequest } from '@models/auth.models';
import { finalize } from 'rxjs';
import { email, form, FormField, required } from '@angular/forms/signals';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormField, RouterLink],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="min-h-screen flex">

      <!-- Left panel — branding -->
      <div class="hidden lg:flex lg:w-1/2 bg-linear-to-br from-indigo-600 via-blue-600 to-blue-700 flex-col justify-between p-12 relative overflow-hidden">
        <!-- Background decoration -->
        <div class="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div class="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <!-- Logo -->
        <div class="relative z-10">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span class="text-white font-bold text-xl tracking-tight">TaskFlow</span>
          </div>
        </div>

        <!-- Headline -->
        <div class="relative z-10">
          <h1 class="text-4xl font-bold text-white leading-tight mb-4">
            Organiza tu trabajo,<br />alcanza tus metas.
          </h1>
          <p class="text-blue-100 text-lg leading-relaxed">
            Gestiona tableros, tareas y equipos desde un solo lugar.
          </p>

          <!-- Feature list -->
          <ul class="mt-8 space-y-3">
            @for (feat of features; track feat) {
              <li class="flex items-center gap-3 text-blue-100">
                <div class="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span class="text-sm">{{ feat }}</span>
              </li>
            }
          </ul>
        </div>

        <!-- Testimonial -->
        <div class="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-5">
          <p class="text-white/90 text-sm italic leading-relaxed">
            &ldquo;TaskFlow transformó la manera en que nuestro equipo colabora. Ahora todo está en un solo lugar.&rdquo;
          </p>
          <div class="mt-3 flex items-center gap-2">
            <div class="w-7 h-7 rounded-full bg-white/30 flex items-center justify-center text-xs font-bold text-white">A</div>
            <span class="text-white/80 text-xs font-medium">Ana López · Analista de proyectos</span>
          </div>
        </div>
      </div>

      <!-- Right panel — form -->
      <div class="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24 bg-white dark:bg-gray-900">
        <!-- Mobile logo -->
        <div class="flex items-center gap-2 mb-10 lg:hidden">
          <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <span class="font-bold text-lg text-gray-900 dark:text-white">TaskFlow</span>
        </div>

        <div class="w-full max-w-sm mx-auto lg:mx-0">
          <div class="mb-8">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Bienvenido de vuelta</h2>
            <p class="mt-2 text-gray-500 dark:text-gray-400 text-sm">
              ¿No tienes cuenta?
              <a routerLink="/register" class="text-indigo-600 hover:text-indigo-500 font-medium">Regístrate gratis</a>
            </p>
          </div>

          <form (submit)="onSubmit($event)" class="space-y-5">

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <input
                [formField]="loginForm.email"
                type="email"
                placeholder="nombre@ejemplo.com"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Contraseña</label>
              <input
                [formField]="loginForm.password"
                type="password"
                placeholder="Tu contraseña"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <!-- Submit -->
            <button
              type="submit"
              [disabled]="loading() || loginForm().invalid()"
              class="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              @if (loading()) {
                <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Entrando...
              } @else {
                Iniciar sesión
              }
            </button>

          </form>
        </div>
      </div>

    </div>
  `
})
export class LoginComponent {
    private readonly auth = inject(AuthService);
    private readonly router = inject(Router);
    private readonly toastr = inject(ToastrService);

    readonly loading = signal(false);

    readonly features = [
        'Tableros Kanban en tiempo real',
        'Gestión de tareas con prioridades',
        'Colaboración por roles y equipos',
    ];

    readonly loginModel = signal<LoginRequest>({
        email: '',
        password: ''
    });

    readonly loginForm = form(this.loginModel, (schemaPath) => {
        required(schemaPath.email, { message: 'El email es requerido' });
        email(schemaPath.email, { message: 'Ingresa un email válido' });
        required(schemaPath.password, { message: 'La contraseña es requerida' });
    });

    onSubmit(event: Event) {
        event.preventDefault();

        if (this.loginForm().invalid()) return;

        this.loading.set(true);

        this.auth.login(this.loginModel()).pipe(
            finalize(() => this.loading.set(false))
        ).subscribe({
            next: () => this.router.navigate(['/dashboard']),
            error: (err: any) => {
                this.toastr.error(err.error?.message ?? 'Error al iniciar sesión', 'Acceso denegado');
            }
        });
    }
}
