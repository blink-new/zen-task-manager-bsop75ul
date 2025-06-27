import React from 'react';
import { TaskColumn } from './components/TaskColumn';
import { useTasks } from './hooks/use-tasks';
import { WEEK_DAYS, WEEK_DAY_LABELS, WeekDay } from './types/task';

function App() {
  const {
    weeklyTasks,
    dailyTasks,
    addWeeklyTask,
    addDailyTask,
    toggleTask,
    deleteTask,
    editTask,
  } = useTasks();

  const totalWeeklyTasks = weeklyTasks.length;
  const totalDailyTasks = WEEK_DAYS.reduce((sum, day) => sum + dailyTasks[day].length, 0);
  const completedWeeklyTasks = weeklyTasks.filter(task => task.completed).length;
  const completedDailyTasks = WEEK_DAYS.reduce(
    (sum, day) => sum + dailyTasks[day].filter(task => task.completed).length,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-100/30 to-stone-200/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-stone-800 mb-2 font-jp">
            禅タスク
          </h1>
          <h2 className="text-xl text-stone-600 mb-4">Zen Task Manager</h2>
          <div className="flex justify-center space-x-6 text-sm text-stone-500">
            <div>
              Weekly: {completedWeeklyTasks}/{totalWeeklyTasks}
            </div>
            <div>
              Daily: {completedDailyTasks}/{totalDailyTasks}
            </div>
            <div>
              Total: {completedWeeklyTasks + completedDailyTasks}/{totalWeeklyTasks + totalDailyTasks}
            </div>
          </div>
        </div>

        {/* Weekly Tasks Meta Column */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-3">
            <TaskColumn
              title="Weekly Goals"
              subtitle="週間目標"
              tasks={weeklyTasks}
              onAddTask={addWeeklyTask}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
              onEditTask={editTask}
              placeholder="Add a weekly goal..."
              isWeekly
            />
          </div>
          {/* Empty divs to fill the rest of the row for alignment */}
          <div className="hidden xl:block xl:col-span-3"></div>
        </div>

        {/* Daily Task Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {WEEK_DAYS.map((day: WeekDay) => (
            <TaskColumn
              key={day}
              title={WEEK_DAY_LABELS[day].en}
              subtitle={WEEK_DAY_LABELS[day].jp}
              tasks={dailyTasks[day]}
              onAddTask={(title, description) => addDailyTask(day, title, description)}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
              onEditTask={editTask}
              placeholder={`Add ${day} task...`}
            />
          ))}
        </div>

        {/* Footer with Zen Quote */}
        <div className="text-center mt-12 pt-8 border-t border-stone-200/50">
          <p className="text-sm text-stone-500 italic">
            "The way to get started is to quit talking and begin doing."
          </p>
          <p className="text-xs text-stone-400 mt-1 font-jp">
            始める方法は話すのをやめて行動することです
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;