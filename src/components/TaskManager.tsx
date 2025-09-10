import React, { useState } from "react";
import TaskTable from "./TaskTable";
import TaskFormDialog from "./TaskFormDialog";
import { Task } from "../types/task";

const TaskManager: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");

  const handleAddTask = () => {
    setSelectedTask(null);
    setDialogMode("create");
    setIsDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedTask(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Your Tasks</h2>
          <p className="text-gray-600 mt-1">
            Manage and track your project tasks
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
              Active
            </span>
          </div>
        </div>
      </div>

      <TaskTable onAddTask={handleAddTask} onEditTask={handleEditTask} />

      <TaskFormDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        task={selectedTask}
        mode={dialogMode}
      />
    </div>
  );
};

export default TaskManager;
