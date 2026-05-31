import { Component, computed, input } from '@angular/core';
import { UserRole } from '@models/auth.models';

const ROLE_STYLES: Record<UserRole, string> = {
    [UserRole.Member]:  'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
    [UserRole.Admin]:   'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    [UserRole.Analyst]: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    [UserRole.Client]:  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
};

const ROLE_NAMES: Record<UserRole, string> = {
    [UserRole.Member]:  'Member',
    [UserRole.Admin]:   'Admin',
    [UserRole.Analyst]: 'Analyst',
    [UserRole.Client]:  'Client',
};

@Component({
    selector: 'app-role-badge',
    standalone: true,
    template: `
        <span [class]="'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ' + styleClass()">
            {{ displayLabel() }}
        </span>
    `
})
export class RoleBadgeComponent {
    readonly role = input.required<UserRole>();
    readonly label = input<string | undefined>(undefined);

    protected readonly styleClass = computed(() => ROLE_STYLES[this.role()] ?? '');
    protected readonly displayLabel = computed(() => this.label() ?? ROLE_NAMES[this.role()] ?? String(this.role()));
}
