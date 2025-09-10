import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch } from "../store/hook";
import { createTask, updateTask } from "../store/taskReducer";
import { Task, TaskFormData } from "../types/task";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import {
  User,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";

// Validation schema
const taskSchema = z.object({
  clientName: z
    .string()
    .min(1, "Client name is required")
    .min(2, "Client name must be at least 2 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters"),
  status: z.enum(["pending", "in-progress", "completed"], {
    required_error: "Please select a status",
  }),
});

interface TaskFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  mode: "create" | "edit";
}

const TaskFormDialog: React.FC<TaskFormDialogProps> = ({
  isOpen,
  onClose,
  task,
  mode,
}) => {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      clientName: "",
      description: "",
      status: "pending",
    },
  });

  const watchedStatus = watch("status");

  useEffect(() => {
    if (task && mode === "edit") {
      setValue("clientName", task.clientName);
      setValue("description", task.description);
      setValue("status", task.status);
    } else {
      reset({
        clientName: "",
        description: "",
        status: "pending",
      });
    }
  }, [task, mode, setValue, reset]);

  const onSubmit = async (data: TaskFormData) => {
    try {
      if (mode === "create") {
        await dispatch(createTask(data)).unwrap();
        toast.success("🎉 Task created successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else if (task) {
        await dispatch(updateTask({ id: task.id, ...data })).unwrap();
        toast.success("✅ Task updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      onClose();
      reset();
    } catch (error) {
      console.error("Error submitting task:", error);
      toast.error("❌ Failed to save task. Please try again.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "in-progress":
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-white border-2 border-gray-200 shadow-2xl">
        <DialogHeader className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
              {mode === "create" ? (
                <FileText className="w-5 h-5 text-white" />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-800">
                {mode === "create" ? "Create New Task" : "Edit Task"}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                {mode === "create"
                  ? "Fill in the details to create a new task."
                  : "Update the task information below."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-3">
            <Label
              htmlFor="clientName"
              className="text-sm font-semibold text-gray-700 flex items-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span>Client Name</span>
            </Label>
            <Input
              id="clientName"
              {...register("clientName")}
              placeholder="Enter client name"
              className={`h-12 px-4 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-indigo-500/20 ${
                errors.clientName
                  ? "border-red-300 bg-red-50 focus:border-red-500"
                  : "border-gray-200 focus:border-indigo-500"
              }`}
            />
            {errors.clientName && (
              <div className="flex items-center space-x-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.clientName.message}</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="description"
              className="text-sm font-semibold text-gray-700 flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Description</span>
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Enter task description"
              rows={4}
              className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-indigo-500/20 resize-none ${
                errors.description
                  ? "border-red-300 bg-red-50 focus:border-red-500"
                  : "border-gray-200 focus:border-indigo-500"
              }`}
            />
            {errors.description && (
              <div className="flex items-center space-x-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.description.message}</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="status"
              className="text-sm font-semibold text-gray-700 flex items-center space-x-2"
            >
              <Clock className="w-4 h-4" />
              <span>Status</span>
            </Label>
            <Select
              value={watchedStatus}
              onValueChange={(value) =>
                setValue(
                  "status",
                  value as "pending" | "in-progress" | "completed"
                )
              }
            >
              <SelectTrigger
                className={`h-12 px-4 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-indigo-500/20 ${
                  errors.status
                    ? "border-red-300 bg-red-50 focus:border-red-500"
                    : "border-gray-200 focus:border-indigo-500"
                }`}
              >
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-2 border-gray-200 shadow-xl">
                <SelectItem value="pending" className="rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon("pending")}
                    <span>Pending</span>
                  </div>
                </SelectItem>
                <SelectItem value="in-progress" className="rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon("in-progress")}
                    <span>In Progress</span>
                  </div>
                </SelectItem>
                <SelectItem value="completed" className="rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon("completed")}
                    <span>Completed</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <div className="flex items-center space-x-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.status.message}</span>
              </div>
            )}
          </div>

          <DialogFooter className="flex space-x-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="h-12 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>
                    {mode === "create" ? "Creating..." : "Updating..."}
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  {mode === "create" ? (
                    <>
                      <FileText className="w-4 h-4" />
                      <span>Create Task</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Update Task</span>
                    </>
                  )}
                </div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskFormDialog;
