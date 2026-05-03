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
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
            M
          </div>
          {isOpen && <span className="font-bold text-xl text-slate-800 tracking-tight">MultiTask</span>}
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
    </>
  );
};

export default Sidebar;
