import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, Briefcase, CheckCircle, Clock, Calendar, FolderOpen,
  ArrowUpRight, Award, TrendingUp
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import { authService, employeeService } from '../../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalClients: 0,
    totalProjects: 0,
    pendingTasks: 0,
    completedTasks: 0,
    todaySchedules: 0
  });

  const [employees, setEmployees] = useState([]);
  const [tasksCompletedData, setTasksCompletedData] = useState([]);
  const [projectsCompletedData, setProjectsCompletedData] = useState([]);
  const [productivityData, setProductivityData] = useState([]);
  const [employeeDistributionData, setEmployeeDistributionData] = useState([]);

  useEffect(() => {
    setMounted(true);
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const [statsData, chartsData, empList] = await Promise.all([
          authService.getDashboardStats(),
          authService.getDashboardCharts(),
          employeeService.getAll()
        ]);

        setStats(statsData);
        setEmployees(empList);

        setTasksCompletedData(chartsData.monthlyTasksCompleted || []);
        setProjectsCompletedData(chartsData.projectsCompleted || []);
        setProductivityData(chartsData.monthlyProductivity || []);
        setEmployeeDistributionData(chartsData.employeeDistribution || []);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const kpiList = [
    { label: "Total Employees", value: stats.totalEmployees, icon: Users, color: "text-[#1E40AF] bg-blue-50" },
    { label: "Total Clients", value: stats.totalClients, icon: FolderOpen, color: "text-purple-600 bg-purple-50" },
    { label: "Total Projects", value: stats.totalProjects, icon: Briefcase, color: "text-emerald-600 bg-emerald-50" },
    { label: "Pending Tasks", value: stats.pendingTasks, icon: Clock, color: "text-amber-600 bg-amber-50" },
    { label: "Completed Tasks", value: stats.completedTasks, icon: CheckCircle, color: "text-teal-600 bg-teal-50" },
    { label: "Today's Schedule", value: stats.todaySchedules, icon: Calendar, color: "text-[#06B6D4] bg-cyan-50" },
  ];

  // 7 colors for 7 departments
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm text-left">
        <div className="text-left">
          <span className="text-[10px] text-[#1E40AF] dark:text-cyan-400 font-bold uppercase tracking-wider block">Avon Admin Portal</span>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">Welcome Back, Admin</h1>
          <p className="text-xs text-slate-500 mt-1">Configure internal pipelines, coordinate schedules, and manage team credentials.</p>
        </div>
        <div className="flex items-center space-x-2 bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#1E40AF] dark:text-cyan-400">
          <Award className="w-4 h-4 text-cyan-500 shrink-0" />
          <span>Operational Node Status: Active</span>
        </div>
      </div>

      {/* KPI stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {kpiList.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm text-left relative overflow-hidden group hover:border-[#1E40AF]/30 transition-all duration-300">
              <div className="flex justify-between items-start gap-2">
                <div className="space-y-1 min-w-0 flex-1">
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block truncate">{kpi.label}</span>
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white block">
                    {isLoading ? '...' : kpi.value}
                  </span>
                </div>
                <div className={`w-9 h-9 rounded-xl ${kpi.color} dark:bg-slate-800 flex items-center justify-center shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-center space-x-1 text-[9px] text-[#06B6D4] dark:text-cyan-400 font-bold tracking-wide">
                <span>Avon Registry</span>
                <ArrowUpRight className="w-3 h-3" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recharts Visualizations - Symmetric Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Monthly Tasks Completed (Bar) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm text-left">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Monthly Tasks Completed</h3>
              <p className="text-[9px] text-slate-405">Closed milestones per calendar month</p>
            </div>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="h-52 w-full min-w-0 relative overflow-hidden">
            {isLoading || !mounted ? (
              <div className="h-full bg-slate-100 dark:bg-slate-800/40 animate-pulse rounded-xl" />
            ) : (
              <ResponsiveContainer width="99%" height="99%">
                <BarChart data={tasksCompletedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" fontSize={9} stroke="#94a3b8" tickLine={false} />
                  <YAxis fontSize={9} stroke="#94a3b8" tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                  <Bar dataKey="Tasks" fill="#10B981" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Projects Completed Per Month (Line) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm text-left">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Projects Completed Per Month</h3>
              <p className="text-[9px] text-slate-405">Total delivered project repositories</p>
            </div>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="h-52 w-full min-w-0 relative overflow-hidden">
            {isLoading || !mounted ? (
              <div className="h-full bg-slate-100 dark:bg-slate-800/40 animate-pulse rounded-xl" />
            ) : (
              <ResponsiveContainer width="99%" height="99%">
                <LineChart data={projectsCompletedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" fontSize={9} stroke="#94a3b8" tickLine={false} />
                  <YAxis fontSize={9} stroke="#94a3b8" tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="Completed" stroke="#3B82F6" strokeWidth={2.5} name="Completed" dot={{ r: 4 }} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* Recharts Visualizations - Symmetric Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Monthly Employee Productivity (Area) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm text-left">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Monthly Employee Productivity</h3>
              <p className="text-[9px] text-slate-405 font-medium">Aggregated milestone execution weights index</p>
            </div>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="h-52 w-full min-w-0 relative overflow-hidden">
            {isLoading || !mounted ? (
              <div className="h-full bg-slate-100 dark:bg-slate-800/40 animate-pulse rounded-xl" />
            ) : (
              <ResponsiveContainer width="99%" height="99%">
                <AreaChart data={productivityData}>
                  <defs>
                    <linearGradient id="colorProductivity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" fontSize={9} stroke="#94a3b8" tickLine={false} />
                  <YAxis fontSize={9} stroke="#94a3b8" tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="Productivity" stroke="#F59E0B" fillOpacity={1} fill="url(#colorProductivity)" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Employee Distribution by Department (Pie) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm text-left">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Employee Distribution</h3>
              <p className="text-[9px] text-slate-405 font-medium">Headcount weights per corporate unit</p>
            </div>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="h-52 w-full min-w-0 relative overflow-hidden flex items-center justify-center">
            {isLoading || !mounted ? (
              <div className="w-32 h-32 rounded-full border-8 border-slate-100 dark:border-slate-800/40 animate-pulse" />
            ) : (
              <ResponsiveContainer width="99%" height="99%">
                <PieChart>
                  <Pie
                    data={employeeDistributionData}
                    cx="40%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                    isAnimationActive={false}
                  >
                    {employeeDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                  <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: '9px', fontWeight: 'bold' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* Overview Table - Full Width */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-left">
        <div className="p-4 border-b border-slate-150 dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-250">Active Employees Status Overview</h3>
          <span className="text-[10px] bg-blue-50 text-[#1E40AF] px-2.5 py-0.5 rounded-md font-semibold">Staff directory</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 font-bold uppercase tracking-wider text-[9px] border-b border-slate-100 dark:border-slate-800">
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Department</th>
                <th className="py-3 px-6">Tasks Count</th>
                <th className="py-3 px-6">Direct Availability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {employees.map((emp, idx) => {
                const empId = emp._id ? String(emp._id) : (emp.id ? String(emp.id) : `emp-${idx}`);
                const tasksCount = emp.tasks?.length || 0;
                return (
                  <tr key={empId} className="hover:bg-slate-50/50 dark:hover:bg-slate-850 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-slate-800 dark:text-white">{emp.name}</td>
                    <td className="py-3.5 px-6 font-semibold text-slate-500 dark:text-slate-400">{emp.department}</td>
                    <td className="py-3.5 px-6">
                      <span className="bg-blue-50 dark:bg-slate-800 text-[#1E40AF] dark:text-cyan-400 px-2 py-0.5 rounded font-bold">{tasksCount} Tasks</span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        emp.status === 'Active' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-450'
                      }`}>
                        {emp.status || 'Active'}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {employees.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-slate-400 italic">No employees found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
