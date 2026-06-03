import { Pipe, PipeTransform } from '@angular/core';
import { TaskPriority } from '@models/task.models';
import { TASK_PRIORITY_LABELS } from '@shared/utils/constants';

@Pipe({
    name: 'taskPriority',
    standalone: true
})
export class TaskPriorityPipe implements PipeTransform {
    transform(value: TaskPriority): string {
        return TASK_PRIORITY_LABELS[value] || value;
    }
}
