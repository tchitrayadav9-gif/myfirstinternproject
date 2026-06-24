import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutDashboard, Users, CheckSquare, Calendar, FolderOpen, 
  Briefcase, BarChart3, HelpCircle, Settings, LogOut, Menu, X, 
  ChevronLeft, ChevronRight, Sun, Moon, Bell, ShieldAlert,
  Check, Trash2, Clock
} from 'lucide-react';
import { contactService } from '../services/api';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchNotifications = async () => {
    try {
      const data = await contactService.getAll();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load contact messages:', err);
    }
  };

  useEffect(() => {
    if (user && user.role?.toLowerCase() === 'admin') {
      fetchNotifications();
      // Poll every 30 seconds for new messages
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleMarkAsRead = async (id) => {
    try {
      await contactService.markAsRead(id);
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await contactService.delete(id);
      fetchNotifications();
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const unread = notifications.filter(n => n.status === 'Unread');
      await Promise.all(unread.map(n => contactService.markAsRead(n._id || n.id)));
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  const unreadCount = notifications.filter(n => n.status === 'Unread').length;

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Employees', path: '/employees', icon: Users },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Monthly Schedule', path: '/schedule', icon: Calendar },
    { name: 'Clients', path: '/clients', icon: FolderOpen },
    { name: 'Projects', path: '/projects', icon: Briefcase },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Support Tickets', path: '/support', icon: HelpCircle },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#F8FAFC] light:bg-[#F8FAFC] dark:bg-slate-950 flex transition-colors duration-300 text-slate-800 dark:text-slate-100">
      
      {/* Sidebar for Desktop */}
      <aside 
        className={`hidden md:flex flex-col bg-[#0F172A] text-slate-300 border-r border-slate-800 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand / Logo header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          {!collapsed && (
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20">
                A
              </div>
              <div className="text-left">
                <span className="font-bold text-white block text-sm tracking-wide">AVON PORTAL</span>
                <span className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider">Administrator</span>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 mx-auto rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-white shadow-md">
              A
            </div>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Sidebar Menu Items */}
        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={idx}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
                  active 
                    ? 'bg-[#1E40AF] text-white shadow-md shadow-blue-800/35 border-l-4 border-cyan-400' 
                    : 'hover:bg-slate-800/50 hover:text-white text-slate-400'
                }`}
                title={collapsed ? item.name : ''}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-cyan-400' : 'text-slate-400 group-hover:text-white'}`} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom logout block */}
        <div className="p-3 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-350 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Logout Account</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            {/* Backdrop */}
            <div 
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            {/* Sidebar drawer */}
            <div className="relative flex flex-col w-64 bg-[#0F172A] text-slate-300 h-full border-r border-slate-800 p-4 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-white shadow-md">
                    A
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-white block text-sm tracking-wide">AVON PORTAL</span>
                    <span className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider">Administrator</span>
                  </div>
                </div>
                <button 
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-850 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="flex-1 space-y-1.5 overflow-y-auto">
                {menuItems.map((item, idx) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={idx}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
                        active 
                          ? 'bg-[#1E40AF] text-white shadow-md shadow-blue-800/35 border-l-4 border-cyan-400' 
                          : 'hover:bg-slate-800/50 hover:text-white text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-slate-850">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>Logout Account</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Content Area wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* Top Header navbar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between shrink-0 shadow-sm relative z-20">
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setMobileOpen(true)}
              className="p-1.5 md:hidden hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block text-left">
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider block">Avon Technologies</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">Smart Portal Gateway</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-700 dark:hover:text-white transition-colors"
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification alert */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-700 dark:hover:text-white transition-colors relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 px-1 min-w-[14px] h-3.5 rounded-full bg-rose-600 text-[8px] font-extrabold text-white flex items-center justify-center border border-white dark:border-slate-900 animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-40 py-3 text-xs overflow-hidden">
                      <div className="px-4 pb-2.5 border-b border-slate-150 dark:border-slate-800 flex justify-between items-center">
                        <span className="font-extrabold text-slate-900 dark:text-white flex items-center space-x-1.5">
                          <span>Contact Submissions</span>
                          {unreadCount > 0 && (
                            <span className="px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-[9px] font-black">
                              {unreadCount} NEW
                            </span>
                          )}
                        </span>
                        {unreadCount > 0 && (
                          <button 
                            onClick={handleMarkAllRead}
                            className="text-[10px] text-blue-600 dark:text-cyan-400 font-bold hover:underline"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                        {notifications.length > 0 ? (
                          notifications.map((notif) => {
                            const notifId = notif._id || notif.id;
                            const isUnread = notif.status === 'Unread';
                            return (
                              <div 
                                key={notifId} 
                                className={`p-4 flex flex-col space-y-1.5 transition-colors text-left hover:bg-slate-50 dark:hover:bg-slate-850/30 ${
                                  isUnread ? 'bg-blue-50/15 dark:bg-cyan-500/5' : ''
                                }`}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <span className="font-bold text-slate-900 dark:text-white">{notif.name}</span>
                                    <span className="text-[10px] text-slate-550 ml-1.5">({notif.email})</span>
                                  </div>
                                  <div className="flex items-center space-x-1 shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                                    {isUnread && (
                                      <button 
                                        onClick={() => handleMarkAsRead(notifId)}
                                        className="p-1 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded transition-colors"
                                        title="Mark as Read"
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                    <button 
                                      onClick={() => handleDeleteNotification(notifId)}
                                      className="p-1 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-500 rounded transition-colors"
                                      title="Delete Message"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                                
                                <div className="text-slate-705 dark:text-slate-300 font-semibold text-[11px]">
                                  {notif.subject}
                                </div>
                                
                                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed break-words font-medium">
                                  {notif.message}
                                </p>
                                
                                <div className="flex justify-between items-center text-[9px] text-slate-400 dark:text-slate-500 font-mono mt-1">
                                  <span className="flex items-center space-x-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{new Date(notif.date).toLocaleString()}</span>
                                  </span>
                                  {isUnread && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="py-8 text-center text-slate-500 italic">
                            No contact messages received.
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Vertical Divider */}
            <div className="w-px h-6 bg-slate-200 dark:border-slate-800" />

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2.5 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-blue-500/10">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="hidden md:block text-left">
                  <span className="text-xs font-bold block leading-none">{user?.name || 'Admin'}</span>
                  <span className="text-[9px] text-slate-400 block mt-1">{user?.email || 'admin@avon.co.in'}</span>
                </div>
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowProfileMenu(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-40 py-2 text-xs">
                      <div className="px-4 py-2 border-b border-slate-150 dark:border-slate-800">
                        <span className="font-bold block text-slate-800 dark:text-slate-200 truncate">{user?.name || 'Administrator'}</span>
                        <span className="text-[10px] text-slate-400 block truncate">{user?.role || 'Admin'}</span>
                      </div>
                      <Link 
                        to="/settings" 
                        onClick={() => setShowProfileMenu(false)}
                        className="block px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                      >
                        Profile Settings
                      </Link>
                      <button 
                        onClick={() => { setShowProfileMenu(false); handleLogout(); }}
                        className="w-full text-left block px-4 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-500 font-semibold"
                      >
                        Logout Account
                      </button>
                    </div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Main Content Pane */}
        <main className="flex-grow p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
