import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Calendar, User, Briefcase, Flag } from 'lucide-react';
import { taskService, projectService, memberService } from '../services/api';
import { cn } from '../lib/utils';

const Tasks = () => {
  const isAdmin = true;
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    assigned_member: '',
    deadline: '',
    priority: 'Medium',
    status: 'Pending'
  });

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes, membersRes] = await Promise.all([
        taskService.getAll(),
        projectService.getAll(),
        memberService.getAll()
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      setMembers(membersRes.data);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentTask) {
        await taskService.update(currentTask.id, formData);
      } else {
        await taskService.create(formData);
      }
      setIsModalOpen(false);
      setCurrentTask(null);
      setFormData({ title: '', description: '', project: '', assigned_member: '', deadline: '', priority: 'Medium', status: 'Pending' });
      fetchData();
    } catch (error) {
      console.error("Error saving task", error);
    }
  };

  const handleEdit = (task) => {
    setCurrentTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      project: task.project,
      assigned_member: task.assigned_member,
      deadline: task.deadline,
      priority: task.priority,
      status: task.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskService.delete(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting task", error);
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-rose-600 bg-rose-100';
      case 'Medium': return 'text-amber-600 bg-amber-100';
      case 'Low': return 'text-emerald-600 bg-emerald-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  if (loading) return <div className="p-8 text-center">Loading tasks...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Tasks</h1>
          <p className="text-slate-500 mt-1">Keep track of your team's progress.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => { setIsModalOpen(true); setCurrentTask(null); }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Create Task
          </button>
        )}
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-60"></div>
        
        <div className="relative z-10 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100/50 backdrop-blur-sm">
                <th className="px-8 py-5 text-sm font-extrabold text-slate-500 uppercase tracking-wider">Task Title</th>
                <th className="px-6 py-5 text-sm font-extrabold text-slate-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-5 text-sm font-extrabold text-slate-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-5 text-sm font-extrabold text-slate-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-5 text-sm font-extrabold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-8 py-5 text-sm font-extrabold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-white transition-all duration-300 group">
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-slate-800 text-base group-hover:text-indigo-600 transition-colors">{task.title}</span>
                      <span className="text-xs font-medium text-slate-400 mt-1.5 flex items-center gap-1.5">
                        <Calendar size={12} className="text-indigo-400" /> {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-600 font-bold">
                    <div className="flex items-center gap-2 bg-slate-50/80 w-fit px-3 py-1.5 rounded-xl border border-slate-100">
                      <Briefcase size={14} className="text-indigo-500" />
                      {task.project_name}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-xs font-extrabold text-indigo-700 shadow-sm border border-indigo-50">
                        {task.assigned_member_name?.charAt(0) || '?'}
                      </div>
                      {task.assigned_member_name || 'Unassigned'}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={cn("px-4 py-1.5 rounded-xl text-[11px] font-extrabold uppercase tracking-wider shadow-sm border border-white", getPriorityColor(task.priority))}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                     <span className={cn(
                      "px-4 py-1.5 rounded-xl text-xs font-extrabold shadow-sm border border-white",
                      task.status === 'Completed' ? "bg-emerald-100/80 text-emerald-700" :
                      task.status === 'In Progress' ? "bg-blue-100/80 text-blue-700" :
                      task.status === 'Overdue' ? "bg-rose-100/80 text-rose-700" :
                      "bg-slate-100/80 text-slate-700"
                    )}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    {isAdmin && (
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                        <button onClick={() => handleEdit(task)} className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(task.id)} className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">{currentTask ? 'Edit Task' : 'New Task'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-600">Task Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-600">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="input-field h-20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-600">Project</label>
                  <select 
                    value={formData.project}
                    onChange={(e) => setFormData({...formData, project: e.target.value})}
                    className="input-field bg-white"
                    required
                  >
                    <option value="">Select Project</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-600">Assigned To</label>
                  <select 
                    value={formData.assigned_member}
                    onChange={(e) => setFormData({...formData, assigned_member: e.target.value})}
                    className="input-field bg-white"
                  >
                    <option value="">Select Member</option>
                    {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
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
                  <label className="text-sm font-semibold text-slate-600">Priority</label>
                  <select 
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="input-field bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
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
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95">
                  {currentTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
