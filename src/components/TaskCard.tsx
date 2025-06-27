import React, { useState } from 'react';
import { Check, Edit2, Trash2, X } from 'lucide-react';
import { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (taskId: string, updates: { title: string; description?: string }) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');

  const handleEdit = () => {
    if (editTitle.trim()) {
      onEdit(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="zen-task bg-white/90 border-2 border-stone-300/60 slide-up">
        <div className="space-y-2">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            className="zen-input text-sm font-medium"
            placeholder="Task title..."
            autoFocus
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            onKeyDown={handleKeyPress}
            className="zen-input text-xs resize-none"
            placeholder="Description (optional)..."
            rows={2}
          />
          <div className="flex justify-end space-x-1 pt-1">
            <button
              onClick={handleEdit}
              className="zen-button-primary text-xs px-2 py-1"
              disabled={!editTitle.trim()}
            >
              <Check className="w-3 h-3" />
            </button>
            <button
              onClick={handleCancel}
              className="zen-button-ghost text-xs px-2 py-1"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`zen-task group ${task.completed ? 'opacity-60' : ''} fade-in`}>
      <div className="flex items-start space-x-2">
        <button
          onClick={() => onToggle(task.id)}
          className={`flex-shrink-0 w-4 h-4 rounded border-2 mt-0.5 transition-all duration-200 flex items-center justify-center ${
            task.completed
              ? 'bg-stone-600 border-stone-600 text-white'
              : 'border-stone-300 hover:border-stone-400'
          }`}
        >
          {task.completed && <Check className="w-2.5 h-2.5" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className={`font-medium text-sm leading-tight ${
            task.completed ? 'line-through text-stone-500' : 'text-stone-800'
          }`}>
            {task.title}
          </div>
          {task.description && (
            <div className={`text-xs mt-1 leading-relaxed ${
              task.completed ? 'line-through text-stone-400' : 'text-stone-600'
            }`}>
              {task.description}
            </div>
          )}
        </div>

        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 space-x-1">
          <button
            onClick={() => setIsEditing(true)}
            className="text-stone-400 hover:text-stone-600 p-1"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-stone-400 hover:text-red-500 p-1"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};