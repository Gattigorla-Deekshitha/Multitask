import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Calendar, MoreVertical } from 'lucide-react';
import { projectService } from '../services/api';
import { cn } from '../lib/utils';

const Projects = () => {
  const isAdmin = true;
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    deadline: '',
    status: 'Pending'
  });

  const fetchProjects = async () => {
    try {
      const response = await projectService.getAll();
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentProject) {
        await projectService.update(currentProject.id, formData);
      } else {
        await projectService.create(formData);
      }
      setIsModalOpen(false);
      setCurrentProject(null);
      setFormData({ name: '', description: '', deadline: '', status: 'Pending' });
      fetchProjects();
    } catch (error) {
      console.error("Error saving project", error);
    }
  };

  const handleEdit = (project) => {
    setCurrentProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      deadline: project.deadline,
      status: project.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await projectService.delete(id);
        fetchProjects();
      } catch (error) {
        console.error("Error deleting project", error);
      }
    }
  };

  if (loading) return <div className="p-8 text-center">Loading projects...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Projects</h1>
          <p className="text-slate-500 mt-1">Manage and track your ongoing projects.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => { setIsModalOpen(true); setCurrentProject(null); }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Create Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, i) => {
          // Dynamic gradients based on project index
          const gradients = [
            "from-indigo-50 to-white",
            "from-purple-50 to-white",
            "from-blue-50 to-white",
            "from-emerald-50 to-white",
            "from-rose-50 to-white",
          ];
          const bgGradient = gradients[i % gradients.length];
          
          return (
          <div key={project.id} className={`relative overflow-hidden p-7 rounded-[2rem] bg-gradient-to-br ${bgGradient} border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group`}>
            {/* Decorative blob */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>

            <div className="relative z-10 flex justify-between items-start mb-5">
              <span className={cn(
                "px-4 py-1.5 rounded-xl text-xs font-extrabold shadow-sm backdrop-blur-md border",
                project.status === 'Completed' ? "bg-emerald-100/80 text-emerald-700 border-emerald-200" :
                project.status === 'In Progress' ? "bg-blue-100/80 text-blue-700 border-blue-200" :
                project.status === 'Overdue' ? "bg-rose-100/80 text-rose-700 border-rose-200" :
                "bg-slate-100/80 text-slate-700 border-slate-200"
              )}>
                {project.status}
              </span>
              {isAdmin && (
                <div className="flex gap-1 bg-white/60 backdrop-blur-sm rounded-xl p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 shadow-sm border border-white/40">
                  <button onClick={() => handleEdit(project)} className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-white transition-colors"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(project.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-white transition-colors"><Trash2 size={16} /></button>
                </div>
              )}
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-extrabold text-slate-800 mb-2 tracking-tight group-hover:text-indigo-600 transition-colors">{project.name}</h3>
              <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed font-medium">{project.description}</p>
              <div className="flex items-center gap-2 text-slate-600 text-xs mt-auto pt-4 border-t border-slate-200/50 font-bold bg-white/30 px-4 py-3 rounded-2xl">
                <Calendar size={16} className="text-indigo-500" />
                <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )})}
      </div>

      {/* Simple Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">{currentProject ? 'Edit Project' : 'New Project'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-600">Project Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-600">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="input-field h-24"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-600">Deadline</label>
                  <input 
                    type="date" 
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-600">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="input-field bg-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
                >
                  {currentProject ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
