import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Users, Briefcase, Award, Zap, Shield, Sparkles, 
  Terminal, Globe, TrendingUp, HelpCircle, CheckCircle2,
  ChevronLeft, ChevronRight
} from 'lucide-react';

const Home = () => {
  // Eager scan screenshots folder dynamically
  const screenshotImages = import.meta.glob('/src/assets/screenshots/*.{png,jpg,jpeg,svg,webp}', { eager: true });
  const imagePaths = Object.values(screenshotImages).map(img => img.default || img);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying || imagePaths.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % imagePaths.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying, imagePaths.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + imagePaths.length) % imagePaths.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % imagePaths.length);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  const stats = [
    { value: "150+", label: "Total Employees", icon: Users, desc: "Skilled Engineers & Designers" },
    { value: "80+", label: "Active Clients", icon: Globe, desc: "Global Enterprise Partners" },
    { value: "450+", label: "Projects Delivered", icon: Briefcase, desc: "On-time Agile Delivery" },
    { value: "99.9%", label: "Support Availability", icon: Shield, desc: "24/7 Monitored SLAs" },
  ];

  const features = [
    {
      title: "Employee Management",
      desc: "Track attendance, department performance, role status, and corporate compliance directories.",
      icon: Users,
      color: "from-blue-600/20 to-sky-600/5",
    },
    {
      title: "Client Records Directory",
      desc: "Maintain secure communication streams, active service agreements, and key client contact profiles.",
      icon: Globe,
      color: "from-indigo-600/20 to-violet-600/5",
    },
    {
      title: "Agile Project Tracking",
      desc: "Monitor timelines, backlogs, sprints, deliverables, and budgets using high-fidelity status pipelines.",
      icon: Briefcase,
      color: "from-emerald-600/20 to-teal-600/5",
    },
    {
      title: "Dashboard Analytics",
      desc: "Access granular insights into project velocity, team utilization levels, and revenue performance charts.",
      icon: TrendingUp,
      color: "from-amber-600/20 to-orange-600/5",
    },
    {
      title: "Support Ticket Desk",
      desc: "Prioritize ticket responses, triage incoming technical queries, and measure client satisfaction logs.",
      icon: HelpCircle,
      color: "from-rose-600/20 to-pink-600/5",
    },
    {
      title: "Role-Based Security",
      desc: "Rest assured with AES encryption, secure auth controls, session monitoring, and access scopes.",
      icon: Shield,
      color: "from-sky-600/20 to-indigo-600/5",
    },
  ];

  const testimonials = [
    {
      quote: "Avon Technologies completely modernized our customer support interface. The Smart Client Portal makes onboarding and communication exceptionally streamlined.",
      author: "Aditi Rao",
      role: "VP of Engineering, FinHealth Systems",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=128&h=128"
    },
    {
      quote: "The team delivery velocity is top-notch. With the project tracking integration, we have absolute transparency into our daily software sprints and milestones.",
      author: "Rajesh Kumar",
      role: "Founder & CEO, EduGlow India",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=128&h=128"
    }
  ];

  return (
    <div className="space-y-24 pb-20 overflow-x-hidden">
      {/* 1. Hero Section */}
      <section className="relative pt-12 md:pt-20">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, type: 'spring' }}
              className="lg:col-span-7 space-y-6 text-left"
            >
              <div className="inline-flex items-center space-x-2 bg-sky-950/50 border border-sky-500/30 rounded-full px-4 py-1.5 text-xs text-sky-400 font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Smart Operations & Management Suite</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Transform Employee & Client Management with
                <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-sky-500 to-indigo-400">
                  Smart Digital Solutions
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed">
                Avon Technologies empowers your business with an unified portal to track employee utilization, record client interactions, review agile sprints, and resolve technical support logs in real-time.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/login"
                  className="px-6 py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl shadow-lg shadow-sky-600/20 hover:shadow-sky-500/30 transition-all flex items-center space-x-2 transform hover:-translate-y-0.5"
                >
                  <span>Access Client Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/services"
                  className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 font-semibold rounded-xl transition-all"
                >
                  Explore Services
                </Link>
              </div>
            </motion.div>

            {/* Right Graphic Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              {/* Decorative Frame */}
              <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/10 to-indigo-500/10 rounded-3xl blur-2xl -z-10" />
              
              {/* Screen Preview Slider Carousel */}
              <div 
                className="glass-panel rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative group bg-slate-900/60"
                onMouseEnter={() => setIsPlaying(false)}
                onMouseLeave={() => setIsPlaying(true)}
              >
                {/* Editor Header */}
                <div className="bg-slate-950 px-4 py-3 border-b border-slate-800/60 flex items-center justify-between">
                  <div className="flex space-x-1.5 shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>AVON PORTAL INTERFACE PREVIEW</span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 shrink-0">
                    {imagePaths.length > 0 ? `${currentIndex + 1} / ${imagePaths.length}` : '0 / 0'}
                  </span>
                </div>

                {/* Slider viewport */}
                <div className="relative h-64 sm:h-72 md:h-80 overflow-hidden flex items-center justify-center bg-slate-950">
                  {imagePaths.length > 0 ? (
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentIndex}
                        src={imagePaths[currentIndex]}
                        alt={`Site Page Preview ${currentIndex + 1}`}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.4 }}
                        className="w-full h-full object-cover select-none"
                      />
                    </AnimatePresence>
                  ) : (
                    <div className="text-slate-500 text-xs italic">No previews available.</div>
                  )}

                  {/* Navigation controls */}
                  {imagePaths.length > 1 && (
                    <>
                      <button 
                        onClick={handlePrev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/60 border border-slate-800 text-white flex items-center justify-center hover:bg-slate-900 opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={handleNext}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/60 border border-slate-800 text-white flex items-center justify-center hover:bg-slate-900 opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>

                {/* Indicator dots */}
                {imagePaths.length > 1 && (
                  <div className="bg-slate-950 px-4 py-2.5 border-t border-slate-800/60 flex items-center justify-center space-x-1.5">
                    {imagePaths.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          currentIndex === idx ? 'w-5 bg-sky-500' : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Statistics Section */}
      <section className="bg-slate-950 py-12 relative border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 flex items-start space-x-4 glow-card-hover"
                >
                  <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-extrabold text-white tracking-tight">{stat.value}</h3>
                    <p className="text-sm font-semibold text-slate-300 mt-1">{stat.label}</p>
                    <p className="text-xs text-slate-500 mt-1.5">{stat.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-sky-400 uppercase tracking-widest">Platform Core Modules</h2>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Designed for Modern Enterprise Environments
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Avon Technologies provides modular controls to streamline business workflows, reduce administrative overhead, and assure structural transparency.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className={`bg-gradient-to-br ${feat.color} border border-slate-800/80 hover:border-sky-500/30 rounded-2xl p-6 text-left glow-card-hover group`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 group-hover:text-white group-hover:bg-sky-600 transition-all duration-300 mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* 4. Testimonials Section */}
      <section className="bg-slate-950/60 py-20 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left label */}
            <div className="lg:col-span-4 text-left space-y-4">
              <h2 className="text-xs font-bold text-sky-400 uppercase tracking-widest">Enterprise Trust</h2>
              <h3 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
                What Our Clients Say About Avon Tech
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We design client portals and employee hubs with custom performance triggers that boost digital trust and operational metrics.
              </p>
            </div>
            {/* Right testimonials grid */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((test, idx) => (
                <div key={idx} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 text-left space-y-4 flex flex-col justify-between">
                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    "{test.quote}"
                  </p>
                  <div className="flex items-center space-x-3 pt-3 border-t border-slate-800/60">
                    <img 
                      src={test.image} 
                      alt={test.author}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-800"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{test.author}</h4>
                      <p className="text-[10px] text-slate-500">{test.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Call-To-Action (CTA) Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-sky-950 via-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden glow-card">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Start Managing Your Business Smarter Today
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Log in with your corporate credentials to review departments, register clients, update project kanbans, or review priority operations.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link
                to="/login"
                className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl shadow-lg transition-all flex items-center space-x-2 transform hover:-translate-y-0.5"
              >
                <span>Explore Portal Dashboard</span>
                <ArrowRight className="w-4 h-4 text-slate-900" />
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 bg-slate-900/60 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 font-semibold rounded-xl transition-all"
              >
                Contact Sales Team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
