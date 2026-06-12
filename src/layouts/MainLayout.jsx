import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Menu, X, Cpu, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-sky-500 selection:text-white">
      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-slate-900/80 backdrop-blur-md border-b border-slate-800 shadow-lg py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:shadow-sky-500/40 transition-all">
                <Cpu className="w-5.5 h-5.5 animate-pulse" />
              </div>
              <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-sky-400 group-hover:to-sky-300 transition-colors">
                Avon Technologies
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors hover:text-sky-400 relative py-1 ${
                      isActive ? 'text-sky-400' : 'text-slate-300'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.name}
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute -bottom-1 left-0 w-full h-0.5 bg-sky-500 rounded-full"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 text-sm font-medium text-white bg-slate-900 border border-slate-700 hover:border-sky-500/50 hover:bg-slate-800 rounded-xl transition-all shadow-md glow-card-hover"
                  >
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-sky-500/25 hover:shadow-sky-500/35 transition-all transform hover:-translate-y-0.5"
                >
                  Client Portal
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-300 hover:text-white p-2 focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3"
            >
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block py-2 px-3 rounded-lg text-base font-medium transition-colors ${
                      isActive ? 'bg-sky-500/10 text-sky-400 border-l-2 border-sky-500' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
              <div className="pt-4 border-t border-slate-800 flex flex-col space-y-3">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full text-center py-2.5 rounded-lg text-sm font-medium text-white bg-sky-600 hover:bg-sky-500 transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                        navigate('/');
                      }}
                      className="w-full text-center py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 transition-all shadow-md"
                  >
                    Client Portal Login
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow pt-24">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
            {/* Column 1: Company Profile */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white">
                  <Cpu className="w-4.5 h-4.5" />
                </div>
                <span className="font-bold text-white tracking-tight">
                  Avon Technologies
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">
                Leading software solutions provider specialized in scalable web applications, enterprise client portals, cloud architecture, and automation.
              </p>
              <div className="flex space-x-4 pt-2">
                <a href="#" className="hover:text-sky-400 transition-colors" aria-label="Twitter">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href="#" className="hover:text-sky-450 transition-colors" aria-label="LinkedIn">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
                  </svg>
                </a>
                <a href="#" className="hover:text-sky-450 transition-colors" aria-label="GitHub">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-sky-400 transition-colors">Home</Link></li>
                <li><Link to="/services" className="hover:text-sky-400 transition-colors">Services</Link></li>
                <li><Link to="/about" className="hover:text-sky-400 transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-sky-400 transition-colors">Contact Support</Link></li>
                <li><Link to="/login" className="hover:text-sky-400 transition-colors">Employee Portal</Link></li>
              </ul>
            </div>

            {/* Column 3: Corporate Services */}
            <div>
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Company Services</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/services" className="hover:text-sky-400 transition-colors">Web Development</Link></li>
                <li><Link to="/services" className="hover:text-sky-400 transition-colors">Mobile App Engineering</Link></li>
                <li><Link to="/services" className="hover:text-sky-400 transition-colors">AI & Analytics Solutions</Link></li>
                <li><Link to="/services" className="hover:text-sky-400 transition-colors">Cloud Migrations</Link></li>
                <li><Link to="/services" className="hover:text-sky-400 transition-colors">UI/UX Strategy</Link></li>
              </ul>
            </div>

            {/* Column 4: Contact Details */}
            <div className="space-y-3">
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Corporate Office</h3>
              <div className="flex items-start space-x-2 text-sm">
                <MapPin className="w-4 h-4 text-sky-500 mt-1 shrink-0" />
                <span>SR Nagar, Hyderabad, Telangana, 500038</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4 text-sky-500 shrink-0" />
                <span>+91 40 4827 9102</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4 text-sky-500 shrink-0" />
                <span>support@avontechnologies.co.in</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-900 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} Avon Technologies (India) Pvt. Ltd. All rights reserved.</p>
            <p className="mt-4 md:mt-0 flex items-center space-x-1">
              <span>Made for Employee & Client Operations Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
