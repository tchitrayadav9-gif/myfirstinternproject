import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  CheckSquare, Calendar, Clock, AlertTriangle, ShieldAlert,
  Loader2, CheckCircle2, ChevronRight
} from 'lucide-react';
import { employeeService } from '../../services/api';

const MyTasks = () => {
  const { user } = useAuth();
  const [employeeProfile, setEmployeeProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const fetchMyTasks = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await employeeService.getAll();
      const matched = data.find(e => e.email.toLowerCase() === user.email.toLowerCase());
      if (matched) {
        setEmployeeProfile(matched);
        setTasks(matched.tasks || []);
      }
    } catch (err) {
      console.error('Failed to load personal tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTasks();
  }, [user]);

  const handleStatusChange = async (task, nextStatus) => {
    try {
      const empId = employeeProfile._id || employeeProfile.id;
      const taskId = task._id || task.id;
      
      setStatusMsg('Updating status...');
      
      // Update task in backend
      await employeeService.updateTask(empId, taskId, {
        ...task,
        status: nextStatus
      });

      setStatusMsg('Status updated.');
      setTimeout(() => setStatusMsg(''), 2000);
      
      // Refresh list
      fetchMyTasks();
    } catch (err) {
      console.error('Failed to update status:', err);
      setStatusMsg('Failed to update.');
      setTimeout(() => setStatusMsg(''), 3000);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-950/20';
      case 'Medium': return 'bg-amber-50 border-amber-100 text-amber-600 dark:bg-amber-950/20';
      default: return 'bg-sky-50 border-sky-100 text-sky-600 dark:bg-sky-950/20';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-202 dark:border-slate-800 p-6 rounded-2xl shadow-sm text-left">
        <div>
          <span className="text-[10px] text-indigo-650 dark:text-indigo-400 font-bold uppercase tracking-wider block">Avon Workspace</span>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">My Delegated Tasks</h1>
          <p className="text-xs text-slate-500 mt-1">Review assigned sprint tasks and update progress milestones.</p>
        </div>
        {statusMsg && (
          <div className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 animate-pulse">
            {statusMsg}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {tasks.map((task, idx) => {
            const taskId = task._id || task.id;
            return (
              <div 
                key={taskId || idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/20 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-0.5 text-[8px] font-bold border rounded-md uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                      {task.priority || 'Medium'}
                    </span>
                    <select 
                      value={task.status || 'Pending'}
                      onChange={(e) => handleStatusChange(task, e.target.value)}
                      className={`text-[9px] font-bold uppercase tracking-wider rounded border px-2 py-0.5 focus:outline-none ${
                        task.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        task.status === 'In Progress' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-rose-50 text-rose-600 border-rose-100'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <h3 className="text-sm font-bold text-slate-855 dark:text-white leading-relaxed">{task.title}</h3>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-center text-[10px] text-slate-500">
                  <span className="flex items-center space-x-1.5 font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-wide">
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>My Task</span>
                  </span>
                  <span className="flex items-center space-x-1 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Due: {task.deadline}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-2xl py-12 text-center text-slate-400 space-y-2">
          <CheckCircle2 className="w-10 h-10 mx-auto text-slate-200" />
          <p className="text-xs">No active sprint milestones assigned. You're fully caught up!</p>
        </div>
      )}

    </div>
  );
};

export default MyTasks;
