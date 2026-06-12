import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle, AlertCircle, Send, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Full name is required.";
    
    if (!formData.email.trim()) {
      tempErrors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Please enter a valid email address.";
    }

    if (!formData.subject.trim()) tempErrors.subject = "Subject is required.";
    if (!formData.message.trim()) {
      tempErrors.message = "Message cannot be empty.";
    } else if (formData.message.length < 10) {
      tempErrors.message = "Message must be at least 10 characters long.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear specific error on keystroke
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      // Simulate API submit latency
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        // Auto reset success message after 5s
        setTimeout(() => setSubmitSuccess(false), 5000);
      }, 1500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-left space-y-4 max-w-3xl">
        <h1 className="text-xs font-bold text-sky-400 uppercase tracking-widest font-mono">Connect With Us</h1>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Let's Build Something Revolutionary Together
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Have an inquiry regarding software integrations, support SLAs, or portal capabilities? Reach out using the form below, and our engineering representatives in SR Nagar, Hyderabad will connect with you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Side: Contact Information & Google Map Placeholder */}
        <div className="lg:col-span-5 space-y-8 text-left">
          {/* Info Card */}
          <div className="glass-panel border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
            <h3 className="text-lg font-bold text-white">Office Headquarters</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3.5 text-xs text-slate-300">
                <MapPin className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Avon Technologies (India) Pvt. Ltd.</h4>
                  <p className="text-slate-400 mt-1 leading-normal">
                    Ameera Complex, SR Nagar, Hyderabad, Telangana, 500038
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3.5 text-xs text-slate-300">
                <Phone className="w-5 h-5 text-sky-400 shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">Direct Phone Link</h4>
                  <p className="text-slate-400 mt-0.5">+91 40 4827 9102</p>
                </div>
              </div>

              <div className="flex items-center space-x-3.5 text-xs text-slate-300">
                <Mail className="w-5 h-5 text-sky-400 shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">Email Address</h4>
                  <p className="text-slate-400 mt-0.5">contact@avontechnologies.co.in</p>
                </div>
              </div>
            </div>
          </div>

          {/* Styled Map Placeholder */}
          <div className="glass-panel border border-slate-800 rounded-3xl overflow-hidden h-64 relative group shadow-lg">
            {/* Styled Dark Overlay Vector Grid Map representing Hyderabad HITEC City */}
            <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-6 space-y-3 z-10 transition-colors group-hover:bg-slate-950/95">
              <div className="w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400 border border-sky-500/20 shadow-md">
                <MapPin className="w-5 h-5 animate-bounce" />
              </div>
              <div className="text-center">
                <span className="font-bold text-xs text-white">SR Nagar Office Locator</span>
                <span className="block text-[10px] text-slate-500 mt-1">SR Nagar, Hyderabad, Telangana</span>
              </div>
              <a 
                href="https://maps.google.com/?q=SR+Nagar+Hyderabad" 
                target="_blank" 
                rel="noreferrer"
                className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-lg text-[10px] font-semibold transition-colors mt-2"
              >
                Open in Google Maps
              </a>
            </div>
            {/* Simulated map lines */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          </div>
        </div>

        {/* Right Side: Responsive Form with validation states */}
        <div className="lg:col-span-7">
          <div className="glass-panel border border-slate-800 rounded-3xl p-6 md:p-8 text-left shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6">Send Us a Secure Message</h3>
            
            <AnimatePresence>
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-start space-x-2"
                >
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Message Sent Successfully!</span>
                    <span className="block mt-0.5 text-[11px] text-emerald-400/80">Thank you for writing to Avon Technologies. Our operations triage team will review and reply within 24 business hours.</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name field */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider" htmlFor="name">Full Name</label>
                <input 
                  type="text" 
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. John Doe"
                  className={`w-full bg-slate-950/80 border text-xs text-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-500/50 transition-all ${
                    errors.name ? 'border-rose-500/50' : 'border-slate-800 hover:border-slate-700'
                  }`}
                />
                {errors.name && (
                  <span className="text-[10px] text-rose-400 flex items-center space-x-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.name}</span>
                  </span>
                )}
              </div>

              {/* Email field */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider" htmlFor="email">Corporate Email</label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. john@company.com"
                  className={`w-full bg-slate-950/80 border text-xs text-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-500/50 transition-all ${
                    errors.email ? 'border-rose-500/50' : 'border-slate-800 hover:border-slate-700'
                  }`}
                />
                {errors.email && (
                  <span className="text-[10px] text-rose-400 flex items-center space-x-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.email}</span>
                  </span>
                )}
              </div>

              {/* Subject field */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider" htmlFor="subject">Subject</label>
                <input 
                  type="text" 
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="e.g. Web Project Specifications"
                  className={`w-full bg-slate-950/80 border text-xs text-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-500/50 transition-all ${
                    errors.subject ? 'border-rose-500/50' : 'border-slate-800 hover:border-slate-700'
                  }`}
                />
                {errors.subject && (
                  <span className="text-[10px] text-rose-400 flex items-center space-x-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.subject}</span>
                  </span>
                )}
              </div>

              {/* Message field */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider" htmlFor="message">Message</label>
                <textarea 
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us about your project or technical request..."
                  className={`w-full bg-slate-950/80 border text-xs text-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-500/50 transition-all resize-none ${
                    errors.message ? 'border-rose-500/50' : 'border-slate-800 hover:border-slate-700'
                  }`}
                />
                {errors.message && (
                  <span className="text-[10px] text-rose-400 flex items-center space-x-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.message}</span>
                  </span>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 text-xs uppercase tracking-wider"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
