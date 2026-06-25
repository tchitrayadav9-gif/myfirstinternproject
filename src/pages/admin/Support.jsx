import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, User, ShieldAlert, Send, CheckCircle2, 
  HelpCircle, Clock, Check
} from 'lucide-react';
import { ticketService } from '../../services/api';

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const data = await ticketService.getAll();
      if (data.length === 0) {
        const mockTickets = [
          {
            _id: 'mock-t1',
            id: 'mock-t1',
            name: 'Alex Johnson',
            email: 'alex.johnson@avon.co.in',
            subject: 'Docker Container Network Resolution Issue',
            message: 'My Docker containers are unable to resolve the MongoDB Atlas connection SRV records locally. Standard lookup is returning connection refused. Can you look at my DNS configuration?',
            status: 'Pending',
            createdAt: '2026-06-25T10:00:00.000Z',
            replies: []
          },
          {
            _id: 'mock-t2',
            id: 'mock-t2',
            name: 'Sarah Connor',
            email: 'sarah.connor@avon.co.in',
            subject: 'Figma Dev Mode License Expiry',
            message: 'My Figma developer mode license has expired. I need access to inspect the newly designed glassmorphism dashboard elements. Please renew.',
            status: 'Resolved',
            createdAt: '2026-06-24T08:30:00.000Z',
            replies: [
              { message: 'License renewed for 12 months. Please verify access.', sender: 'Admin', createdAt: '2026-06-24T09:15:00.000Z' }
            ]
          }
        ];
        setTickets(mockTickets);
        if (!selectedTicket) {
          setSelectedTicket(mockTickets[0]);
        }
      } else {
        setTickets(data);
        if (data.length > 0 && !selectedTicket) {
          setSelectedTicket(data[0]);
        } else if (data.length > 0 && selectedTicket) {
          const updatedSelected = data.find(t => (t._id || t.id) === (selectedTicket._id || selectedTicket.id));
          if (updatedSelected) {
            setSelectedTicket(updatedSelected);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load tickets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    try {
      const ticketId = selectedTicket._id || selectedTicket.id;
      await ticketService.reply(ticketId, replyMessage);
      setReplyMessage('');
      fetchTickets();
    } catch (err) {
      console.error('Failed to send reply:', err);
    }
  };

  const handleResolveTicket = async (ticket) => {
    try {
      const ticketId = ticket._id || ticket.id;
      await ticketService.resolve(ticketId);
      fetchTickets();
    } catch (err) {
      console.error('Failed to resolve ticket:', err);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-950/20';
      case 'Medium': return 'bg-amber-50 border-amber-100 text-amber-600 dark:bg-amber-950/20';
      default: return 'bg-sky-50 border-sky-100 text-sky-600 dark:bg-sky-950/20';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20';
      case 'In Progress': return 'bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-950/20';
      default: return 'bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-950/20';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm text-left">
        <span className="text-[10px] text-[#1E40AF] dark:text-cyan-400 font-bold uppercase tracking-wider block">Avon Helpdesk</span>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">Support Tickets Inbox</h1>
        <p className="text-xs text-slate-500 mt-1">Review raised issues from associates, submit advice notes, and flag tickets resolved.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        
        {/* Left Side: Ticket Lists */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Raised Tickets ({tickets.length})</h3>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="p-4 animate-pulse space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-2/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
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
                      isSelected ? 'bg-blue-50/40 dark:bg-slate-800/40 border-l-4 border-[#1E40AF]' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${getPriorityColor(t.priority)}`}>
                        {t.priority}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${getStatusColor(t.status)}`}>
                        {t.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-xs truncate mb-1">{t.subject}</h4>
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span className="truncate max-w-[120px] font-semibold">{t.employeeName || t.raisedBy}</span>
                      <span>{t.createdAt?.split('T')[0] || 'Today'}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-405 italic space-y-2">
                <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs">No active support tickets.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Conversation Timeline & Reply Stream */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm h-[600px] flex flex-col justify-between overflow-hidden">
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
                    <span>Category: {selectedTicket.department || 'General'}</span>
                  </div>
                </div>
                {selectedTicket.status !== 'Resolved' && (
                  <button 
                    onClick={() => handleResolveTicket(selectedTicket)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold flex items-center space-x-1.5 shadow-md shadow-emerald-600/10 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Resolve Ticket</span>
                  </button>
                )}
              </div>

              {/* Message Timeline */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {/* Employee Initial Message */}
                <div className="flex space-x-3 items-start text-left">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {selectedTicket.employeeName ? selectedTicket.employeeName.charAt(0).toUpperCase() : 'E'}
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
                        isAdminReply ? 'bg-blue-50 text-slate-800 dark:bg-slate-950 dark:text-slate-200' : 'bg-slate-100 dark:bg-slate-800 text-slate-750 dark:text-slate-300'
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
                    placeholder="Submit reply or recommendation notes..." 
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="flex-grow bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-850 p-2.5 rounded-xl text-xs focus:outline-none"
                  />
                  <button 
                    type="submit"
                    className="p-2.5 bg-[#1E40AF] hover:bg-[#1E40AF]/90 text-white rounded-xl flex items-center justify-center shadow-md shadow-blue-800/10 transition-colors"
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
              <p className="text-xs">Please select a ticket from the left panel to review timeline conversation.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default Support;
