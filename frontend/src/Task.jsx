import { useState, useEffect } from "react";
import { Plus, Calendar, Check, Trash2, Clock, Search } from "lucide-react";
import axios from "axios";

export default function Task() {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  // ✅ Fetch all tasks on load
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/tasks");
        setTasks(response.data);
      } catch (error) {
        console.error("❌ Error fetching tasks:", error);
        setMessage("❌ Error fetching tasks");
      }
    };

    fetchTasks();
  }, []);

  // ✅ Add new task
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:3000/api/tasks", {
        title,
        dueDate: dueDate || undefined,
      });

      setTasks([response.data, ...tasks]);
      setMessage("✅ Task added successfully!");
      setTitle("");
      setDueDate("");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("❌ Error adding task:", error);
      setMessage("❌ Error adding task");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle completion
  const toggleComplete = async (taskId, currentStatus) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/tasks/${taskId}`,
        { completed: !currentStatus }
      );

      if (response.status === 200) {
        setTasks((prev) =>
          prev.map((task) =>
            task._id === taskId ? { ...task, completed: !currentStatus } : task
          )
        );
      }
    } catch (error) {
      console.error("❌ Error updating task:", error);
    }
  };

  // ✅ Delete task
  const deleteTask = async (taskId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/tasks/${taskId}`
      );

      if (response.status === 200) {
        setTasks((prev) => prev.filter((task) => task._id !== taskId));
        setMessage("🗑️ Task deleted");
        setTimeout(() => setMessage(""), 2000);
      }
    } catch (error) {
      console.error("❌ Error deleting task:", error);
    }
  };

  // ✅ Filter and search logic
  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "active") return !task.completed;
      if (filter === "completed") return task.completed;
      return true;
    })
    .filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // ✅ Stats
  const stats = {
    total: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            ✨ Task Manager
          </h1>
          <p className="text-gray-600">Organize your day, one task at a time</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-purple-100 hover:scale-105 transition-transform">
            <div className="text-3xl font-bold text-purple-600">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-blue-100 hover:scale-105 transition-transform">
            <div className="text-3xl font-bold text-blue-600">
              {stats.active}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-green-100 hover:scale-105 transition-transform">
            <div className="text-3xl font-bold text-green-600">
              {stats.completed}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>

        {/* Add Task Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6 border-2 border-purple-100">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What needs to be done?"
                    required
                    className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="pl-11 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  {loading ? "Adding..." : "Add"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-2xl shadow-lg animate-slide-down ${
              message.includes("✅")
                ? "bg-green-100 text-green-800 border-2 border-green-200"
                : "bg-red-100 text-red-800 border-2 border-red-200"
            }`}
          >
            {message}
          </div>
        )}

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-all shadow-md"
            />
          </div>
          <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-md border-2 border-gray-200">
            {["all", "active", "completed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-xl font-medium capitalize transition-all ${
                  filter === f
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl shadow-lg border-2 border-dashed border-gray-200">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-500 text-lg">
                No tasks found. Add one to get started!
              </p>
            </div>
          ) : (
            filteredTasks.map((task, index) => (
              <div
                key={task._id}
                style={{ animationDelay: `${index * 50}ms` }}
                className={`bg-white rounded-2xl p-5 shadow-lg border-2 transition-all hover:shadow-xl hover:-translate-y-1 animate-slide-up ${
                  task.completed
                    ? "border-green-200 bg-gradient-to-r from-green-50 to-emerald-50"
                    : "border-purple-100"
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleComplete(task._id, task.completed)}
                    className={`mt-1 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all transform hover:scale-110 ${
                      task.completed
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 border-green-500"
                        : "border-gray-300 hover:border-purple-500"
                    }`}
                  >
                    {task.completed && <Check className="w-4 h-4 text-white" />}
                  </button>

                  <div className="flex-1">
                    <h3
                      className={`text-lg font-semibold mb-2 ${
                        task.completed
                          ? "line-through text-gray-500"
                          : "text-gray-800"
                      }`}
                    >
                      {task.title}
                    </h3>

                    {task.dueDate && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 rounded-full px-3 py-1 w-fit">
                        <Clock className="w-4 h-4" />
                        {new Date(task.dueDate).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => deleteTask(task._id)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all transform hover:scale-110 active:scale-95"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
