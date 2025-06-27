import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface AddTaskFormProps {
  onAdd: (title: string, description?: string) => void;
  placeholder?: string;
}

export const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAdd, placeholder = "Add a task..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), description.trim() || undefined);
      setTitle('');
      setDescription('');
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setIsOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full zen-button-ghost justify-start text-stone-500 hover:text-stone-700 border-2 border-dashed border-stone-200 hover:border-stone-300 py-3 rounded-lg transition-all duration-200"
      >
        <Plus className="w-4 h-4 mr-2" />
        {placeholder}
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 slide-up">
      <div className="zen-card p-3 border-2 border-stone-300/60">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyPress}
          className="zen-input text-sm font-medium mb-2"
          placeholder="Task title..."
          autoFocus
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={handleKeyPress}
          className="zen-input text-xs resize-none"
          placeholder="Description (optional)..."
          rows={2}
        />
        <div className="flex justify-end space-x-2 mt-3">
          <button
            type="button"
            onClick={handleCancel}
            className="zen-button-ghost text-xs px-3 py-1.5"
          >
            <X className="w-3 h-3 mr-1" />
            Cancel
          </button>
          <button
            type="submit"
            className="zen-button-primary text-xs px-3 py-1.5"
            disabled={!title.trim()}
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Task
          </button>
        </div>
      </div>
    </form>
  );
};