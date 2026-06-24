import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Cpu, Mail, Lock, ShieldAlert, ArrowLeft, Send, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Corporate email is required.');
      return;
    }

    if (!password) {
      setError('Portal password is required.');
      return;
    }

    setIsLoggingIn(true);
    
    try {
      const response = await login(email, password);
      setIsLoggingIn(false);
      
      if (response.success) {
        if (rememberMe) {
          localStorage.setItem('avon_remember_email', email);
          localStorage.setItem('avon_remember_password', password);
        } else {
          localStorage.removeItem('avon_remember_email');
          localStorage.removeItem('avon_remember_password');
        }

        // Redirect based on role
        if (response.role === 'Admin') {
          navigate('/dashboard');
        } else {
          navigate('/employee-dashboard');
        }
      } else {
        setError(response.message);
      }
    } catch (err) {
      setIsLoggingIn(false);
      setError('Server connection failed. Make sure the backend API is running.');
    }
  };





  // Pre-fill remember me email & password
  React.useEffect(() => {
    const savedEmail = localStorage.getItem('avon_remember_email');
    const savedPassword = localStorage.getItem('avon_remember_password');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
    if (savedPassword) {
      setPassword(savedPassword);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-sky-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Back button */}
      <div className="absolute top-8 left-8">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Main Site</span>
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

        {/* Login Card */}
        <div className="glass-panel border border-slate-800 rounded-3xl p-6 md:p-8 text-left shadow-2xl relative">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white">System Authentication</h2>
            <p className="text-xs text-slate-400 mt-1">Sign in with your corporate portal credentials.</p>
          </div>

          {error && (
            <div className="mb-4 p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-405 rounded-xl text-xs flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

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

            {/* Password input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider" htmlFor="password">Security Password</label>
                <a href="#" className="text-[10px] text-sky-400 hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input 
                  type="password" 
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter security key..."
                  className="w-full bg-slate-950/80 border border-slate-850 hover:border-slate-800 focus:border-sky-500/50 text-xs text-slate-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Remember Credentials */}
            <div className="flex items-center justify-between py-1 text-xs">
              <label className="flex items-center space-x-2 text-slate-350 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-850 text-sky-500/50"
                />
                <span>Remember Credentials</span>
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-sky-600 hover:bg-sky-550 disabled:bg-slate-800 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 text-xs uppercase tracking-wider mt-2"
            >
              {isLoggingIn ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>            
          </form>



          {/* Redirect to Register */}
          <div className="mt-4 text-center">
            <span className="text-xs text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-sky-450 font-bold hover:underline">
                Sign Up
              </Link>
            </span>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-[10px] text-slate-650 text-center">
          Protected by Avon Technologies Security Shield &copy; {new Date().getFullYear()}
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
