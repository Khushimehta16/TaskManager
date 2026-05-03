import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';
import { Clock, CheckCircle2, Circle } from 'lucide-react';

const MemberDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks/my-tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}/status`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Done': return <CheckCircle2 className="text-green-500" size={20} />;
      case 'In Progress': return <Clock className="text-[#5b45ff]" size={20} />;
      default: return <Circle className="text-slate-300" size={20} />;
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Tasks</h1>
        <p className="text-slate-500 mt-1">Manage and update the status of your assigned tasks.</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-[24px] border border-gray-100 p-12 text-center shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <div className="w-16 h-16 bg-[#5b45ff]/10 text-[#5b45ff] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">You're all caught up!</h3>
          <p className="text-slate-500">You don't have any tasks assigned to you right now.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <ul className="divide-y divide-gray-100">
            {tasks.map((task) => (
              <li key={task._id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <button 
                      onClick={() => updateTaskStatus(task._id, task.status === 'Done' ? 'To Do' : 'Done')}
                      className="mt-1 flex-shrink-0"
                    >
                      {getStatusIcon(task.status)}
                    </button>
                    <div>
                      <h4 className={`text-lg font-semibold ${task.status === 'Done' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                        {task.title}
                      </h4>
                      <p className="text-slate-500 text-sm mt-1">{task.description}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="inline-block bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-md font-medium border border-indigo-100">
                          {task.project?.name}
                        </span>
                        {task.dueDate && (
                          <span className="text-xs text-slate-400 flex items-center">
                            <Clock size={12} className="mr-1" />
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <select 
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                      className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 font-medium focus:border-[#5b45ff] focus:ring-1 focus:ring-[#5b45ff] outline-none"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Layout>
  );
};

export default MemberDashboard;
