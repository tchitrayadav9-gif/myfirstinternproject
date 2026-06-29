import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Cpu, Lock, ShieldAlert, ArrowLeft, Send, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { authService } from '../services/api';
import { useToast } from '../context/ToastContext';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('New password is required.');
      return;
    }

    if (password.length < 6) {
      setError('Security password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Confirmation password does not match.');
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword(token, password, confirmPassword);
      setIsLoading(false);
      toast.success('Password updated successfully!');
      navigate('/login');
    } catch (err) {
      setIsLoading(false);
      const msg = err.response?.data?.message || 'Password reset token is invalid or has expired.';
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-sky-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Back button */}
      <div className="absolute top-8 left-8">
        <Link 
          to="/login" 
          className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Login</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="w-full max-w-md space-y-6 relative z-10"
      >
        {/* Branding Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white shadow-xl shadow-sky-500/20 mb-2">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Avon Smart Portal</h1>
          <p className="text-xs text-slate-500">Employee & Client Management Environment</p>
        </div>

        {/* Form Card */}
        <div className="glass-panel border border-slate-800 rounded-3xl p-6 md:p-8 text-left shadow-2xl relative">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white">Reset Password</h2>
            <p className="text-xs text-slate-400 mt-1">Please type a new, secure security key for your account credentials.</p>
          </div>

          {error && (
            <div className="mb-4 p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-405 rounded-xl text-xs flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* New Password input */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider" htmlFor="password">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new security key..."
                  className="w-full bg-slate-950/80 border border-slate-850 hover:border-slate-800 focus:border-sky-500/50 text-xs text-slate-200 pl-10 pr-10 py-3 rounded-xl focus:outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-350 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password input */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider" htmlFor="confirmPassword">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Verify new security key..."
                  className="w-full bg-slate-950/80 border border-slate-850 hover:border-slate-800 focus:border-sky-500/50 text-xs text-slate-200 pl-10 pr-10 py-3 rounded-xl focus:outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-350 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-sky-600 hover:bg-sky-550 disabled:bg-slate-800 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 text-xs uppercase tracking-wider mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Update Password</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>            
          </form>
        </div>

        {/* Footer info */}
        <p className="text-[10px] text-slate-650 text-center">
          Protected by Avon Technologies Security Shield &copy; {new Date().getFullYear()}
        </p>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
