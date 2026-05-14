import React, { useEffect, useState } from 'react';
import { 
  Briefcase, 
  CheckSquare, 
  Users, 
  Clock, 
  AlertCircle,
  ArrowUpRight,
  TrendingUp,
  Activity,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/api';

const StatCard = ({ title, value, icon: Icon, trend, gradientClass, onClick }) => (
  <div 
    onClick={onClick}
    className={`relative overflow-hidden p-7 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/20 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer group ${gradientClass}`}
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
    
    <div className="relative z-10 flex justify-between items-start mb-6">
      <div className={`p-3.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/10 shadow-sm group-hover:scale-110 transition-transform duration-500`}>
        <Icon size={24} className="text-white drop-shadow-sm" />
      </div>
      <div className="p-2 bg-white/10 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
         <ArrowUpRight size={18} className="text-white" />
      </div>
    </div>
    <div className="relative z-10">
      <h3 className="text-white/90 font-medium text-sm mb-1.5 tracking-wide">{title}</h3>
      <div className="flex items-end gap-3">
        <p className="text-4xl font-extrabold text-white tracking-tight">{value}</p>
        {trend && (
          <span className="text-white/90 text-xs font-bold mb-1.5 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1">
            <TrendingUp size={12} /> {trend}
          </span>
        )}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_projects: 0,
    total_tasks: 0,
    completed_tasks: 0,
    pending_tasks: 0,
    overdue_tasks: 0,
    total_members: 0,
    recent_activities: [],
    projects_progress: [],
  });
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  
  let user = null;
  try {
    const userStr = localStorage.getItem('user');
    if (userStr && userStr !== 'undefined') {
      user = JSON.parse(userStr);
    }
  } catch (e) {
    console.error('Error parsing user', e);
  }
  const isAdmin = user?.role === 'Admin';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardService.getStats(isAdmin ? null : user?.id);
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [isAdmin, user?.id]);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            {isAdmin ? "Admin Dashboard" : `${user?.name || "Member"} Dashboard`}
          </h1>
          <p className="text-slate-500 font-medium">Here's what's happening with your projects today.</p>
        </div>
        <button 
          onClick={() => setShowReportModal(true)}
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-slate-50 transition-all hover:shadow-md active:scale-95"
        >
          <Activity size={18} className="text-indigo-600" />
          Generate Report
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isAdmin && (
          <>
            <StatCard 
              title="Total Projects" 
              value={stats.total_projects} 
              icon={Briefcase} 
              trend="+12%"
              gradientClass="bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 text-white"
              onClick={() => navigate('/projects')}
            />
            <StatCard 
              title="Team Members" 
              value={stats.total_members} 
              icon={Users} 
              trend="New"
              gradientClass="bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 text-white"
              onClick={() => navigate('/members')}
            />
          </>
        )}
        <StatCard 
          title="Total Tasks" 
          value={stats.total_tasks} 
          icon={CheckSquare} 
          trend="+5%"
          gradientClass="bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-400 text-white"
          onClick={() => navigate('/tasks')}
        />
        <StatCard 
          title="Completed Tasks" 
          value={stats.completed_tasks} 
          icon={CheckSquare} 
          gradientClass="bg-gradient-to-br from-blue-400 to-indigo-500 text-white"
          onClick={() => navigate('/tasks')}
        />
        <StatCard 
          title="Pending Tasks" 
          value={stats.pending_tasks} 
          icon={Clock} 
          gradientClass="bg-gradient-to-br from-amber-400 to-orange-500 text-white"
          onClick={() => navigate('/tasks')}
        />
        <StatCard 
          title="Overdue Tasks" 
          value={stats.overdue_tasks} 
          icon={AlertCircle} 
          gradientClass="bg-gradient-to-br from-rose-400 to-red-600 text-white"
          onClick={() => navigate('/tasks')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-shadow duration-500">
           <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-extrabold text-slate-800">Recent Activity</h2>
              <button 
                onClick={() => setShowActivityModal(true)}
                className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                View All
              </button>
           </div>
           <div className="space-y-5">
              {(stats.recent_activities || []).length > 0 ? stats.recent_activities.map((activity, i) => (
                <div key={i} className="flex items-center gap-5 p-4 rounded-2xl hover:bg-slate-50/80 transition-all border border-transparent hover:border-slate-100 cursor-pointer group">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    <CheckSquare size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800 mb-0.5 group-hover:text-indigo-600 transition-colors">{activity.title}</p>
                    <p className="text-xs font-medium text-slate-400">Deadline: {new Date(activity.time).toLocaleDateString()}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                    <ArrowUpRight size={16} className="text-slate-500" />
                  </div>
                </div>
              )) : (
                <p className="text-center text-slate-400 py-10 font-medium">No recent activity found.</p>
              )}
           </div>
        </div>
        
        <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-shadow duration-500">
           <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-extrabold text-slate-800">Project Progress</h2>
              <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <Briefcase size={20} className="text-slate-400" />
              </button>
           </div>
           <div className="space-y-8">
              {(stats.projects_progress || []).length > 0 ? stats.projects_progress.map((p, i) => (
                <div key={i} className="space-y-3 group">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="block font-bold text-slate-800 text-sm mb-1">{p.name}</span>
                      <span className="text-xs font-medium text-slate-400">Due {new Date(p.deadline).toLocaleDateString()}</span>
                    </div>
                    <span className="text-indigo-600 font-extrabold text-lg">{p.progress}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 relative" 
                      style={{ width: `${p.progress}%` }}
                    >
                      <div className="absolute top-0 right-0 bottom-0 w-8 bg-white/20 -skew-x-12 translate-x-4 animate-[shimmer_2s_infinite]"></div>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-center text-slate-400 py-10 font-medium">No projects in progress.</p>
              )}
           </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl scale-in-center">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-slate-800">Performance Report</h3>
              <button onClick={() => setShowReportModal(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-slate-600">Here is your generated performance report for {new Date().toLocaleDateString()}.</p>
              <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                <p className="text-indigo-800 font-medium">Completion Rate: <strong>84%</strong></p>
                <p className="text-indigo-800 font-medium mt-2">Team Efficiency: <strong>High</strong></p>
              </div>
              <button onClick={() => setShowReportModal(false)} className="w-full mt-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity Modal */}
      {showActivityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl scale-in-center">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-slate-800">All Recent Activities</h3>
              <button onClick={() => setShowActivityModal(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
               {[1, 2, 3, 4, 5, 6].map((_, i) => (
                 <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                   <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                     <Activity size={18} />
                   </div>
                   <div>
                     <p className="text-sm font-bold text-slate-800">System Log #{i + 102}</p>
                     <p className="text-xs text-slate-500">Recorded {i * 2} hours ago</p>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
