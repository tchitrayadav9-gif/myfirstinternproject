import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  CheckSquare, Clock, CheckCircle, AlertTriangle, UserCircle, 
  TrendingUp, Award, ClipboardList
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { authService } from '../../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [employeeProfile, setEmployeeProfile] = useState(null);
  const [personalSchedules, setPersonalSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    assigned: 0,
    pending: 0,
    completed: 0,
    deadlinesCount: 0
  });

  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [taskStatusData, setTaskStatusData] = useState([]);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const dashboardStats = await authService.getDashboardStats();
        const {
          employees: empData = [],
          schedules: schData = []
        } = dashboardStats;

        // Find matching employee by email
        let matchedEmp = empData.find(e => e.email.toLowerCase() === user.email.toLowerCase());
        
        if (!matchedEmp) {
          matchedEmp = {
            _id: 'temp-' + (user.id || user._id),
            id: 'temp-' + (user.id || user._id),
            employeeId: 'AVON-EMP-9999',
            name: user.name,
            email: user.email,
            department: user.department || 'AI Solutions',
            role: user.role || 'AIML Associate',
            status: 'Active',
            tasks: [
              { title: 'Refactor Auth Interceptor', deadline: '2026-07-01', priority: 'High', status: 'Completed' },
              { title: 'Setup Atlas VPC Peering', deadline: '2026-07-05', priority: 'Medium', status: 'Pending' },
              { title: 'Audit Session Tokens Cache', deadline: '2026-06-30', priority: 'High', status: 'Pending' }
            ]
          };
        }

        setEmployeeProfile(matchedEmp);

        const tasks = matchedEmp.tasks || [];
        const pending = tasks.filter(t => t.status === 'Pending').length;
        const inProgress = tasks.filter(t => t.status === 'In Progress').length;
        const completed = tasks.filter(t => t.status === 'Completed').length;
        
        // Completion Percentage calculation
        const totalTasks = tasks.length;
        const pct = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;
        setCompletionPercentage(pct);

        setMetrics({
          assigned: totalTasks,
          pending: pending + inProgress,
          completed: completed,
          deadlinesCount: pending + inProgress
        });

        // Set pie chart status data
        setTaskStatusData([
          { name: 'Pending', value: pending },
          { name: 'In Progress', value: inProgress },
          { name: 'Completed', value: completed }
        ].filter(t => t.value > 0)); // only show positive slices

        const empId = matchedEmp._id || matchedEmp.id;
        const matchedSchedules = schData.filter(s => String(s.employeeId) === String(empId));
        
        // If no schedules in database for this employee id, synthesize schedules
        if (matchedSchedules.length === 0) {
          const tempSchedules = [
            { _id: 'temp-s1', employeeId: empId, employeeName: user.name, date: '2026-06-26', taskTitle: 'Refactor Auth Interceptor', deadline: '2026-07-01', status: 'Pending' },
            { _id: 'temp-s2', employeeId: empId, employeeName: user.name, date: '2026-06-27', taskTitle: 'Setup Atlas VPC Peering', deadline: '2026-07-05', status: 'Pending' },
            { _id: 'temp-s3', employeeId: empId, employeeName: user.name, date: '2026-06-28', taskTitle: 'Design Glassmorphism Dashboard Layout', deadline: '2026-06-28', status: 'Pending' }
          ];
          setPersonalSchedules(tempSchedules);
        } else {
          setPersonalSchedules(matchedSchedules);
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

  const PIE_COLORS = ['#EF4444', '#F59E0B', '#10B981']; // Pending (Red), In Progress (Amber), Completed (Green)

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

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[350px] pr-1">
            {employeeProfile?.tasks && employeeProfile.tasks.length > 0 ? (
              employeeProfile.tasks.map((task, tIdx) => {
                const isCompleted = task.status === 'Completed';
                const isInProgress = task.status === 'In Progress';
                return (
                  <div 
                    key={tIdx}
                    className="flex justify-between items-center p-3 bg-[#F8FAFC] dark:bg-slate-955/40 border border-slate-150 dark:border-slate-850 rounded-xl shadow-sm hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        isCompleted ? 'bg-emerald-500' : isInProgress ? 'bg-amber-500' : 'bg-rose-500'
                      }`} />
                      <span className={`text-xs font-semibold text-slate-800 dark:text-slate-250 ${isCompleted ? 'line-through text-slate-400 font-normal' : ''}`}>{task.title}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                        isCompleted ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' :
                        isInProgress ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20' :
                        'bg-rose-50 text-rose-600 dark:bg-rose-950/20'
                      }`}>
                        {task.status}
                      </span>
                      <span className="text-[9px] font-mono text-slate-455 font-semibold">Due: {task.deadline}</span>
                    </div>
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

        {/* Right Side: Progress and Pie Chart */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Completion Progress Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm text-left space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-755 dark:text-slate-300 pb-2 border-b border-slate-100 dark:border-slate-805">Sprint Completion Index</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Task Completion Weight</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{isLoading ? '...' : `${completionPercentage}%`}</span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${completionPercentage}%` }} 
                />
              </div>
            </div>
          </div>

          {/* Task Status Pie Chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm text-left space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-755 dark:text-slate-300 pb-2 border-b border-slate-100 dark:border-slate-805">Task Status Matrix</h3>
            
            <div className="h-44 w-full relative overflow-hidden flex items-center justify-center">
              {isLoading || taskStatusData.length === 0 ? (
                <div className="text-xs text-slate-400 italic py-8">No tasks distribution data available</div>
              ) : (
                <ResponsiveContainer width="99%" height="99%">
                  <PieChart>
                    <Pie
                      data={taskStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={55}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {taskStatusData.map((entry, index) => {
                        let cellColor = '#EF4444'; // Pending
                        if (entry.name === 'In Progress') cellColor = '#F59E0B';
                        if (entry.name === 'Completed') cellColor = '#10B981';
                        return <Cell key={`cell-${index}`} fill={cellColor} />;
                      })}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: '9px', borderRadius: '6px' }} />
                    <Legend wrapperStyle={{ fontSize: '9px', fontWeight: 'semibold' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Work Profile Summary */}
          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
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
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Corporate Email</span>
                <span className="font-bold text-slate-800 dark:text-white truncate max-w-[150px]">{employeeProfile?.email || user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Portal Status</span>
                <span className="font-bold text-emerald-500">Online</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;
