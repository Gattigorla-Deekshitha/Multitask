import React, { useEffect, useState } from 'react';
import { 
  Briefcase, 
  CheckSquare, 
  Users, 
  Clock, 
  AlertCircle,
  ArrowUpRight
} from 'lucide-react';
import { dashboardService } from '../services/api';

const StatCard = ({ title, value, icon: Icon, colorClass, gradientClass }) => (
  <div className={`p-6 rounded-3xl shadow-sm border border-white/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${gradientClass}`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl bg-white/20`}>
        <Icon size={24} className="text-white" />
      </div>
      <ArrowUpRight size={20} className="text-white/60" />
    </div>
    <div>
      <h3 className="text-white/80 font-medium text-sm mb-1">{title}</h3>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_projects: 0,
    total_tasks: 0,
    completed_tasks: 0,
    pending_tasks: 0,
    overdue_tasks: 0,
    total_members: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardService.getStats();
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Overview</h1>
        <p className="text-slate-500 mt-1">Welcome back, here's what's happening with your projects today.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total Projects" 
          value={stats.total_projects} 
          icon={Briefcase} 
          gradientClass="gradient-card-purple"
        />
        <StatCard 
          title="Total Tasks" 
          value={stats.total_tasks} 
          icon={CheckSquare} 
          gradientClass="gradient-card-blue"
        />
        <StatCard 
          title="Team Members" 
          value={stats.total_members} 
          icon={Users} 
          gradientClass="gradient-card-green"
        />
        <StatCard 
          title="Completed Tasks" 
          value={stats.completed_tasks} 
          icon={CheckSquare} 
          gradientClass="gradient-card-blue"
        />
        <StatCard 
          title="Pending Tasks" 
          value={stats.pending_tasks} 
          icon={Clock} 
          gradientClass="gradient-card-orange"
        />
        <StatCard 
          title="Overdue Tasks" 
          value={stats.overdue_tasks} 
          icon={AlertCircle} 
          gradientClass="gradient-card-orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm">
           <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Activity</h2>
           <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <CheckSquare size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-700">Task "{i === 0 ? 'Design UI' : 'Fix Bugs'}" updated</p>
                    <p className="text-xs text-slate-500">2 hours ago</p>
                  </div>
                </div>
              ))}
           </div>
        </div>
        
        <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm">
           <h2 className="text-xl font-bold text-slate-800 mb-4">Project Progress</h2>
           <div className="space-y-6">
              {['Website Redesign', 'Mobile App'].map((p, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-slate-700">{p}</span>
                    <span className="text-indigo-600 font-bold">{i === 0 ? '75%' : '40%'}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 rounded-full transition-all duration-1000" 
                      style={{ width: i === 0 ? '75%' : '40%' }}
                    ></div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
