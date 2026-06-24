import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Cpu, Mail, Lock, ShieldAlert, ArrowLeft, Send, User, Award, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Employee');
  const [error, setError] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Full name is required.');
      return;
    }
    if (name.trim().length < 3) {
      setError('Name must be at least 3 characters.');
      return;
    }

    if (!email) {
      setError('Corporate email is required.');
      return;
    }

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setError('Please enter a valid email format.');
      return;
    }

    if (!password) {
      setError('Password is required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSigningUp(true);
    
    try {
      const response = await register(name, email, password, role);
      setIsSigningUp(false);
      
      if (response.success) {
        localStorage.setItem('avon_remember_email', email);
        localStorage.setItem('avon_remember_password', password);
        if (response.role === 'Admin') {
          navigate('/dashboard');
        } else {
          navigate('/employee-dashboard');
        }
      } else {
        setError(response.message);
      }
    } catch (err) {
      setIsSigningUp(false);
      setError('Server connection failed. Make sure the backend API is running.');
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
          <p className="text-xs text-slate-500">Create your corporate portal account</p>
        </div>

        {/* Signup Card */}
        <div className="glass-panel border border-slate-800 rounded-3xl p-6 md:p-8 text-left shadow-2xl relative">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-white">Sign Up</h2>
              <p className="text-xs text-slate-400 mt-1">Register as Admin or Staff Employee.</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-405 rounded-xl text-xs flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* Name input */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. T. Chitra Yadav"
                  className="w-full bg-slate-950/80 border border-slate-850 hover:border-slate-800 focus:border-sky-500/50 text-xs text-slate-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Email input */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Corporate Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. name@avon.co.in"
                  className="w-full bg-slate-950/80 border border-slate-850 hover:border-slate-800 focus:border-sky-500/50 text-xs text-slate-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Role input */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Corporate Role Selection</label>
              <div className="relative">
                <Award className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-850 hover:border-slate-800 focus:border-sky-500/50 text-xs text-slate-200 pl-10 pr-10 py-3 rounded-xl focus:outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="Employee" className="bg-slate-950 text-slate-200">Staff Employee (CSE - AIML, etc.)</option>
                  <option value="Admin" className="bg-slate-950 text-slate-200">Portal Administrator</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>

            {/* Password input */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/80 border border-slate-850 hover:border-slate-800 focus:border-sky-500/50 text-xs text-slate-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Confirm</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/80 border border-slate-850 hover:border-slate-800 focus:border-sky-500/50 text-xs text-slate-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSigningUp}
              className="w-full py-3 bg-sky-600 hover:bg-sky-550 disabled:bg-slate-800 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 text-xs uppercase tracking-wider mt-4"
            >
              {isSigningUp ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>


          </form>

          {/* Redirect to Login */}
          <div className="mt-6 border-t border-slate-800/80 pt-4 text-center">
            <span className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-sky-450 font-bold hover:underline">
                Login
              </Link>
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
