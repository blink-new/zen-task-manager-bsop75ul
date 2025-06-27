import React from 'react';
import { Task } from '../types/task';
import { TaskCard } from './TaskCard';
import { AddTaskForm } from './AddTaskForm';
import { useDroppable } from '@dnd-kit/core';

interface TaskColumnProps {
  id: string;
  title: string;
  subtitle?: string;
  tasks: Task[];
  onAddTask: (title: string, description?: string) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (taskId: string, updates: { title: string; description?: string }) => void;
  placeholder?: string;
  isWeekly?: boolean;
}

export const TaskColumn: React.FC<TaskColumnProps> = ({
  id,
  title,
  subtitle,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  placeholder,
  isWeekly = false,
}) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  return (
    <div ref={setNodeRef} className={`zen-column ${isWeekly ? 'bg-gradient-to-br from-stone-50/90 to-stone-100/50' : ''}`}>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className={`font-medium ${isWeekly ? 'text-lg text-stone-800' : 'text-base text-stone-700'}`}>
            {title}
          </h3>
          {totalCount > 0 && (
            <span className="text-xs text-stone-500 bg-stone-100/80 px-2 py-1 rounded-full">
              {completedCount}/{totalCount}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-stone-500 font-jp">{subtitle}</p>
        )}
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={onToggleTask}
            onDelete={onDeleteTask}
            onEdit={onEditTask}
          />
        ))}
        
        {tasks.length === 0 && (
          <div className="text-center py-8 text-stone-400">
            <div className="text-sm mb-2">No tasks yet</div>
            <div className="text-xs font-jp">静寂</div>
          </div>
        )}
      </div>

      <div className="mt-4">
        <AddTaskForm onAdd={onAddTask} placeholder={placeholder} />
      </div>
    </div>
  );
};