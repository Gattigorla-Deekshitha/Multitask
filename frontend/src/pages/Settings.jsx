import React, { useState } from 'react';
import { User, Mail, Shield, LogOut, Save, Bell, Moon, X, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const Settings = () => {
  const isAdmin = true;
  
  const [formData, setFormData] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
  });

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
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl scale-in-center">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-slate-800">Change Password</h3>
              <button onClick={() => { setShowPasswordModal(false); setPasswordStatus({ loading: false, success: false, error: '' }); setNewPassword(''); }} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
                <X size={24} />
              </button>
            </div>
            
            {passwordStatus.success ? (
              <div className="flex flex-col items-center justify-center py-8 text-center animate-in zoom-in duration-300">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-2">Password Updated!</h4>
                <p className="text-slate-500">Your password has been changed successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-600">New Password</label>
                  <input 
                    type="password" 
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="input-field"
                  />
                </div>
                
                {passwordStatus.error && (
                  <p className="text-sm text-rose-500 font-medium">{passwordStatus.error}</p>
                )}
                
                <button 
                  type="submit" 
                  disabled={passwordStatus.loading || !newPassword}
                  className="w-full mt-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-70"
                >
                  {passwordStatus.loading ? 'Updating...' : 'Save Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
