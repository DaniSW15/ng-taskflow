import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
    template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">

      <!-- Navbar -->
      <header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">

            <!-- Left: Logo + Nav -->
            <div class="flex items-center gap-8">
              <a routerLink="/dashboard" class="flex items-center gap-2.5 shrink-0">
                <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <svg class="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span class="font-bold text-gray-900 dark:text-white text-lg tracking-tight">TaskFlow</span>
              </a>

              <nav class="hidden md:flex items-center gap-1">
                <a
                  routerLink="/dashboard"
                  routerLinkActive="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                  [routerLinkActiveOptions]="{ exact: true }"
                  class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Inicio
                </a>
                <a
                  routerLink="/boards"
                  routerLinkActive="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                  class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                  Tableros
                </a>
                @if (authService.isAdmin()) {
                  <a
                    routerLink="/admin"
                    routerLinkActive="bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300"
                    class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Admin
                  </a>
                }
              </nav>
            </div>

            <!-- Right: User menu -->
            <div class="flex items-center gap-3">

              <!-- Avatar + name -->
              <div class="hidden sm:flex items-center gap-3">
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900 dark:text-white leading-tight">
                    {{ authService.user()?.firstName }} {{ authService.user()?.lastName }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ authService.user()?.email }}</p>
                </div>
                <div class="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {{ (authService.user()?.firstName ?? 'U')[0] | uppercase }}
                </div>
              </div>

              <!-- Divider -->
              <div class="hidden sm:block w-px h-6 bg-gray-200 dark:bg-gray-700"></div>

              <!-- Logout -->
              <button
                (click)="onLogout()"
                class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span class="hidden sm:block">Salir</span>
              </button>

            </div>
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="flex-1">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <router-outlet></router-outlet>
        </div>
      </main>

    </div>
  `
})
export class MainLayoutComponent {
    readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    onLogout() {
        this.authService.logout().subscribe();
    }
}

