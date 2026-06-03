import { Pipe, PipeTransform } from '@angular/core';
import { ProjectStatus } from '@models/project.models';
import { PROJECT_STATUS_LABELS } from '@shared/utils/constants';

@Pipe({
    name: 'projectStatus',
    standalone: true
})
export class ProjectStatusPipe implements PipeTransform {
    transform(value: ProjectStatus): string {
        return PROJECT_STATUS_LABELS[value] || value;
    }
}
