import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  User, Shield, Moon, Sun, Bell, ShieldAlert, CheckCircle2 
} from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [profileData, setProfileData] = useState({
    name: user?.name || 'Admin User',
    email: user?.email || 'admin@avon.co.in'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    sprintProgress: true,
    newTickets: true,
    weeklyDigest: false
  });

  const [status, setStatus] = useState({ type: '', message: '' });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setStatus({ type: 'success', message: 'Profile details updated locally.' });
    setTimeout(() => setStatus({ type: '', message: '' }), 3000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setStatus({ type: 'error', message: 'New passwords do not match.' });
      return;
    }
    setStatus({ type: 'success', message: 'Password updated successfully.' });
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setStatus({ type: '', message: '' }), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm text-left">
        <span className="text-[10px] text-[#1E40AF] dark:text-cyan-400 font-bold uppercase tracking-wider block">Avon Dashboard Settings</span>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">System Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Update profile information, modify passwords, and customize dashboard theme and metrics toggles.</p>
      </div>

      {status.message && (
        <div className={`p-4 rounded-xl text-xs font-semibold text-left flex items-center space-x-1.5 shadow border ${
          status.type === 'success' 
            ? 'bg-emerald-50 border-emerald-250 text-emerald-650 dark:bg-slate-900' 
            : 'bg-rose-50 border-rose-250 text-rose-650 dark:bg-slate-900'
        }`}>
          {status.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <ShieldAlert className="w-4 h-4 text-rose-500" />}
          <span>{status.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        
        {/* Left Side: Profile & Password */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Profile Form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center space-x-1.5 pb-2 border-b border-slate-100 dark:border-slate-805">
              <User className="w-4 h-4 text-[#1E40AF]" />
              <span>Modify Profile Details</span>
            </h3>
            <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Full Name</label>
                <input 
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-205 dark:border-slate-850 p-2.5 rounded-xl focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Corporate Email</label>
                <input 
                  type="email"
                  disabled
                  value={profileData.email}
                  className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-slate-500 cursor-not-allowed font-semibold"
                />
              </div>
              <div className="md:col-span-2 pt-2">
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#1E40AF] hover:bg-[#1E40AF]/90 text-white font-bold rounded-xl transition-all shadow-md"
                >
                  Save Profile Modifications
                </button>
              </div>
            </form>
          </div>

          {/* Password modifier */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center space-x-1.5 pb-2 border-b border-slate-100 dark:border-slate-805">
              <Shield className="w-4 h-4 text-rose-500" />
              <span>Update Credentials</span>
            </h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Current Password</label>
                <input 
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full bg-[#F8FAFC] dark:bg-slate-955 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">New Password</label>
                  <input 
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Confirm New Password</label>
                  <input 
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-550 text-white font-bold rounded-xl transition-all shadow-md"
              >
                Update Password Key
              </button>
            </form>
          </div>

        </div>

        {/* Right Side: Theme Toggling & Notifications */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Theme setting card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 pb-2 border-b border-slate-100 dark:border-slate-805">Theme Customization</h3>
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-400">Current Theme State</span>
              <button 
                onClick={toggleTheme}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-white rounded-xl font-bold flex items-center space-x-1.5 shadow-sm transition-colors"
              >
                {theme === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                <span className="capitalize">{theme} Mode</span>
              </button>
            </div>
          </div>

          {/* Notifications toggles */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 pb-2 border-b border-slate-100 dark:border-slate-805 flex items-center space-x-1.5">
              <Bell className="w-4 h-4 text-[#06B6D4]" />
              <span>Email Notifications</span>
            </h3>
            <div className="space-y-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-slate-800 dark:text-slate-200">Sprint Progress Updates</span>
                  <span className="text-[10px] text-slate-450 font-normal">Receive logs on project Kanban updates.</span>
                </div>
                <input 
                  type="checkbox"
                  checked={notifications.sprintProgress}
                  onChange={(e) => setNotifications({ ...notifications, sprintProgress: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500/40 bg-slate-50 border-slate-300 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-slate-800 dark:text-slate-200">New Support Tickets</span>
                  <span className="text-[10px] text-slate-450 font-normal">Notify when employees submit tickets.</span>
                </div>
                <input 
                  type="checkbox"
                  checked={notifications.newTickets}
                  onChange={(e) => setNotifications({ ...notifications, newTickets: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500/40 bg-slate-50 border-slate-300 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-slate-800 dark:text-slate-200">Weekly System Digest</span>
                  <span className="text-[10px] text-slate-450 font-normal">Send automated performance summaries.</span>
                </div>
                <input 
                  type="checkbox"
                  checked={notifications.weeklyDigest}
                  onChange={(e) => setNotifications({ ...notifications, weeklyDigest: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500/40 bg-slate-50 border-slate-300 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Settings;
