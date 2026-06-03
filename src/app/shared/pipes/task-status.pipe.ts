import { Pipe, PipeTransform } from '@angular/core';
import { TaskItemStatus } from '@models/task.models';
import { TASK_STATUS_LABELS } from '@shared/utils/constants';

@Pipe({
    name: 'taskStatus',
    standalone: true
})
export class TaskStatusPipe implements PipeTransform {
    transform(value: TaskItemStatus): string {
        return TASK_STATUS_LABELS[value] || value;
    }
}
