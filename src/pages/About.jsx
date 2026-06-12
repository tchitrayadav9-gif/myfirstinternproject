import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, ShieldAlert, Cpu, Heart, Code, 
  TrendingUp, Users, Clock, Award, Star 
} from 'lucide-react';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  const advantages = [
    {
      title: "Professional Team",
      desc: "Our engineering corps consists of certified cloud architects, full-stack developers, and agile scrum masters dedicated to standard code practices.",
      icon: Users,
    },
    {
      title: "Secure Systems",
      desc: "We prioritize security. Every deployment undergoes structural code analyses, security scans, and complies with standard encryption protocols.",
      icon: ShieldCheck,
    },
    {
      title: "Modern Technologies",
      desc: "We design software foundations with modern tools: React, Node.js, Tailwind, Docker, and Kubernetes ensuring scale and speed.",
      icon: Cpu,
    },
    {
      title: "Reliable Support",
      desc: "Our support ticket infrastructure operates under active Service Level Agreements (SLAs) with dedicated technical triage response desks.",
      icon: Clock,
    }
  ];

  const timeline = [
    { year: "2021", event: "Avon Technologies Founded", desc: "Started operations in Hyderabad, Telangana, with a core team of 10 developers focusing on custom cloud application services." },
    { year: "2023", event: "Enterprise Services Scale", desc: "Expanded services to cover Machine Learning engineering, UI/UX designs, and launched the initial Smart Client Operations portal." },
    { year: "2025", event: "ISO Certification & Global Reach", desc: "Attained ISO 27001 security compliance certification, grew our operations team to over 150+ engineers, and secured global clients." }
  ];



  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24">
      {/* 1. Header & Corporate Overview */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
        <div className="lg:col-span-7 space-y-6">
          <h1 className="text-xs font-bold text-sky-400 uppercase tracking-widest">Who We Are</h1>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Driving Digital Excellence from Hyderabad's Tech Hub
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Avon Technologies (India) Pvt. Ltd. is an established IT solutions provider based in Hyderabad, Telangana. We construct modern, scalable enterprise software frameworks, employee tracking dashboards, and customer portals that help businesses grow efficiently.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Our company operates on the principles of design integrity, strict technical security, and transparent communication flows. We partner with clients to streamline internal logistics and engineer reliable product lifecycles.
          </p>
        </div>

        {/* Brand stats callout */}
        <div className="lg:col-span-5 relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/10 to-indigo-500/10 rounded-3xl blur-2xl -z-10" />
          <div className="glass-panel rounded-3xl p-8 border border-slate-800 space-y-6">
            <div className="flex items-center space-x-3 text-sky-400">
              <Award className="w-6 h-6" />
              <span className="font-bold text-xs uppercase tracking-wider">Company Highlights</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="border-l-2 border-sky-500 pl-3">
                <span className="text-2xl font-bold text-white block">5+ Years</span>
                <span className="text-[10px] text-slate-500">Service Delivery</span>
              </div>
              <div className="border-l-2 border-sky-500 pl-3">
                <span className="text-2xl font-bold text-white block">150+ Staff</span>
                <span className="text-[10px] text-slate-500">Operations Team</span>
              </div>
              <div className="border-l-2 border-sky-500 pl-3">
                <span className="text-2xl font-bold text-white block">450+ Apps</span>
                <span className="text-[10px] text-slate-500">Deployed Worldwide</span>
              </div>
              <div className="border-l-2 border-sky-500 pl-3">
                <span className="text-2xl font-bold text-white block">ISO 27001</span>
                <span className="text-[10px] text-slate-500">Certified Security</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Mission & Vision Panels */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        {/* Mission Card */}
        <div className="bg-gradient-to-tr from-sky-950/40 via-slate-900 to-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400">
            <Code className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-extrabold text-white">Our Mission</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            To design, construct, and deploy scalable digital business solutions that simplify employee management, reinforce client collaboration structures, and empower leadership with real-time operations dashboards. We aim to convert complex processes into beautiful, intuitive product environments.
          </p>
        </div>

        {/* Vision Card */}
        <div className="bg-gradient-to-tr from-indigo-950/40 via-slate-900 to-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-extrabold text-white">Our Vision</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            To build innovative software foundations that equip future-ready businesses with custom automation layers, reliable cloud systems, and secure communication channels. We envision a business landscape where complex internal operations are resolved effortlessly through smart tech.
          </p>
        </div>
      </section>

      {/* 3. Why Choose Us (Advantages Grid) */}
      <section className="space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-xs font-bold text-sky-400 uppercase tracking-widest font-mono">The Avon Advantage</h2>
          <h3 className="text-3xl font-extrabold text-white">Why Organizations Partner With Us</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We merge standard software architecture guidelines with high-fidelity frontend layouts to build secure web modules.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {advantages.map((adv, idx) => {
            const Icon = adv.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-slate-900/40 border border-slate-800 hover:border-sky-500/20 rounded-2xl p-6 text-left hover:bg-slate-900 transition-all glow-card-hover group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 group-hover:text-white group-hover:bg-sky-600 transition-colors mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white mb-2">{adv.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{adv.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* 4. Company Growth Timeline */}
      <section className="bg-slate-950/60 py-16 border-y border-slate-900">
        <div className="max-w-4xl mx-auto px-4 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold text-sky-400 uppercase tracking-widest font-mono font-bold">Growth Timeline</h2>
            <h3 className="text-2xl font-extrabold text-white">Our Corporate Achievements</h3>
          </div>

          <div className="relative border-l border-slate-800 pl-6 md:pl-10 space-y-10 text-left">
            {timeline.map((item, idx) => (
              <div key={idx} className="relative">
                {/* Year Badge Bullet */}
                <div className="absolute -left-[37px] md:-left-[53px] top-1 w-5 h-5 rounded-full bg-slate-900 border-2 border-sky-500 flex items-center justify-center shrink-0 z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                </div>
                <div className="space-y-1.5">
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-sky-500/10 text-sky-400 text-[10px] font-bold font-mono">
                    {item.year}
                  </span>
                  <h4 className="text-base font-bold text-white">{item.event}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
};

export default About;
