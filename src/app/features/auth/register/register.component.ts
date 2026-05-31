import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@core/auth/auth.service';
import { RegisterRequest } from '@models/auth.models';
import { finalize } from 'rxjs';
import { email, form, FormField, required, minLength } from '@angular/forms/signals';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormField, RouterLink],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="min-h-screen flex">

      <!-- Left panel — branding -->
      <div class="hidden lg:flex lg:w-1/2 bg-linear-to-br from-indigo-600 via-blue-600 to-blue-700 flex-col justify-between p-12 relative overflow-hidden">
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
            Empieza gratis.<br />Escala sin límites.
          </h1>
          <p class="text-blue-100 text-lg leading-relaxed">
            Crea tu cuenta en segundos y comienza a organizar tu trabajo hoy.
          </p>

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

        <!-- Stats -->
        <div class="relative z-10 grid grid-cols-3 gap-4">
          @for (stat of stats; track stat.label) {
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <p class="text-white font-bold text-xl">{{ stat.value }}</p>
              <p class="text-blue-200 text-xs mt-0.5">{{ stat.label }}</p>
            </div>
          }
        </div>
      </div>

      <!-- Right panel — form -->
      <div class="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24 bg-white dark:bg-gray-900 overflow-y-auto">
        <!-- Mobile logo -->
        <div class="flex items-center gap-2 mb-8 lg:hidden">
          <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <span class="font-bold text-lg text-gray-900 dark:text-white">TaskFlow</span>
        </div>

        <div class="w-full max-w-sm mx-auto lg:mx-0">
          <div class="mb-8">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Crear cuenta</h2>
            <p class="mt-2 text-gray-500 dark:text-gray-400 text-sm">
              ¿Ya tienes cuenta?
              <a routerLink="/login" class="text-indigo-600 hover:text-indigo-500 font-medium">Inicia sesión</a>
            </p>
          </div>

          <form (submit)="onSubmit($event)" class="space-y-4">

            <!-- Nombre / Apellido -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nombre</label>
                <input
                  [formField]="registerForm.firstName"
                  type="text"
                  placeholder="Daniel"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Apellido</label>
                <input
                  [formField]="registerForm.lastName"
                  type="text"
                  placeholder="Calderón"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <input
                [formField]="registerForm.email"
                type="email"
                placeholder="nombre@ejemplo.com"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <!-- Contraseña -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Contraseña</label>
              <input
                [formField]="registerForm.password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <!-- Submit -->
            <button
              type="submit"
              [disabled]="loading() || registerForm().invalid()"
              class="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              @if (loading()) {
                <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Creando cuenta...
              } @else {
                Crear cuenta
              }
            </button>

            <p class="text-xs text-center text-gray-400 dark:text-gray-500 pt-1">
              Al registrarte aceptas nuestros
              <span class="text-indigo-500 cursor-pointer hover:underline">Términos de servicio</span>
            </p>

          </form>
        </div>
      </div>

    </div>
  `
})
export class RegisterComponent {
    private readonly auth = inject(AuthService);
    private readonly router = inject(Router);
    private readonly toastr = inject(ToastrService);

    readonly loading = signal(false);

    readonly features = [
        'Sin tarjeta de crédito requerida',
        'Acceso inmediato a todos los tableros',
        'Colabora con tu equipo desde el día uno',
    ];

    readonly stats = [
        { value: '10k+', label: 'Usuarios' },
        { value: '50k+', label: 'Tareas' },
        { value: '99.9%', label: 'Uptime' },
    ];

    readonly registerModel = signal<RegisterRequest>({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    readonly registerForm = form(this.registerModel, (schemaPath) => {
        required(schemaPath.firstName, { message: 'El nombre es requerido' });
        required(schemaPath.lastName, { message: 'El apellido es requerido' });
        required(schemaPath.email, { message: 'El email es requerido' });
        email(schemaPath.email, { message: 'Ingresa un email válido' });
        required(schemaPath.password, { message: 'La contraseña es requerida' });
        minLength(schemaPath.password, 6, { message: 'Mínimo 6 caracteres' });
    });

    onSubmit(event: Event) {
        event.preventDefault();

        if (this.registerForm().invalid()) return;

        this.loading.set(true);

        this.auth.register(this.registerModel()).pipe(
            finalize(() => this.loading.set(false))
        ).subscribe({
            next: () => this.router.navigate(['/boards']),
            error: (err: any) => {
                const apiErrors: string[] = err.error?.errors ?? [];
                const msg = apiErrors.length ? apiErrors.join(' · ') : (err.error?.message ?? 'Error al registrarse');
                this.toastr.error(msg, 'No se pudo crear la cuenta');
            }
        });
    }
}
