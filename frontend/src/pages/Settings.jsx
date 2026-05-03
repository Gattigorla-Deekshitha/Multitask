import React, { useState } from 'react';
import { User, Mail, Shield, LogOut, Save, Bell, Moon } from 'lucide-react';

const Settings = ({ onLogout }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [formData, setFormData] = useState({
    name: user.name || 'Admin User',
    email: user.email || 'admin@gmail.com',
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (onLogout) onLogout();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account and application preferences.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <User size={20} className="text-indigo-600" />
              Account Information
            </h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-600">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-600">Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    className="input-field bg-slate-50 cursor-not-allowed"
                    disabled
                  />
                </div>
              </div>
              <div className="pt-4">
                <button type="button" className="btn-primary flex items-center gap-2">
                  <Save size={18} />
                  Update Profile
                </button>
              </div>
            </form>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Shield size={20} className="text-indigo-600" />
              Security
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
                <div>
                  <p className="font-semibold text-slate-700">Password</p>
                  <p className="text-xs text-slate-500">Last changed 3 months ago</p>
                </div>
                <button className="px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
                  Change Password
                </button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
                <div>
                  <p className="font-semibold text-slate-700">Two-Factor Authentication</p>
                  <p className="text-xs text-slate-500">Add an extra layer of security</p>
                </div>
                <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-not-allowed">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Bell size={20} className="text-indigo-600" />
              Notifications
            </h2>
            <div className="space-y-4">
              {['Email Notifications', 'Project Updates', 'Task Reminders'].map((n) => (
                <div key={n} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">{n}</span>
                  <input type="checkbox" defaultChecked className="accent-indigo-600 h-4 w-4" />
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-rose-50 border border-rose-100 shadow-sm">
            <h2 className="text-xl font-bold text-rose-800 mb-2">Danger Zone</h2>
            <p className="text-rose-600/70 text-sm mb-6">Once you logout, you will need your credentials to enter again.</p>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-100"
            >
              <LogOut size={20} />
              Logout Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
