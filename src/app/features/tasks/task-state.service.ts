import { Injectable, signal, computed } from '@angular/core';
import { Task } from '@models/task.models';

@Injectable({
    providedIn: 'root'
})
export class TaskStateService {
    private _tasks = signal<Task[]>([
        { id: '1', title: 'Setup Angular 21', description: 'Initialize architecture', status: 'done' },
        { id: '2', title: 'Implement Guards', description: 'Add auth and role guards', status: 'done' },
        { id: '3', title: 'Create UI', description: 'Build modern UI with Tailwind', status: 'in-progress' }
    ]);

    tasks = this._tasks.asReadonly();

    todoTasks = computed(() => this._tasks().filter(t => t.status === 'todo'));
    inProgressTasks = computed(() => this._tasks().filter(t => t.status === 'in-progress'));
    doneTasks = computed(() => this._tasks().filter(t => t.status === 'done'));

    addTask(task: Task) {
        this._tasks.update(tasks => [...tasks, task]);
    }

    updateTaskStatus(id: string, status: Task['status']) {
        this._tasks.update(tasks =>
            tasks.map(t => t.id === id ? { ...t, status } : t)
        );
    }
}
