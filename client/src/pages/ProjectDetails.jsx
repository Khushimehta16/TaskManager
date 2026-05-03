import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import API_URL from '../api';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Plus, ArrowLeft, Clock, MoreVertical, Users } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const ProjectDetails = () => {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  
  const { user } = useContext(AuthContext);
  
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', dueDate: '' });
  const [selectedMember, setSelectedMember] = useState('');

  const fetchData = async () => {
    try {
      const [projRes, tasksRes, usersRes] = await Promise.all([
        axios.get(`${API_URL}/api/projects`),
        axios.get(`${API_URL}/api/tasks/project/${id}`),
        axios.get(`${API_URL}/api/users`)
      ]);
      const currentProject = projRes.data.find(p => p._id === id);
      setProject(currentProject);
      setTasks(tasksRes.data);
      setAllUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const taskData = { ...newTask, project: id };
      if (!taskData.assignedTo) delete taskData.assignedTo;
      
      await axios.post(`${API_URL}/api/tasks`, taskData);
      setIsTaskModalOpen(false);
      setNewTask({ title: '', description: '', assignedTo: '', dueDate: '' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedMember) return;
    try {
      await axios.put(`${API_URL}/api/projects/${id}/members`, { memberId: selectedMember });
      setIsTeamModalOpen(false);
      setSelectedMember('');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = ['To Do', 'In Progress', 'Done'];

  return (
    <Layout>
      <div className="mb-6">
        <Link to="/admin" className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-sm font-medium mb-4 w-fit transition-colors">
          <ArrowLeft size={16} /> Back to Projects
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{project?.name || 'Project'}</h1>
            <p className="text-slate-500 mt-1 max-w-2xl">{project?.description}</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsTeamModalOpen(true)}
              className="bg-white border border-gray-200 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
              <Users size={18} /> Manage Team
            </button>
            <button 
              onClick={() => setIsTaskModalOpen(true)}
              className="bg-[#5b45ff] hover:bg-[#4a35f0] text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
              <Plus size={18} /> Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Team Members Avatar Group */}
      <div className="flex items-center gap-2 mb-8 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm w-fit">
        <span className="text-sm font-medium text-slate-600 mr-2">Team Members:</span>
        <div className="flex -space-x-2">
          {project?.teamMembers?.map((member, i) => (
            <div key={member._id} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white ${
              i % 2 === 0 ? 'bg-[#5b45ff]' : 'bg-[#1e1b4b]'
            }`} title={member.name}>
              {member.name.charAt(0).toUpperCase()}
            </div>
          ))}
          {(!project?.teamMembers || project.teamMembers.length === 0) && (
            <span className="text-sm text-slate-400">No members added yet</span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">Loading project data...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {columns.map(status => (
            <div key={status} className="bg-slate-100 rounded-2xl p-4 min-h-[500px]">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-bold text-slate-700">{status}</h3>
                <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-md">
                  {tasks.filter(t => t.status === status).length}
                </span>
              </div>
              
              <div className="space-y-3">
                {tasks.filter(t => t.status === status).map(task => (
                  <div key={task._id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:border-[#5b45ff] transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-slate-900">{task.title}</h4>
                      <button className="text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                    {task.description && <p className="text-slate-500 text-sm mb-4 line-clamp-2">{task.description}</p>}
                    
                    <div className="flex justify-between items-center mt-auto border-t border-gray-50 pt-3">
                      <div className="flex items-center">
                        {task.assignedTo ? (
                          <div className="w-6 h-6 rounded-full bg-[#1e1b4b] flex items-center justify-center text-[10px] font-bold text-white" title={task.assignedTo.name}>
                            {task.assignedTo.name.charAt(0).toUpperCase()}
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-dashed border-slate-400" title="Unassigned">
                            ?
                          </div>
                        )}
                      </div>
                      {task.dueDate && (
                        <div className={`flex items-center text-xs font-medium ${new Date(task.dueDate) < new Date() && task.status !== 'Done' ? 'text-red-500' : 'text-slate-400'}`}>
                          <Clock size={12} className="mr-1" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {tasks.filter(t => t.status === status).length === 0 && (
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center text-slate-400 text-sm font-medium">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Create New Task</h2>
            <p className="text-slate-500 mb-6 text-sm">Add a new task to {project?.name}.</p>
            
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Task Title</label>
                <input required type="text" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})}
                  className="w-full rounded-[14px] border border-gray-200 px-4 py-3 text-slate-900 focus:border-[#5b45ff] focus:ring-1 focus:ring-[#5b45ff] outline-none" placeholder="e.g. Design Login Page" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea rows="3" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})}
                  className="w-full rounded-[14px] border border-gray-200 px-4 py-3 text-slate-900 focus:border-[#5b45ff] focus:ring-1 focus:ring-[#5b45ff] outline-none resize-none" placeholder="Task details..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Assign To</label>
                  <select value={newTask.assignedTo} onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}
                    className="w-full rounded-[14px] border border-gray-200 px-4 py-3 text-slate-900 focus:border-[#5b45ff] focus:ring-1 focus:ring-[#5b45ff] outline-none bg-white">
                    <option value="">Unassigned</option>
                    {project?.teamMembers?.map(member => (
                      <option key={member._id} value={member._id}>{member.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                  <input type="date" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                    className="w-full rounded-[14px] border border-gray-200 px-4 py-3 text-slate-900 focus:border-[#5b45ff] focus:ring-1 focus:ring-[#5b45ff] outline-none" />
                </div>
              </div>
              
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setIsTaskModalOpen(false)}
                  className="flex-1 py-3.5 rounded-[14px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-3.5 rounded-[14px] font-semibold text-white bg-[#5b45ff] hover:bg-[#4a35f0] transition-colors">
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Team Member Modal */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Add Team Member</h2>
            <p className="text-slate-500 mb-6 text-sm">Invite a registered user to join this project.</p>
            
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select User</label>
                <select required value={selectedMember} onChange={e => setSelectedMember(e.target.value)}
                  className="w-full rounded-[14px] border border-gray-200 px-4 py-3 text-slate-900 focus:border-[#5b45ff] focus:ring-1 focus:ring-[#5b45ff] outline-none bg-white">
                  <option value="" disabled>Choose a user...</option>
                  {allUsers
                    .filter(u => !project?.teamMembers?.find(m => m._id === u._id)) // Filter out already added users
                    .map(user => (
                    <option key={user._id} value={user._id}>{user.name} ({user.email})</option>
                  ))}
                </select>
                {allUsers.filter(u => !project?.teamMembers?.find(m => m._id === u._id)).length === 0 && (
                  <p className="text-xs text-amber-600 mt-2">All registered users are already in this project.</p>
                )}
              </div>
              
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setIsTeamModalOpen(false)}
                  className="flex-1 py-3.5 rounded-[14px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={!selectedMember}
                  className="flex-1 py-3.5 rounded-[14px] font-semibold text-white bg-[#5b45ff] hover:bg-[#4a35f0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ProjectDetails;
