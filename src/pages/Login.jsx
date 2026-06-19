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
  const [googleRole, setGoogleRole] = useState('Employee');
  
  const { login, loginWithGoogle } = useAuth();
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
        } else {
          localStorage.removeItem('avon_remember_email');
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

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoggingIn(true);
    try {
      // Sign in via Google using selected role
      const response = await loginWithGoogle(googleRole);
      setIsLoggingIn(false);
      
      if (response.success) {
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
      setError('Google Sign-In failed.');
    }
  };



  // Pre-fill remember me email
  React.useEffect(() => {
    const savedEmail = localStorage.getItem('avon_remember_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
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

            {/* Remember Me */}
            <div className="flex items-center justify-between py-1 text-xs">
              <label className="flex items-center space-x-2 text-slate-350 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-sky-500 focus:ring-sky-500/30"
                />
                <span>Remember Email</span>
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

            {/* Google Role Selector */}
            <div className="pt-2 flex flex-col space-y-1.5">
              <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider text-center">Google Role for New Signups</label>
              <div className="relative">
                <select
                  value={googleRole}
                  onChange={(e) => setGoogleRole(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-850 hover:border-slate-800 text-[10px] text-slate-300 py-2 px-3 pr-8 rounded-lg focus:outline-none transition-all cursor-pointer text-center appearance-none"
                >
                  <option value="Employee" className="bg-slate-950 text-slate-200">Staff Employee (No data for new signups)</option>
                  <option value="Admin" className="bg-slate-950 text-slate-200">Portal Administrator (Simulated data & charts)</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
              </div>
            </div>

            {/* Google Login button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className="w-full py-3 bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-200 text-xs font-semibold rounded-xl shadow transition-all flex items-center justify-center space-x-2.5 mt-2"
            >
              {/* Google SVG Icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
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
