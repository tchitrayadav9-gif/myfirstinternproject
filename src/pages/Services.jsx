import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, Smartphone, Brain, Cloud, Palette, HelpCircle, 
  ArrowRight, CheckCircle2, ChevronRight, X 
} from 'lucide-react';

const Services = () => {
  const [selectedService, setSelectedService] = useState(null);

  const servicesList = [
    {
      id: 1,
      title: "Web Development",
      shortDesc: "Scalable, high-performance web applications built with modern frameworks and robust API endpoints.",
      longDesc: "Avon Technologies designs and delivers full-stack web applications tailored to enterprise business workflows. We construct fast, SEO-friendly, secure portals and corporate intranets that handle big data feeds and support high concurrent user loads.",
      icon: Globe,
      color: "from-blue-500 to-sky-500",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-400",
      borderColor: "group-hover:border-blue-500/30",
      techs: ["React.js", "Next.js", "Node.js", "Express", "PostgreSQL", "Tailwind CSS"],
      features: [
        "Single Page Applications (SPAs)",
        "Enterprise Client Portals",
        "API Gateway & Microservices",
        "SEO & Web Performance Tuning",
        "Comprehensive Web Analytics Hooks"
      ]
    },
    {
      id: 2,
      title: "Mobile App Development",
      shortDesc: "Native and cross-platform mobile solutions featuring responsive UI components and smooth gesture workflows.",
      longDesc: "We build intuitive, robust iOS and Android applications utilizing React Native or Swift/Kotlin codebases. Our products feature clean offline synchronizations, biometric authentication wrappers, and interactive push notification structures.",
      icon: Smartphone,
      color: "from-indigo-500 to-violet-500",
      bgColor: "bg-indigo-500/10",
      textColor: "text-indigo-400",
      borderColor: "group-hover:border-indigo-500/30",
      techs: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase", "App Store Compliance"],
      features: [
        "Cross-Platform Core Porting",
        "Biometric Security integrations",
        "Background sync & offline databases",
        "Device sensor hardware mapping",
        "App Store & Google Play publishing"
      ]
    },
    {
      id: 3,
      title: "AI Solutions",
      shortDesc: "Machine learning engines, automated predictive analytics models, and intelligent chatbot integrations.",
      longDesc: "Leverage the power of data automation. We build custom natural language models, predictive sales engines, computer vision filters, and automated process pipelines that turn unstructured business metrics into actionable analytics dashboards.",
      icon: Brain,
      color: "from-purple-500 to-fuchsia-500",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-400",
      borderColor: "group-hover:border-purple-500/30",
      techs: ["Python", "TensorFlow", "PyTorch", "OpenAI APIs", "LangChain", "Pandas & NumPy"],
      features: [
        "Predictive Business Forecasting",
        "Customer Intent Chatbots",
        "OCR & Document Automation",
        "Recommendations & Personalizations",
        "Anomaly Detection & Security Auditing"
      ]
    },
    {
      id: 4,
      title: "Cloud Computing",
      shortDesc: "Scalable cloud architecture design, serverless migrations, and continuous deployment workflows.",
      longDesc: "Avon Technologies constructs resilient containerized cloud layers on AWS or Azure. We establish automated Kubernetes clustering, serverless API operations, high-availability relational databases, and automated backup architectures.",
      icon: Cloud,
      color: "from-sky-500 to-cyan-500",
      bgColor: "bg-sky-500/10",
      textColor: "text-sky-400",
      borderColor: "group-hover:border-sky-500/30",
      techs: ["AWS", "Azure", "Docker", "Kubernetes", "GitHub Actions", "Terraform IaC"],
      features: [
        "AWS/Azure Tenant Migration",
        "CI/CD Pipeline Automation",
        "Zero-Downtime Serverless Apps",
        "Cloud Storage & CDN distribution",
        "VPC Networking & IAM Policies"
      ]
    },
    {
      id: 5,
      title: "UI/UX Design",
      shortDesc: "High-fidelity wireframing, clickable design mockups, and corporate design system creation.",
      longDesc: "We build digital systems that prioritize clarity and user experience. Our UX strategists perform user flow mappings, create accessible UI elements, and run visual feedback tests to make your software interfaces clean, interactive, and beautiful.",
      icon: Palette,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-400",
      borderColor: "group-hover:border-emerald-500/30",
      techs: ["Figma", "Adobe XD", "Framer Motion", "Design Systems", "A/B Testing UI", "WCAG AA Compliance"],
      features: [
        "High-Fidelity Wireframes",
        "Clickable Interactive Prototypes",
        "Responsive Breakpoint Layouts",
        "Logo & Brand Vector Assets",
        "Usability Testing & Feedback Reviews"
      ]
    },
    {
      id: 6,
      title: "Technical Support",
      shortDesc: "24/7 technical operations monitoring, incident support, and custom software maintenance SLAs.",
      longDesc: "Ensure zero disruptions. We provide operational support packages covering regular framework upgrades, emergency bug triaging, server performance patches, and client inquiry response desks with guaranteed response-time SLAs.",
      icon: HelpCircle,
      color: "from-rose-500 to-pink-500",
      bgColor: "bg-rose-500/10",
      textColor: "text-rose-400",
      borderColor: "group-hover:border-rose-500/30",
      techs: ["Jira Desk", "SLA Trackers", "Sentry Reporting", "SSL & Domain Maintenance", "Data Migrations"],
      features: [
        "24/7 Operations Monitoring",
        "Bug Triaging & Security Fixes",
        "Database Maintenance & Backups",
        "Guaranteed Response SLAs",
        "Application Version Upgrades"
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-left space-y-4 max-w-3xl">
        <h1 className="text-xs font-bold text-sky-400 uppercase tracking-widest">Our Capabilities</h1>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Enterprise IT Services Designed for Digital Acceleration
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Avon Technologies provides custom software engineering, analytics integrations, and IT infrastructure operations to build scalable systems. Click on any card below to see detailed tech stacks and features.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicesList.map((service) => {
          const Icon = service.icon;
          return (
            <motion.div
              key={service.id}
              whileHover={{ y: -6 }}
              className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 text-left hover:border-slate-700/80 transition-all cursor-pointer group flex flex-col justify-between glow-card-hover"
              onClick={() => setSelectedService(service)}
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-xl ${service.bgColor} ${service.textColor} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-sky-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {service.shortDesc}
                </p>
              </div>

              <div className="flex items-center space-x-1.5 text-xs text-sky-400 group-hover:text-sky-300 font-semibold pt-6">
                <span>View Scope & Technologies</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Interactive Detail Modal Dialog */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 w-full max-w-2xl shadow-2xl z-10 text-left overflow-y-auto max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-4">
                  <div className={`w-14 h-14 rounded-2xl ${selectedService.bgColor} ${selectedService.textColor} flex items-center justify-center shrink-0`}>
                    <selectedService.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedService.title}</h3>
                    <span className="text-[10px] text-sky-400 font-semibold tracking-wider uppercase mt-1 inline-block">Service Specification</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedService.longDesc}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Scope of features */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Features Included:</h4>
                    <ul className="space-y-2">
                      {selectedService.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-xs text-slate-400">
                          <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech stack tags */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Core Tech Stack:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedService.techs.map((tech, idx) => (
                        <span 
                          key={idx} 
                          className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTA inside Modal */}
                <div className="pt-6 border-t border-slate-800 flex justify-end space-x-4">
                  <button 
                    onClick={() => setSelectedService(null)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    Close Window
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedService(null);
                      // Redirecting/handling action...
                    }}
                    className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-xl transition-colors flex items-center space-x-1.5"
                  >
                    <span>Request Proposal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Services;
