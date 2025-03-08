import axios from "axios";
import { useState, useEffect } from "react";


interface Task {
  id: number;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  due_date: string | null;
}

const Home: React.FC = () => {    
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError(""); 

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }
      
      console.log("Token:", token); 

      const response = await axios.get<Task[]>("http://127.0.0.1:8000/api/tasks/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setTasks(response.data);
    } catch (error) {
      setError("Error fetching tasks. Please try again.");
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (taskId: number, newStatus: Task["status"]) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required.");
        return;
      }
      console.log(taskId, newStatus); 
      await axios.patch(`http://127.0.0.1:8000/api/task_status/${taskId}/`, 
        { status: newStatus }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      setError("Error updating task. Please try again.");
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white ">
      <h1 className="text-3xl font-bold mb-4">Your Assigned Tasks</h1>

      {error && <p className="text-red-500">{error}</p>}

      {loading ? (
        <p className="text-gray-400">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-400">No tasks assigned yet.</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li key={task.id} className="p-4 bg-gray-800 rounded-lg">
              <h2 className="text-lg font-semibold">{task.title}</h2>
              <p className="text-sm text-gray-300">{task.description}</p>
              <p className="text-sm text-gray-400">
                Status: <span className="font-semibold">{task.status}</span> | Due: {task.due_date || "No due date"}
              </p>

              <select 
                className="mt-2 p-2 bg-gray-700 text-white rounded" 
                value={task.status}
                onChange={(e) => updateStatus(task.id, e.target.value as Task["status"])}
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </li>
          ))}
        </ul>
      )}
    </div>
    
  );
};

export default Home;
