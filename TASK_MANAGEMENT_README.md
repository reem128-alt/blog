# Task Management System

A complete CRUD task management system built with React, TypeScript, Redux Toolkit, and JSON Server.

## Features

- ✅ Create new tasks with client name, description, and status
- ✅ View all tasks in a responsive table
- ✅ Edit existing tasks
- ✅ Delete tasks with confirmation
- ✅ Real-time status updates with color-coded badges
- ✅ Form validation using react-hook-form and Zod
- ✅ Responsive design with Tailwind CSS

## Task Structure

Each task contains:

- **ID**: Unique identifier (auto-generated)
- **Client Name**: Name of the client
- **Description**: Detailed task description
- **Status**: pending | in-progress | completed
- **Created At**: Timestamp when task was created

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start JSON Server (Mock API)

In one terminal:

```bash
npm run json-server
```

This will start the JSON server on `http://localhost:3001`

### 3. Start Development Server

In another terminal:

```bash
npm run dev
```

### 4. Access the Application

- Main app: `http://localhost:5173`
- Tasks page: `http://localhost:5173/en/tasks` (or your language code)

## API Endpoints

The JSON server provides these endpoints:

- `GET /tasks` - Get all tasks
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

## Components

### TaskTable

- Displays all tasks in a table format
- Shows client name, description, status, and creation date
- Provides Edit and Delete buttons for each task
- Includes an "Add New Task" button

### TaskFormDialog

- Modal dialog for creating and editing tasks
- Form validation using react-hook-form and Zod
- Supports both create and edit modes
- Status selection with dropdown

### TaskManager

- Main component that orchestrates the table and dialog
- Manages dialog state and mode (create/edit)
- Handles task selection for editing

## State Management

The application uses Redux Toolkit for state management:

- `fetchTasks` - Load all tasks from API
- `createTask` - Add a new task
- `updateTask` - Modify an existing task
- `deleteTask` - Remove a task

## Form Validation

Tasks are validated using Zod schema:

- Client name: Required, minimum 2 characters
- Description: Required, minimum 10 characters
- Status: Required, must be one of: pending, in-progress, completed

## Styling

The application uses:

- Tailwind CSS for styling
- Radix UI components for accessibility
- Lucide React for icons
- Custom color-coded status badges

## Usage

1. **View Tasks**: Navigate to the tasks page to see all existing tasks
2. **Create Task**: Click "Add New Task" button, fill the form, and submit
3. **Edit Task**: Click the "Edit" button on any task row
4. **Delete Task**: Click the "Delete" button and confirm the action
5. **Filter by Status**: Tasks are color-coded by status for easy identification

## File Structure

```
src/
├── components/
│   ├── TaskTable.tsx          # Table component with CRUD buttons
│   ├── TaskFormDialog.tsx     # Form dialog for create/edit
│   └── TaskManager.tsx        # Main orchestrator component
├── pages/
│   └── TasksPage.tsx          # Page component
├── store/
│   └── taskReducer.ts         # Redux slice for task management
├── types/
│   └── task.ts                # TypeScript interfaces
└── db.json                    # Mock database
```
