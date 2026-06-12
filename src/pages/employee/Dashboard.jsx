import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  CheckCircle, Clock, AlertTriangle, Calendar, Award, 
  Briefcase, CheckSquare, ChevronRight, UserCircle
} from 'lucide-react';
import { employeeService, projectService, scheduleService } from '../../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [employeeProfile, setEmployeeProfile] = useState(null);
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [personalSchedules, setPersonalSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [metrics, setMetrics] = useState({
    assigned: 0,
    pending: 0,
    completed: 0,
    deadlinesCount: 0
  });

  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const [empData, projData, schData] = await Promise.all([
          employeeService.getAll(),
          projectService.getAll(),
          scheduleService.getAll()
        ]);

        // Find matching employee by email
        const matchedEmp = empData.find(e => e.email.toLowerCase() === user.email.toLowerCase());
        
        if (matchedEmp) {
          setEmployeeProfile(matchedEmp);

          const tasks = matchedEmp.tasks || [];
          const pending = tasks.filter(t => t.status !== 'Completed').length;
          const completed = tasks.filter(t => t.status === 'Completed').length;
          
          setMetrics({
            assigned: tasks.length,
            pending: pending,
            completed: completed,
            deadlinesCount: pending
          });

          // Projects they are assigned to (where name matching or team tags match)
          const matchedProjects = projData.filter(p => {
            const clientMatch = p.client?.toLowerCase() === matchedEmp.department?.toLowerCase();
            return clientMatch || p.name?.toLowerCase().includes('portal') || p.name?.toLowerCase().includes('recharts');
          });
          setAssignedProjects(matchedProjects);

          // Schedules assigned to this employee id
          const empId = matchedEmp._id || matchedEmp.id;
          const matchedSchedules = schData.filter(s => s.employeeId === empId);
          setPersonalSchedules(matchedSchedules);
        } else {
          // Fallback seeding if employee record is not created yet
          setMetrics({
            assigned: 5,
            pending: 3,
            completed: 2,
            deadlinesCount: 3
          });
        }
      } catch (err) {
        console.error('Failed to load employee metrics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployeeData();
  }, [user]);

  const cardsList = [
    { label: "Assigned Tasks", value: metrics.assigned, icon: CheckSquare, color: "bg-indigo-50 border-indigo-100 text-indigo-600 dark:bg-slate-900" },
    { label: "Pending Tasks", value: metrics.pending, icon: Clock, color: "bg-amber-50 border-amber-100 text-amber-600 dark:bg-slate-900" },
    { label: "Completed Tasks", value: metrics.completed, icon: CheckCircle, color: "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-slate-900" },
    { label: "Upcoming Deadlines", value: metrics.deadlinesCount, icon: AlertTriangle, color: "bg-rose-50 border-rose-100 text-rose-600 dark:bg-slate-900" },
  ];

  return (
    <div className="space-y-6">
      
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-6 rounded-2xl shadow-sm text-left">
        <div>
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider block">Avon Technologies Portal</span>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">Welcome Back, {user?.name || 'Employee'}</h1>
          <p className="text-xs text-slate-500 mt-1">Audit your work timeline, verify daily schedule agendas, and track assigned tasks.</p>
        </div>
        <div className="flex items-center space-x-2 bg-indigo-50 dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 px-4 py-2.5 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 shrink-0">
          <UserCircle className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>Department: {employeeProfile?.department || 'AIML Associate'}</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cardsList.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm text-left flex justify-between items-center group hover:border-indigo-500/20 transition-all duration-300`}>
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">{card.label}</span>
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white block">
                  {isLoading ? '...' : card.value}
                </span>
              </div>
              <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        
        {/* Left Side: Daily agenda Tasks */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4 flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-805 flex justify-between items-center">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-755 dark:text-slate-300">Daily Agenda Milestones</h3>
              <p className="text-[9px] text-slate-405">Assigned tasks matching your profile</p>
            </div>
            <span className="text-[10px] text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded font-bold dark:bg-slate-800 dark:text-indigo-400">Current Sprint</span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-1">
            {employeeProfile?.tasks && employeeProfile.tasks.length > 0 ? (
              employeeProfile.tasks.slice(0, 4).map((task, tIdx) => {
                const isCompleted = task.status === 'Completed';
                return (
                  <div 
                    key={tIdx}
                    className="flex justify-between items-center p-3 bg-[#F8FAFC] dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850 rounded-xl shadow-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span className={`text-xs font-semibold text-slate-800 dark:text-slate-250 ${isCompleted ? 'line-through text-slate-400 font-normal' : ''}`}>{task.title}</span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-455 font-semibold">Due: {task.deadline}</span>
                  </div>
                );
              })
            ) : (
              <div className="py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center text-slate-500 text-xs italic">
                No active tasks assigned to your agenda.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Quick info block */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-755 dark:text-slate-300 pb-2 border-b border-slate-100 dark:border-slate-805">Work Profile Summary</h3>
          <div className="space-y-4 text-xs">
            <div className="flex justify-between pb-3 border-b border-slate-50 dark:border-slate-805/50">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Full Name</span>
              <span className="font-bold text-slate-800 dark:text-white">{employeeProfile?.name || user?.name}</span>
            </div>
            <div className="flex justify-between pb-3 border-b border-slate-50 dark:border-slate-805/50">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Designated Role</span>
              <span className="font-bold text-slate-800 dark:text-white">{employeeProfile?.role || 'Associate'}</span>
            </div>
            <div className="flex justify-between pb-3 border-b border-slate-50 dark:border-slate-805/50">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Joining Date</span>
              <span className="font-bold font-mono text-slate-800 dark:text-white">{employeeProfile?.joinDate || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Active Projects</span>
              <span className="font-bold text-indigo-650 dark:text-indigo-400">{assignedProjects.length} Projects</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
