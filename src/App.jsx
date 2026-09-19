import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Check,
  Pencil,
  Trash2,
  X,
  ListTodo,
  CircleCheck,
  Clock3,
} from "lucide-react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("focuslist-tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState("Medium");

  // Save tasks whenever they change
  useEffect(() => {
    localStorage.setItem("focuslist-tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add task
  const addTask = (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    const newTask = {
      id: Date.now(),
      title: title.trim(),
      priority,
      completed: false,
    };

    setTasks([newTask, ...tasks]);
    setTitle("");
    setPriority("Medium");
  };

  // Complete / uncomplete
  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  // Delete
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Start editing
  const startEdit = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditPriority(task.priority);
  };

  // Save edit
  const saveEdit = (id) => {
    if (!editTitle.trim()) return;

    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              title: editTitle.trim(),
              priority: editPriority,
            }
          : task
      )
    );

    setEditingId(null);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" && !task.completed) ||
      (statusFilter === "Completed" && task.completed);

    const matchesPriority =
      priorityFilter === "All" ||
      task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <div className="logo-icon">
            <Check size={22} />
          </div>

          <div>
            <h1>TO-DO-LIST</h1>
            <p>Stay focused. Get things done.</p>
          </div>
        </div>
      </header>

      <main className="container">
        {/* Statistics */}
        <section className="stats">
          <div className="stat-card">
            <div className="stat-icon blue">
              <ListTodo size={22} />
            </div>
            <div>
              <span>Total Tasks</span>
              <strong>{totalTasks}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <CircleCheck size={22} />
            </div>
            <div>
              <span>Completed</span>
              <strong>{completedTasks}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              <Clock3 size={22} />
            </div>
            <div>
              <span>Pending</span>
              <strong>{pendingTasks}</strong>
            </div>
          </div>
        </section>

        {/* Add Task */}
        <section className="add-section">
          <h2>Add a new task</h2>

          <form onSubmit={addTask} className="add-form">
            <input
              type="text"
              placeholder="What do you need to accomplish?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>

            <button type="submit" className="add-btn">
              <Plus size={19} />
              Add Task
            </button>
          </form>
        </section>

        {/* Search and Filters */}
        <section className="controls">
          <div className="search-box">
            <Search size={19} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filters">
            <div className="filter-group">
              {["All", "Active", "Completed"].map((filter) => (
                <button
                  key={filter}
                  className={statusFilter === filter ? "active-filter" : ""}
                  onClick={() => setStatusFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </section>

        {/* Task List */}
        <section className="task-section">
          <div className="task-header">
            <h2>My Tasks</h2>
            <span>{filteredTasks.length} tasks</span>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="empty">
              <ListTodo size={45} />
              <h3>No tasks found</h3>
              <p>Add a task or change your filters.</p>
            </div>
          ) : (
            <div className="task-list">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`task-card ${
                    task.completed ? "completed-task" : ""
                  }`}
                >
                  {editingId === task.id ? (
                    <div className="edit-area">
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        autoFocus
                      />

                      <select
                        value={editPriority}
                        onChange={(e) =>
                          setEditPriority(e.target.value)
                        }
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>

                      <button
                        className="save-btn"
                        onClick={() => saveEdit(task.id)}
                      >
                        Save
                      </button>

                      <button
                        className="cancel-btn"
                        onClick={() => setEditingId(null)}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        className={`check-btn ${
                          task.completed ? "checked" : ""
                        }`}
                        onClick={() => toggleTask(task.id)}
                      >
                        {task.completed && <Check size={16} />}
                      </button>

                      <div className="task-content">
                        <h3>{task.title}</h3>

                        <span
                          className={`priority ${task.priority.toLowerCase()}`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      <div className="task-actions">
                        <button
                          onClick={() => startEdit(task)}
                          title="Edit task"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => deleteTask(task.id)}
                          title="Delete task"
                          className="delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer>
        <p>FocusList • Organize your day, one task at a time.</p>
      </footer>
    </div>
  );
}

export default App;