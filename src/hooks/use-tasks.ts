import { useState, useEffect, useCallback } from 'react';
import { Task, WeeklyTask, DailyTask, TaskStore, WeekDay, WEEK_DAYS } from '../types/task';

const STORAGE_KEY = 'zen-task-manager-data';

const createEmptyStore = (): TaskStore => ({
  weeklyTasks: [],
  dailyTasks: WEEK_DAYS.reduce(
    (acc, day) => ({ ...acc, [day]: [] }),
    {} as Record<WeekDay, DailyTask[]>
  ),
});

const generateId = () => `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const useTasks = () => {
  const [store, setStore] = useState<TaskStore>(createEmptyStore);

  // Load tasks from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert date strings back to Date objects
        const transformedStore: TaskStore = {
          weeklyTasks: parsed.weeklyTasks.map((task: WeeklyTask & { createdAt: string; updatedAt: string }) => ({
            ...task,
            createdAt: new Date(task.createdAt),
            updatedAt: new Date(task.updatedAt),
          })),
          dailyTasks: Object.keys(parsed.dailyTasks).reduce(
            (acc, day) => ({
              ...acc,
              [day]: parsed.dailyTasks[day].map((task: DailyTask & { createdAt: string; updatedAt: string }) => ({
                ...task,
                createdAt: new Date(task.createdAt),
                updatedAt: new Date(task.updatedAt),
              })),
            }),
            {} as Record<WeekDay, DailyTask[]>
          ),
        };
        setStore(transformedStore);
      }
    } catch (error) {
      console.error('Failed to load tasks from localStorage:', error);
    }
  }, []);

  // Save tasks to localStorage whenever store changes
  const saveToStorage = useCallback((newStore: TaskStore) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStore));
    } catch (error) {
      console.error('Failed to save tasks to localStorage:', error);
    }
  }, []);

  // Add a weekly task
  const addWeeklyTask = useCallback((title: string, description?: string) => {
    const newTask: WeeklyTask = {
      id: generateId(),
      title,
      description,
      completed: false,
      type: 'weekly',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setStore(prev => {
      const newStore = {
        ...prev,
        weeklyTasks: [...prev.weeklyTasks, newTask],
      };
      saveToStorage(newStore);
      return newStore;
    });

    return newTask;
  }, [saveToStorage]);

  // Add a daily task
  const addDailyTask = useCallback((day: WeekDay, title: string, description?: string) => {
    const newTask: DailyTask = {
      id: generateId(),
      title,
      description,
      completed: false,
      type: 'daily',
      day,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setStore(prev => {
      const newStore = {
        ...prev,
        dailyTasks: {
          ...prev.dailyTasks,
          [day]: [...prev.dailyTasks[day], newTask],
        },
      };
      saveToStorage(newStore);
      return newStore;
    });

    return newTask;
  }, [saveToStorage]);

  // Toggle task completion
  const toggleTask = useCallback((taskId: string) => {
    setStore(prev => {
      const newStore = { ...prev };
      
      // Check weekly tasks
      const weeklyIndex = newStore.weeklyTasks.findIndex(task => task.id === taskId);
      if (weeklyIndex >= 0) {
        newStore.weeklyTasks = [...newStore.weeklyTasks];
        newStore.weeklyTasks[weeklyIndex] = {
          ...newStore.weeklyTasks[weeklyIndex],
          completed: !newStore.weeklyTasks[weeklyIndex].completed,
          updatedAt: new Date(),
        };
      } else {
        // Check daily tasks
        for (const day of WEEK_DAYS) {
          const dailyIndex = newStore.dailyTasks[day].findIndex(task => task.id === taskId);
          if (dailyIndex >= 0) {
            newStore.dailyTasks = {
              ...newStore.dailyTasks,
              [day]: [...newStore.dailyTasks[day]],
            };
            newStore.dailyTasks[day][dailyIndex] = {
              ...newStore.dailyTasks[day][dailyIndex],
              completed: !newStore.dailyTasks[day][dailyIndex].completed,
              updatedAt: new Date(),
            };
            break;
          }
        }
      }
      
      saveToStorage(newStore);
      return newStore;
    });
  }, [saveToStorage]);

  // Delete task
  const deleteTask = useCallback((taskId: string) => {
    setStore(prev => {
      const newStore = { ...prev };
      
      // Check weekly tasks
      const weeklyIndex = newStore.weeklyTasks.findIndex(task => task.id === taskId);
      if (weeklyIndex >= 0) {
        newStore.weeklyTasks = newStore.weeklyTasks.filter(task => task.id !== taskId);
      } else {
        // Check daily tasks
        for (const day of WEEK_DAYS) {
          const dailyIndex = newStore.dailyTasks[day].findIndex(task => task.id === taskId);
          if (dailyIndex >= 0) {
            newStore.dailyTasks = {
              ...newStore.dailyTasks,
              [day]: newStore.dailyTasks[day].filter(task => task.id !== taskId),
            };
            break;
          }
        }
      }
      
      saveToStorage(newStore);
      return newStore;
    });
  }, [saveToStorage]);

  // Edit task
  const editTask = useCallback((taskId: string, updates: Partial<Pick<Task, 'title' | 'description'>>) => {
    setStore(prev => {
      const newStore = { ...prev };
      
      // Check weekly tasks
      const weeklyIndex = newStore.weeklyTasks.findIndex(task => task.id === taskId);
      if (weeklyIndex >= 0) {
        newStore.weeklyTasks = [...newStore.weeklyTasks];
        newStore.weeklyTasks[weeklyIndex] = {
          ...newStore.weeklyTasks[weeklyIndex],
          ...updates,
          updatedAt: new Date(),
        };
      } else {
        // Check daily tasks
        for (const day of WEEK_DAYS) {
          const dailyIndex = newStore.dailyTasks[day].findIndex(task => task.id === taskId);
          if (dailyIndex >= 0) {
            newStore.dailyTasks = {
              ...newStore.dailyTasks,
              [day]: [...newStore.dailyTasks[day]],
            };
            newStore.dailyTasks[day][dailyIndex] = {
              ...newStore.dailyTasks[day][dailyIndex],
              ...updates,
              updatedAt: new Date(),
            };
            break;
          }
        }
      }
      
      saveToStorage(newStore);
      return newStore;
    });
  }, [saveToStorage]);

  // Move task
  const moveTask = useCallback((taskId: string, newDay: WeekDay | 'weekly') => {
    setStore(prev => {
      const newStore = { ...prev };
      let taskToMove: Task | undefined;
      let originalDay: WeekDay | 'weekly' | undefined;

      // Find and remove the task from its original location
      const weeklyIndex = newStore.weeklyTasks.findIndex(task => task.id === taskId);
      if (weeklyIndex >= 0) {
        taskToMove = newStore.weeklyTasks[weeklyIndex];
        newStore.weeklyTasks = newStore.weeklyTasks.filter(task => task.id !== taskId);
        originalDay = 'weekly';
      } else {
        for (const day of WEEK_DAYS) {
          const dailyIndex = newStore.dailyTasks[day].findIndex(task => task.id === taskId);
          if (dailyIndex >= 0) {
            taskToMove = newStore.dailyTasks[day][dailyIndex];
            newStore.dailyTasks = {
              ...newStore.dailyTasks,
              [day]: newStore.dailyTasks[day].filter(task => task.id !== taskId),
            };
            originalDay = day;
            break;
          }
        }
      }

      if (!taskToMove || originalDay === newDay) {
        return prev; // Task not found or dropped in the same column
      }

      // Add the task to the new location
      const updatedTask = { ...taskToMove, updatedAt: new Date() };
      if (newDay === 'weekly') {
        newStore.weeklyTasks = [...newStore.weeklyTasks, { ...updatedTask, type: 'weekly' }];
      } else {
        newStore.dailyTasks = {
          ...newStore.dailyTasks,
          [newDay]: [...newStore.dailyTasks[newDay], { ...updatedTask, type: 'daily', day: newDay }],
        };
      }

      saveToStorage(newStore);
      return newStore;
    });
  }, [saveToStorage]);

  return {
    weeklyTasks: store.weeklyTasks,
    dailyTasks: store.dailyTasks,
    addWeeklyTask,
    addDailyTask,
    toggleTask,
    deleteTask,
    editTask,
    moveTask,
  };
};