import { useEffect } from "react";
import TaskManager from "./components/TaskManager";
import { useAppDispatch, useAppSelector } from "./store/hook";
import { fetchTasks } from "./store/taskReducer";
import {
  CheckCircle,
  Clock,
  Loader2,
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  Activity,
} from "lucide-react";
import { toast } from "react-toastify";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { tasks } = useAppSelector((state) => state.tasks);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        await dispatch(fetchTasks()).unwrap();
        toast.info("📊 Dashboard data loaded successfully!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (error) {
        console.error("Error loading tasks:", error);
        toast.error("❌ Failed to load dashboard data", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    };

    loadTasks();
  }, [dispatch]);

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;
  const pendingTasks = tasks.filter((task) => task.status === "pending").length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Get recent tasks (last 3)
  const recentTasks = tasks.slice(-3).reverse();

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          <span className="text-green-600 font-medium">{trend}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 shadow-lg">
            <BarChart3 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Task Dashboard
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Monitor your productivity and manage tasks efficiently with our
            comprehensive dashboard.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Tasks"
            value={totalTasks}
            icon={Activity}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            trend="+12% this week"
          />
          <StatCard
            title="Completed"
            value={completedTasks}
            icon={CheckCircle}
            color="bg-gradient-to-r from-green-500 to-green-600"
            trend={`${completionRate}% completion rate`}
          />
          <StatCard
            title="In Progress"
            value={inProgressTasks}
            icon={Loader2}
            color="bg-gradient-to-r from-yellow-500 to-orange-500"
            trend="Active now"
          />
          <StatCard
            title="Pending"
            value={pendingTasks}
            icon={Clock}
            color="bg-gradient-to-r from-purple-500 to-pink-500"
            trend="Awaiting start"
          />
        </div>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Recent Tasks */}
          <div className="lg:col-span-1">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
                  Recent Tasks
                </h3>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-4">
                {recentTasks.length > 0 ? (
                  recentTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${
                          task.status === "completed"
                            ? "bg-green-500"
                            : task.status === "in-progress"
                            ? "bg-blue-500"
                            : "bg-yellow-500"
                        }`}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {task.clientName}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {task.description}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          task.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : task.status === "in-progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {task.status.replace("-", " ")}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No recent tasks</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Task Distribution Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
                  Task Distribution
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{totalTasks} total tasks</span>
                </div>
              </div>

              {/* Simple Progress Bars */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">
                      Completed
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {completedTasks}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
                      }%`,
                    }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">
                      In Progress
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {inProgressTasks}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        totalTasks > 0
                          ? (inProgressTasks / totalTasks) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">
                      Pending
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">{pendingTasks}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        totalTasks > 0 ? (pendingTasks / totalTasks) * 100 : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Task Manager Container */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-white/10 to-white/5 px-8 py-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-100"></div>
                  <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse delay-200"></div>
                  <span className="ml-4 text-sm font-medium text-gray-600">
                    Task Management System
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Activity className="w-4 h-4" />
                  <span>Live Dashboard</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <TaskManager />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-white/60 text-sm">
            Built with React, TypeScript, and Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
}
