import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-forbidden',
    standalone: true,
    imports: [RouterLink],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div class="text-center">
        <h1 class="text-6xl font-bold text-red-500">403</h1>
        <p class="mt-4 text-xl text-gray-700 dark:text-gray-300">Acceso denegado</p>
        <p class="mt-2 text-gray-500 dark:text-gray-400">No tienes permisos para ver esta página.</p>
        <a routerLink="/boards" class="mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Volver al inicio
        </a>
      </div>
    </div>
  `
})
export class ForbiddenComponent { }
