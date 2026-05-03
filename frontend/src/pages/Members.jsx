import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Mail, Shield } from 'lucide-react';
import { memberService } from '../services/api';

const Members = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'Admin';
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
        {members.map((member) => (
          <div key={member.id} className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xl">
                {member.name.charAt(0)}
              </div>
              {isAdmin && (
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(member)} className="p-2 text-slate-400 hover:text-indigo-600"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(member.id)} className="p-2 text-slate-400 hover:text-rose-600"><Trash2 size={16} /></button>
                </div>
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">{member.name}</h3>
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
              <Mail size={14} />
              <span>{member.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                member.role === 'Admin' ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
              }`}>
                <Shield size={12} />
                {member.role}
              </span>
            </div>
          </div>
        ))}
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
