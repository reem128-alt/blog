import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Task, CreateTaskData, UpdateTaskData } from "../types/task";
import axios from "axios";

// Async thunks for API calls
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const response = await axios.get("http://localhost:3001/tasks");
  return response.data;
});

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData: CreateTaskData) => {
    const response = await axios.post("http://localhost:3001/tasks", {
      ...taskData,
      createdAt: new Date().toISOString(),
    });
    return response.data;
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (taskData: UpdateTaskData) => {
    const { id, ...updateData } = taskData;
    const response = await axios.put(
      `http://localhost:3001/tasks/${id}`,
      updateData
    );
    return response.data;
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id: number) => {
    await axios.delete(`http://localhost:3001/tasks/${id}`);
    return id;
  }
);

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tasks";
      })
      // Create task
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create task";
      })
      // Update task
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        const index = state.tasks.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update task";
      })
      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete task";
      });
  },
});

export const { clearError } = taskSlice.actions;
export default taskSlice.reducer;
