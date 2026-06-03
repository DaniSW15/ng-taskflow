import { Pipe, PipeTransform } from '@angular/core';
import { UserRole } from '@models/auth.models';
import { USER_ROLE_LABELS } from '@shared/utils/constants';

@Pipe({
    name: 'userRole',
    standalone: true
})
export class UserRolePipe implements PipeTransform {
    transform(value: UserRole): string {
        return USER_ROLE_LABELS[value] || value.toString();
    }
}
