import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, MessageSquare, Send, CheckCircle2, ShieldAlert, 
  HelpCircle, Clock, AlertCircle, X, ChevronRight, Check
} from 'lucide-react';
import { ticketService } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const Support = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Modal for new ticket
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    department: 'Web Development',
    priority: 'Medium'
  });

  const departments = [
    "Web Development", "Mobile Apps", "AI Solutions", 
    "Cloud Computing", "UI/UX Design", "Support Operations"
  ];

  const fetchMyTickets = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await ticketService.getAll();
      
      // Filter tickets raised by this employee (match email)
      const myTix = data.filter(t => t.raisedBy?.toLowerCase() === user.email.toLowerCase());
      setTickets(myTix);

      if (myTix.length > 0 && !selectedTicket) {
        setSelectedTicket(myTix[0]);
      } else if (myTix.length > 0 && selectedTicket) {
        const updatedSelected = myTix.find(t => (t._id || t.id) === (selectedTicket._id || selectedTicket.id));
        if (updatedSelected) {
          setSelectedTicket(updatedSelected);
        }
      }
    } catch (err) {
      console.error('Failed to load employee support tickets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTickets();
  }, [user]);

  const handleNewTicketSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject.trim()) {
      setFormErrors({ subject: 'Ticket subject is required.' });
      return;
    }
    if (!formData.description.trim()) {
      setFormErrors({ description: 'Issue description details are required.' });
      return;
    }

    try {
      const payload = {
        ...formData,
        raisedBy: user.email,
        employeeName: user.name,
        status: 'Open'
      };
      await ticketService.create(payload);
      setIsNewTicketOpen(false);
      setFormData({
        subject: '',
        description: '',
        department: 'Web Development',
        priority: 'Medium'
      });
      setFormErrors({});
      fetchMyTickets();
    } catch (err) {
      console.error('Failed to raise ticket:', err);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    try {
      const ticketId = selectedTicket._id || selectedTicket.id;
      await ticketService.reply(ticketId, replyMessage);
      setReplyMessage('');
      fetchMyTickets();
    } catch (err) {
      console.error('Failed to send reply:', err);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-rose-50 border-rose-100 text-rose-650 dark:bg-rose-955/20';
      case 'Medium': return 'bg-amber-50 border-amber-100 text-amber-655 dark:bg-amber-955/20';
      default: return 'bg-sky-50 border-sky-100 text-sky-655 dark:bg-sky-955/20';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-955/20';
      case 'In Progress': return 'bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-955/20';
      default: return 'bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-955/20';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm text-left">
        <div>
          <span className="text-[10px] text-indigo-650 dark:text-indigo-400 font-bold uppercase tracking-wider block">Avon Desk helpdesk</span>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">Support Desk</h1>
          <p className="text-xs text-slate-500 mt-1">Raise corporate tickets, report software bottlenecks, and review administrator replies.</p>
        </div>
        <button 
          onClick={() => { setFormErrors({}); setIsNewTicketOpen(true); }}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-indigo-600/10 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Ticket</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        
        {/* Left Side: Ticket Lists */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">My Support Requests ({tickets.length})</h3>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="p-4 animate-pulse space-y-2" />
              ))
            ) : tickets.length > 0 ? (
              tickets.map((t) => {
                const tId = t._id || t.id;
                const isSelected = selectedTicket && (selectedTicket._id || selectedTicket.id) === tId;
                return (
                  <div 
                    key={tId}
                    onClick={() => setSelectedTicket(t)}
                    className={`p-4 cursor-pointer hover:bg-slate-50/60 dark:hover:bg-slate-850 transition-colors ${
                      isSelected ? 'bg-indigo-50/30 dark:bg-slate-800/40 border-l-4 border-indigo-600' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold border uppercase tracking-wider ${getPriorityColor(t.priority)}`}>
                        {t.priority}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold border uppercase tracking-wider ${getStatusColor(t.status)}`}>
                        {t.status}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-slate-800 dark:text-white text-xs truncate mb-1">{t.subject}</h4>
                    <div className="flex justify-between items-center text-[9px] text-slate-400 font-semibold">
                      <span>Category: {t.department}</span>
                      <span>{t.createdAt?.split('T')[0] || 'Today'}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-450 italic space-y-2">
                <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs">No support requests raised yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Conversation Timeline */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-2xl shadow-sm h-[600px] flex flex-col justify-between overflow-hidden">
          {selectedTicket ? (
            <>
              {/* Ticket header */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-850/50">
                <div className="text-left space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Subject Issue Details</span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">{selectedTicket.subject}</h3>
                  <div className="flex items-center space-x-3 text-[10px] text-slate-500">
                    <span className="font-semibold text-slate-700 dark:text-slate-350">POC: {selectedTicket.employeeName || selectedTicket.raisedBy}</span>
                    <span>•</span>
                    <span>Category: {selectedTicket.department}</span>
                  </div>
                </div>
              </div>

              {/* Message Timeline */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {/* Employee Initial Message */}
                <div className="flex space-x-3 items-start text-left">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'E'}
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-3.5 max-w-[85%] space-y-1 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-800 dark:text-white block">{selectedTicket.employeeName || selectedTicket.raisedBy}</span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">{selectedTicket.description}</p>
                    <span className="text-[8px] text-slate-400 block text-right mt-1">{selectedTicket.createdAt?.split('T')[0]}</span>
                  </div>
                </div>

                {/* Conversation Replies Stream */}
                {selectedTicket.replies && selectedTicket.replies.map((rep, rIdx) => {
                  const isAdminReply = rep.senderRole === 'Admin';
                  return (
                    <div 
                      key={rIdx} 
                      className={`flex space-x-3 items-start ${isAdminReply ? 'flex-row-reverse space-x-reverse' : ''}`}
                    >
                      <div className={`w-7 h-7 rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0 shadow ${
                        isAdminReply ? 'bg-blue-600' : 'bg-gradient-to-tr from-indigo-500 to-sky-500'
                      }`}>
                        {rep.senderName ? rep.senderName.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className={`rounded-2xl p-3.5 max-w-[85%] space-y-1 shadow-sm ${
                        isAdminReply ? 'bg-indigo-50 text-slate-850 dark:bg-slate-950 dark:text-slate-205' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        <span className="text-[10px] font-bold block">{rep.senderName} ({rep.senderRole})</span>
                        <p className="text-xs leading-relaxed font-semibold">{rep.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Form */}
              {selectedTicket.status !== 'Resolved' ? (
                <form onSubmit={handleReplySubmit} className="p-4 border-t border-slate-100 dark:border-slate-800 flex space-x-3 shrink-0 bg-slate-50/50 dark:bg-slate-900/40">
                  <input 
                    type="text" 
                    placeholder="Submit reply or comments..." 
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="flex-grow bg-white dark:bg-slate-955 border border-slate-205 dark:border-slate-850 p-2.5 rounded-xl text-xs focus:outline-none"
                  />
                  <button 
                    type="submit"
                    className="p-2.5 bg-indigo-650 hover:bg-indigo-550 text-white rounded-xl flex items-center justify-center shadow-md shadow-indigo-655/10 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-emerald-50/20 text-center text-[10px] text-emerald-600 dark:text-emerald-450 font-bold uppercase tracking-wider py-5">
                  ✓ Ticket resolved. Conversation closed.
                </div>
              )}
            </>
          ) : (
            <div className="m-auto text-slate-455 text-center space-y-2">
              <MessageSquare className="w-12 h-12 text-slate-200 mx-auto" />
              <p className="text-xs">Select an active ticket from the list or click "New Ticket" to raise a help desk query.</p>
            </div>
          )}
        </div>

      </div>

      {/* New Ticket Modal */}
      <AnimatePresence>
        {isNewTicketOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewTicketOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-202 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 relative z-10 space-y-4 shadow-2xl text-left"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Raise Support Ticket</h3>
                  <p className="text-[10px] text-slate-505">Describe the technical issue or general query for review.</p>
                </div>
                <button onClick={() => setIsNewTicketOpen(false)} className="text-slate-400 hover:text-slate-655">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleNewTicketSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Ticket Subject</label>
                  <input 
                    type="text" 
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Node modules package compilation error"
                    className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none font-semibold text-slate-855 dark:text-slate-350"
                  />
                  {formErrors.subject && <p className="text-[9px] text-rose-500 mt-1">{formErrors.subject}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-505 font-bold uppercase tracking-wider">Category / Department</label>
                    <select 
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full bg-[#F8FAFC] dark:bg-slate-955 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                    >
                      {departments.map((dept, i) => (
                        <option key={i} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-550 font-bold uppercase tracking-wider">Priority Urgency</label>
                    <select 
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full bg-[#F8FAFC] dark:bg-slate-955 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                    >
                      <option value="Low">Low Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="High">High Priority</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Issue Description Details</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    placeholder="Describe compile stack trace, package conflicts, or questions..."
                    className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-805 p-2.5 rounded-xl focus:outline-none resize-none font-semibold text-slate-855 dark:text-slate-350"
                  />
                  {formErrors.description && <p className="text-[9px] text-rose-500 mt-1">{formErrors.description}</p>}
                </div>

                <button 
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-550 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-650/10"
                >
                  Raise Support Ticket
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Support;
