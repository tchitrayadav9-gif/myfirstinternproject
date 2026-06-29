import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutDashboard, CheckSquare, Calendar, FolderClock, UserCircle, 
  HelpCircle, LogOut, Menu, X, ChevronLeft, ChevronRight, Sun, Moon, Bell
} from 'lucide-react';
import { notificationService } from '../services/api';

const EmployeeLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getAll();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.isRead).length);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  };

  const menuItems = [
    { name: 'Dashboard', path: '/employee-dashboard', icon: LayoutDashboard },
    { name: 'My Tasks', path: '/my-tasks', icon: CheckSquare },
    { name: 'My Schedule', path: '/my-schedule', icon: Calendar },
    { name: 'My Projects', path: '/my-projects', icon: FolderClock },
    { name: 'Profile Settings', path: '/profile', icon: UserCircle },
    { name: 'Support Desk', path: '/support', icon: HelpCircle },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300 text-slate-800 dark:text-slate-100">
      
      {/* Sidebar for Desktop */}
      <aside 
        className={`hidden md:flex flex-col bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-350 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand / Logo header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
          {!collapsed && (
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-600/10">
                E
              </div>
              <div className="text-left">
                <span className="font-bold text-slate-900 dark:text-white block text-sm tracking-wide">AVON PULSE</span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider">Associate portal</span>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 mx-auto rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
              E
            </div>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Sidebar Menu Items */}
        <nav className="flex-grow py-4 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={idx}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
                  active 
                    ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-150 dark:border-indigo-900/40 shadow-sm' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white text-slate-500'
                }`}
                title={collapsed ? item.name : ''}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom logout block */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/15 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div 
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <div className="relative flex flex-col w-64 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-350 h-full border-r border-slate-200 dark:border-slate-800 p-4 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
                    E
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-slate-900 dark:text-white block text-sm tracking-wide">AVON PULSE</span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider">Associate portal</span>
                  </div>
                </div>
                <button 
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="flex-1 space-y-1 overflow-y-auto">
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
                          ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-150 dark:border-indigo-900/40 shadow-sm' 
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white text-slate-500'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/15 transition-colors"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Content pane */}
      <div className="flex-grow flex flex-col min-w-0 overflow-x-hidden">
        
        {/* Top Header navbar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between shrink-0 shadow-sm relative z-20">
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setMobileOpen(true)}
              className="p-1.5 md:hidden hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg text-slate-500"
            >
              <Menu className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </button>
            <div className="text-left hidden sm:block">
              <span className="text-xs font-bold text-slate-900 dark:text-white tracking-wide">AVON TECH PORTAL</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-105 dark:hover:bg-slate-850 transition-colors"
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors relative focus:outline-none"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-600 text-white rounded-full text-[8px] font-extrabold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-45 py-2 text-xs text-left max-h-[350px] overflow-y-auto">
                      <div className="px-4 py-2 border-b border-slate-150 dark:border-slate-800 flex justify-between items-center">
                        <span className="font-bold text-slate-850 dark:text-slate-205">Inbox Notifications</span>
                        {unreadCount > 0 && (
                          <span className="bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded text-[9px] font-bold">
                            {unreadCount} Unread
                          </span>
                        )}
                      </div>
                      
                      <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {notifications.length > 0 ? (
                          notifications.map((notif) => (
                            <div 
                              key={notif._id || notif.id}
                              onClick={() => handleMarkAsRead(notif._id || notif.id)}
                              className={`p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                                !notif.isRead ? 'bg-indigo-50/20 dark:bg-indigo-950/10 font-medium' : ''
                              }`}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <span className={`text-[10px] font-bold ${!notif.isRead ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-305'}`}>
                                  {notif.title}
                                </span>
                                {!notif.isRead && (
                                  <span className="w-1.5 h-1.5 bg-indigo-650 rounded-full shrink-0 mt-1" />
                                )}
                              </div>
                              <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                                {notif.message}
                              </p>
                              <span className="text-[8px] text-slate-400 block mt-1.5 font-mono">
                                {new Date(notif.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="py-8 text-center text-slate-400 italic">No notifications found.</div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Vertical Divider */}
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />

            {/* Profile Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-500 text-white font-bold text-xs flex items-center justify-center">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'E'}
                </div>
                <span className="hidden md:inline text-xs font-semibold text-slate-700 dark:text-slate-300">{user?.name || 'Employee'}</span>
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowProfileMenu(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-40 py-2 text-xs">
                      <div className="px-4 py-2 border-b border-slate-150 dark:border-slate-800">
                        <span className="font-bold block text-slate-800 dark:text-slate-200 truncate">{user?.name || 'T. Chitra Yadav'}</span>
                        <span className="text-[10px] text-slate-450 block truncate">Employee Portal</span>
                      </div>
                      <Link 
                        to="/profile" 
                        onClick={() => setShowProfileMenu(false)}
                        className="block px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                      >
                        Profile Settings
                      </Link>
                      <button 
                        onClick={() => { setShowProfileMenu(false); handleLogout(); }}
                        className="w-full text-left block px-4 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-500 font-semibold"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </AnimatePresence>
            </div>

          </div>
        </header>

        {/* Content Pane */}
        <main className="flex-grow p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;
