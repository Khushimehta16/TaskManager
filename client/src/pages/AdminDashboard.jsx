import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../api';
import Layout from '../components/Layout';
import { Plus, MoreVertical, Calendar, LayoutDashboard, CheckSquare, Clock, AlertCircle, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  const fetchData = async () => {
    try {
      const [projRes, tasksRes] = await Promise.all([
        axios.get(`${API_URL}/api/projects`),
        axios.get(`${API_URL}/api/tasks/all`)
      ]);
      setProjects(projRes.data);
      setAllTasks(tasksRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/projects`, newProject);
      setIsModalOpen(false);
      setNewProject({ name: '', description: '' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await axios.delete(`${API_URL}/api/projects/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate Statistics
  const totalTasks = allTasks.length;
  const tasksInProgress = allTasks.filter(t => t.status === 'In Progress').length;
  const overdueTasks = allTasks.filter(t => {
    if (t.status === 'Done' || !t.dueDate) return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  const stats = [
    { label: 'Total Projects', value: projects.length, icon: LayoutDashboard, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Tasks', value: totalTasks, icon: CheckSquare, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'In Progress', value: tasksInProgress, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Overdue Tasks', value: overdueTasks, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Track system statistics and manage your active projects.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#5b45ff] hover:bg-[#4a35f0] text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} /> New Project
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex items-center gap-4">
            <div className={`w-14 h-14 rounded-[16px] flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">Active Projects</h2>

      {loading ? (
        <div className="text-center py-20 text-slate-500">Loading data...</div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-[24px] border border-gray-100 p-12 text-center shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <div className="w-16 h-16 bg-[#5b45ff]/10 text-[#5b45ff] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Plus size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No projects yet</h3>
          <p className="text-slate-500 mb-6">Create your first project to start managing tasks.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-[#5b45ff] font-semibold hover:underline"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link key={project._id} to={`/admin/projects/${project._id}`} className="block group">
              <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-gray-200 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                    project.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {project.status}
                  </div>
                  <button 
                    onClick={(e) => handleDeleteProject(e, project._id)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    title="Delete Project"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-[#5b45ff] transition-colors">{project.name}</h3>
                <p className="text-slate-500 text-sm mb-6 line-clamp-2">{project.description}</p>
                <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                  <div className="flex -space-x-2">
                    {project.teamMembers.slice(0, 3).map((member, i) => (
                      <div key={member._id} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white ${
                        i % 2 === 0 ? 'bg-[#5b45ff]' : 'bg-[#1e1b4b]'
                      }`}>
                        {member.name.charAt(0)}
                      </div>
                    ))}
                    {project.teamMembers.length === 0 && <span className="text-xs text-slate-400">No members</span>}
                    {project.teamMembers.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600">
                        +{project.teamMembers.length - 3}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center text-slate-400 text-sm">
                    <Calendar size={14} className="mr-1" />
                    {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Create New Project</h2>
            <p className="text-slate-500 mb-6 text-sm">Fill in the details to start a new workspace.</p>
            
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
                <input required type="text" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})}
                  className="w-full rounded-[14px] border border-gray-200 px-4 py-3 text-slate-900 focus:border-[#5b45ff] focus:ring-1 focus:ring-[#5b45ff] outline-none" placeholder="e.g. Website Redesign" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea required rows="3" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})}
                  className="w-full rounded-[14px] border border-gray-200 px-4 py-3 text-slate-900 focus:border-[#5b45ff] focus:ring-1 focus:ring-[#5b45ff] outline-none resize-none" placeholder="Briefly describe the project..." />
              </div>
              
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3.5 rounded-[14px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-3.5 rounded-[14px] font-semibold text-white bg-[#5b45ff] hover:bg-[#4a35f0] transition-colors">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminDashboard;
