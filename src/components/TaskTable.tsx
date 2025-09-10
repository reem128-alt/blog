import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { fetchTasks, deleteTask } from "../store/taskReducer";
import { Task } from "../types/task";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Edit, Trash2, Plus } from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-toastify";

interface TaskTableProps {
  onEditTask: (task: Task) => void;
  onAddTask: () => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ onEditTask, onAddTask }) => {
  const dispatch = useAppDispatch();
  const { tasks, loading, error } = useAppSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleDeleteTask = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await dispatch(deleteTask(id)).unwrap();
        toast.success("🗑️ Task deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (error) {
        console.error("Error deleting task:", error);
        toast.error("❌ Failed to delete task. Please try again.", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "in-progress":
        return "secondary";
      case "pending":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={onAddTask}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          Add New Task
        </Button>
      </div>

      <div className="rounded-xl border border-gray-200 shadow-sm bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="border-b border-gray-200">
              <TableHead className="font-semibold text-gray-700">
                Client Name
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Description
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Status
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Created At
              </TableHead>
              <TableHead className="text-right font-semibold text-gray-700">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-gray-500"
                >
                  No tasks found. Create your first task!
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">
                    {task.clientName}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {task.description}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusBadgeVariant(task.status)}
                      className={getStatusColor(task.status)}
                    >
                      {task.status.replace("-", " ").toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {task.createdAt &&
                    !isNaN(new Date(task.createdAt).getTime())
                      ? format(new Date(task.createdAt), "MMM dd, yyyy HH:mm")
                      : "No date"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditTask(task)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TaskTable;
