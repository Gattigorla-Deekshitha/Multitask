import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Hash, Shield, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { cn } from '../lib/utils';
import api from '../services/api';

const Login = ({ onLogin }) => {
  const [isAdmin, setIsAdmin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    member_code: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Removed auto-redirect so you can always access the login page manually

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/login/', formData);
      const { access, user } = response.data;
      
      localStorage.setItem('token', access);
      localStorage.setItem('user', JSON.stringify(user));
      
      if (onLogin) onLogin();
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100 rounded-full blur-[120px] opacity-60"></div>
      
      <div className="w-full max-w-[440px] px-6 py-12 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-200 mb-6 rotate-3 hover:rotate-0 transition-transform duration-500">
            <Shield size={32} />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">MultiTask</h1>
          <p className="text-slate-500 font-medium">Efficiently manage your full-stack projects</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white p-8 md:p-10">
          <div className="flex p-1.5 bg-slate-100/80 rounded-2xl mb-8">
            <button 
              onClick={() => { setIsAdmin(true); setFormData({ email: '', password: '', member_code: '' }); }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300",
                isAdmin ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Shield size={16} /> Admin
            </button>
            <button 
              onClick={() => { setIsAdmin(false); setFormData({ email: '', password: '', member_code: '' }); }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300",
                !isAdmin ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <User size={16} /> Member
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {isAdmin ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Work Email</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                      <Mail size={18} />
                    </div>
                    <input 
                      type="email" 
                      placeholder="admin@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                    <a href="#" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Forgot password?</a>
                  </div>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                      <Lock size={18} />
                    </div>
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full pl-12 pr-12 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Member Access ID</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <Hash size={18} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Enter your unique code"
                    value={formData.member_code}
                    onChange={(e) => setFormData({...formData, member_code: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm rounded-2xl text-center font-medium animate-shake">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {loading ? 'Authenticating...' : (
                <>
                  Get Started
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
        
        <div className="mt-10 text-center">
           <p className="text-slate-400 text-sm">
             © 2026 MultiTask Pro. All rights reserved.
           </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
