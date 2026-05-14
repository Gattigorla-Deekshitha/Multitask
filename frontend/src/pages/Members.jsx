import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Mail, Shield } from 'lucide-react';
import { memberService } from '../services/api';

const Members = () => {
  const isAdmin = true;
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    member_code: '',
    role: 'Member'
  });

  const fetchMembers = async () => {
    try {
      const response = await memberService.getAll();
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching members", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentMember) {
        await memberService.update(currentMember.id, formData);
      } else {
        await memberService.create(formData);
      }
      setIsModalOpen(false);
      setCurrentMember(null);
      setFormData({ name: '', email: '', role: 'Member' });
      fetchMembers();
    } catch (error) {
      console.error("Error saving member", error);
    }
  };

  const handleEdit = (member) => {
    setCurrentMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      member_code: member.member_code || '',
      role: member.role
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        await memberService.delete(id);
        fetchMembers();
      } catch (error) {
        console.error("Error deleting member", error);
      }
    }
  };

  if (loading) return <div className="p-8 text-center">Loading members...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Team Members</h1>
          <p className="text-slate-500 mt-1">Manage your team and their roles.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => { setIsModalOpen(true); setCurrentMember(null); }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Add Member
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member, i) => {
          const gradients = [
            "from-indigo-50 to-white",
            "from-purple-50 to-white",
            "from-blue-50 to-white",
            "from-emerald-50 to-white",
            "from-rose-50 to-white",
          ];
          const bgGradient = gradients[i % gradients.length];

          return (
          <div key={member.id} className={`relative overflow-hidden p-7 rounded-[2rem] bg-gradient-to-br ${bgGradient} border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group`}>
            {/* Decorative blob */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>

            <div className="relative z-10 flex justify-between items-start mb-6">
              <div className="w-16 h-16 rounded-[1.25rem] bg-white/80 backdrop-blur-md shadow-sm border border-white/60 flex items-center justify-center text-indigo-600 font-extrabold text-2xl group-hover:scale-110 transition-transform duration-500">
                {member.name.charAt(0)}
              </div>
              {isAdmin && (
                <div className="flex gap-1 bg-white/60 backdrop-blur-sm rounded-xl p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 shadow-sm border border-white/40">
                  <button onClick={() => handleEdit(member)} className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-white transition-colors"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(member.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-white transition-colors"><Trash2 size={16} /></button>
                </div>
              )}
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-extrabold text-slate-800 mb-1 tracking-tight group-hover:text-indigo-600 transition-colors">{member.name}</h3>
              <div className="flex items-center gap-2 text-slate-500 font-medium text-sm mb-5">
                <Mail size={14} className="text-indigo-400" />
                <span>{member.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm border ${
                  member.role === 'Admin' ? "bg-amber-100/80 text-amber-700 border-amber-200" : "bg-blue-100/80 text-blue-700 border-blue-200"
                }`}>
                  <Shield size={14} />
                  {member.role}
                </span>
                {member.member_code && (
                  <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100/80 text-slate-600 border border-slate-200 shadow-sm">
                    {member.member_code}
                  </span>
                )}
              </div>
            </div>
          </div>
        )})}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">{currentMember ? 'Edit Member' : 'New Member'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-600">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-600">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-600">Login ID / Member Code</label>
                <input 
                  type="text" 
                  placeholder="e.g. USER-123"
                  value={formData.member_code}
                  onChange={(e) => setFormData({...formData, member_code: e.target.value})}
                  className="input-field"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-600">Role</label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="input-field bg-white"
                >
                  <option value="Member">Member</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95">
                  {currentMember ? 'Save Changes' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
