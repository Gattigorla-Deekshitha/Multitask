import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  CheckSquare, 
  Settings, 
  Menu,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';

const Sidebar = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [showAboutModal, setShowAboutModal] = React.useState(false);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Projects', icon: Briefcase, path: '/projects' },
    { name: 'Members', icon: Users, path: '/members' },
    { name: 'Tasks', icon: CheckSquare, path: '/tasks' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside className={cn(
        "fixed left-0 top-0 h-screen bg-white border-r border-slate-200 transition-all duration-300 z-40",
        isOpen ? "w-64" : "w-20",
        !isOpen && "lg:w-20",
        "flex flex-col"
      )}>
        <div 
          onClick={() => setShowAboutModal(true)}
          className="p-6 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors group"
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform shadow-md">
            M
          </div>
          {isOpen && <span className="font-bold text-xl text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">MultiTask</span>}
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-indigo-50 text-indigo-600 font-semibold shadow-sm" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-indigo-500"
              )}
            >
              <item.icon size={22} className={cn(
                "transition-transform duration-200 group-hover:scale-110",
                "text-current"
              )} />
              {isOpen && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
           <div className={cn(
             "flex items-center gap-3 p-3 rounded-xl bg-slate-50",
             !isOpen && "justify-center"
           )}>
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                AD
              </div>
              {isOpen && (
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-700">Admin User</span>
                  <span className="text-xs text-slate-500">Super Admin</span>
                </div>
              )}
           </div>
        </div>
      </aside>

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl scale-in-center">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
                  M
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">About MultiTask</h3>
              </div>
              <button onClick={() => setShowAboutModal(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4 text-slate-600">
              <p className="font-medium text-lg text-slate-800">Your ultimate team & task management platform.</p>
              <p>MultiTask is designed to streamline your workflows, providing separate environments for Admins and Members to collaborate seamlessly.</p>
              <ul className="list-disc list-inside space-y-2 mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <li>Create and track projects & tasks</li>
                <li>Assign tasks to team members</li>
                <li>Monitor real-time status and deadlines</li>
                <li>Role-based access control (Admin & Member)</li>
              </ul>
              <div className="pt-4 border-t border-slate-100 text-sm flex justify-between items-center mt-4">
                <span>Version 1.0.0</span>
                <span className="text-indigo-600 font-semibold">© 2026 MultiTask Pro</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
