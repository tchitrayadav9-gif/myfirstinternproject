import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';
import { 
  User, Shield, Camera, CheckCircle2, ShieldAlert 
} from 'lucide-react';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Employee Name',
    email: user?.email || 'employee@avon.co.in'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [profileImg, setProfileImg] = useState(user?.avatarUrl || null);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'info', message: 'Updating profile...' });
    try {
      const updatedUser = await authService.updateProfile(profileData.name, profileImg);
      updateUserProfile({ name: updatedUser.name, avatarUrl: updatedUser.avatarUrl });
      setStatus({ type: 'success', message: 'Profile details saved in MongoDB database.' });
    } catch (err) {
      console.error('Profile update error:', err);
      setStatus({ type: 'error', message: err.response?.data?.message || 'Server error updating profile details.' });
    }
    setTimeout(() => setStatus({ type: '', message: '' }), 4000);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setStatus({ type: 'error', message: 'New passwords do not match.' });
      return;
    }
    setStatus({ type: 'info', message: 'Changing password...' });
    try {
      await authService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setStatus({ type: 'success', message: 'Password updated successfully in database.' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Password update error:', err);
      setStatus({ type: 'error', message: err.response?.data?.message || 'Server error changing password.' });
    }
    setTimeout(() => setStatus({ type: '', message: '' }), 4000);
  };

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setStatus({ type: 'info', message: 'Uploading profile image...' });
      
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        // Load configurations (fallbacks to demo environment for easy testing)
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo';
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset';
        
        formData.append('upload_preset', uploadPreset);

        const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);
        const secureUrl = res.data.secure_url;

        // Save URL in database
        const updatedUser = await authService.updateProfile(profileData.name, secureUrl);
        updateUserProfile({ avatarUrl: secureUrl });
        setProfileImg(secureUrl);
        setStatus({ type: 'success', message: 'Profile picture uploaded and saved successfully!' });
      } catch (err) {
        console.warn('Cloudinary upload failed, using local fallback:', err);
        // Fallback: If Cloudinary preset is not configured, generate a local URL so the app continues to work cleanly
        const localImgUrl = URL.createObjectURL(file);
        try {
          await authService.updateProfile(profileData.name, localImgUrl);
          updateUserProfile({ avatarUrl: localImgUrl });
          setProfileImg(localImgUrl);
          setStatus({ type: 'success', message: 'Profile image updated (Cloudinary preset invalid, using local preview).' });
        } catch (innerErr) {
          setStatus({ type: 'error', message: 'Failed to update profile picture.' });
        }
      }
      setTimeout(() => setStatus({ type: '', message: '' }), 4000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm text-left">
        <span className="text-[10px] text-indigo-650 dark:text-indigo-400 font-bold uppercase tracking-wider block">Avon Profile portal</span>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">My Profile</h1>
        <p className="text-xs text-slate-500 mt-1">Update profile information, upload profile avatars, and modify system credentials.</p>
      </div>

      {status.message && (
        <div className={`p-4 rounded-xl text-xs font-semibold text-left flex items-center space-x-1.5 shadow border ${
          status.type === 'success' 
            ? 'bg-emerald-50 border-emerald-250 text-emerald-650 dark:bg-slate-900' 
            : status.type === 'info'
            ? 'bg-sky-50 border-sky-250 text-sky-655 dark:bg-slate-900'
            : 'bg-rose-50 border-rose-250 text-rose-650 dark:bg-slate-900'
        }`}>
          {status.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          ) : status.type === 'info' ? (
            <div className="w-4 h-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          )}
          <span>{status.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        
        {/* Left Side: Avatar uploader */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col items-center justify-center space-y-4">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-slate-100 border-2 border-indigo-500/10 flex items-center justify-center shadow-lg relative">
              {profileImg ? (
                <img src={profileImg} alt="Profile Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="text-2xl font-bold text-slate-500 dark:text-slate-400 select-none">
                  {profileData.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 p-2 bg-indigo-600 hover:bg-indigo-555 text-white rounded-full cursor-pointer shadow-md transition-colors">
              <Camera className="w-4 h-4" />
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
          <div className="text-center">
            <span className="font-extrabold block text-slate-800 dark:text-white">{profileData.name}</span>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider block mt-1">Avon Associate</span>
          </div>
        </div>

        {/* Right Side: Forms */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Info Form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center space-x-1.5 pb-2 border-b border-slate-100 dark:border-slate-805">
              <User className="w-4 h-4 text-indigo-600" />
              <span>Personal Details</span>
            </h3>
            <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Full Name</label>
                <input 
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-505 font-bold uppercase tracking-wider">Corporate Email</label>
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
                  className="px-4 py-2 bg-indigo-650 hover:bg-indigo-550 text-white font-bold rounded-xl transition-all shadow-md"
                >
                  Save Profile Modifications
                </button>
              </div>
            </form>
          </div>

          {/* Password modifier */}
          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center space-x-1.5 pb-2 border-b border-slate-100 dark:border-slate-805">
              <Shield className="w-4 h-4 text-rose-500" />
              <span>Update Credentials</span>
            </h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-550 font-bold uppercase tracking-wider">Current Password</label>
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
                    className="w-full bg-[#F8FAFC] dark:bg-slate-955 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="px-4 py-2 bg-rose-650 hover:bg-rose-550 text-white font-bold rounded-xl transition-all shadow-md"
              >
                Update Password Key
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Profile;
