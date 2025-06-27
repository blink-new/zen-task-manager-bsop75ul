export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WeeklyTask extends Task {
  type: 'weekly';
}

export interface DailyTask extends Task {
  type: 'daily';
  day: WeekDay;
}

export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

export interface TaskStore {
  weeklyTasks: WeeklyTask[];
  dailyTasks: Record<WeekDay, DailyTask[]>;
}

export const WEEK_DAYS: WeekDay[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export const WEEK_DAY_LABELS: Record<WeekDay, { en: string; jp: string }> = {
  monday: { en: 'Monday', jp: '月曜日' },
  tuesday: { en: 'Tuesday', jp: '火曜日' },
  wednesday: { en: 'Wednesday', jp: '水曜日' },
  thursday: { en: 'Thursday', jp: '木曜日' },
  friday: { en: 'Friday', jp: '金曜日' },
  saturday: { en: 'Saturday', jp: '土曜日' },
};