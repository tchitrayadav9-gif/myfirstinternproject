import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Mail, ShieldAlert, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { authService } from '../services/api';
import { useToast } from '../context/ToastContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState('');
  const toast = useToast();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Corporate email is required.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await authService.forgotPassword(email);
      setIsLoading(false);
      setIsSent(true);
      toast.success('Password reset email sent successfully!');

      if (res.devMode && res.resetUrl) {
        setDevResetUrl(res.resetUrl);
      }
    } catch (err) {
      setIsLoading(false);
      const msg = err.response?.data?.message || 'Server connection failed.';
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
            <h2 className="text-lg font-bold text-white">Forgot Password</h2>
            <p className="text-xs text-slate-400 mt-1">Enter your registered email below to receive a secure password reset link.</p>
          </div>

          {error && (
            <div className="mb-4 p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-405 rounded-xl text-xs flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!isSent ? (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Email input */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider" htmlFor="email">Corporate Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input 
                    type="email" 
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. employee@avon.co.in"
                    className="w-full bg-slate-950/80 border border-slate-850 hover:border-slate-800 focus:border-sky-500/50 text-xs text-slate-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none transition-all"
                    required
                  />
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
                    <span>Send Reset Link</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>            
            </form>
          ) : (
            <div className="space-y-4 text-center py-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white">Reset Link Dispatched</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                If the email address exists in our directory, a secure credentials reset token will arrive shortly. Please check your inbox and follow the reset button instructions.
              </p>

              {devResetUrl && (
                <div className="mt-6 p-4 bg-indigo-950/40 border border-indigo-800/40 rounded-xl text-left space-y-2">
                  <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider block">Dev / Sandbox Mode Link:</span>
                  <a href={devResetUrl} className="text-xs text-sky-400 hover:underline break-all block">
                    {devResetUrl}
                  </a>
                  <p className="text-[9px] text-slate-500">Note: This helper box is only visible because SMTP config parameters are not fully declared in `.env` variables.</p>
                </div>
              )}

              <Link 
                to="/login"
                className="inline-block mt-4 text-xs font-bold text-sky-450 hover:underline"
              >
                Back to Login Page
              </Link>
            </div>
          )}
        </div>

        {/* Footer info */}
        <p className="text-[10px] text-slate-650 text-center">
          Protected by Avon Technologies Security Shield &copy; {new Date().getFullYear()}
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
