import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, ComposedChart, Area
} from 'recharts';
import { employeeService, projectService, ticketService } from '../../services/api';
import { TrendingUp, Award, BarChart3, AlertCircle } from 'lucide-react';

const Analytics = () => {
  const [mounted, setMounted] = useState(false);
  const [departmentWorkload, setDepartmentWorkload] = useState([]);
  const [ticketResponseData, setTicketResponseData] = useState([]);
  const [deliveryVelocity, setDeliveryVelocity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const compileAnalytics = async () => {
      setIsLoading(true);
      try {
        const [empData, projData, ticketData] = await Promise.all([
          employeeService.getAll(),
          projectService.getAll(),
          ticketService.getAll()
        ]);

        // 1. Compile Department Workloads (Radar chart)
        const depts = ["Web Development", "Mobile Apps", "AI Solutions", "Cloud Computing", "UI/UX Design", "Support Operations"];
        const deptRadar = depts.map(dept => {
          const empCount = empData.filter(e => e.department === dept).length;
          const totalTasks = empData
            .filter(e => e.department === dept)
            .reduce((acc, curr) => acc + (curr.tasks?.length || 0), 0);
          
          return {
            subject: dept.split(' ')[0], // short name
            Staff: empCount * 10, // scale for visual representation
            Tasks: totalTasks * 5,
            fullMark: 100
          };
        });
        setDepartmentWorkload(deptRadar);

        // 2. Ticket Response time progression (Composed Area + Line Chart)
        setTicketResponseData([
          { month: 'Jan', Raised: 12, Resolved: 8 },
          { month: 'Feb', Raised: 19, Resolved: 15 },
          { month: 'Mar', Raised: 15, Resolved: 12 },
          { month: 'Apr', Raised: 22, Resolved: 18 },
          { month: 'May', Raised: ticketData.length + 5, Resolved: ticketData.filter(t => t.status === 'Resolved').length + 4 }
        ]);

        // 3. Delivery velocity (Line Chart)
        setDeliveryVelocity([
          { sprint: 'Sprint 1', velocity: 10 },
          { sprint: 'Sprint 2', velocity: 15 },
          { sprint: 'Sprint 3', velocity: 12 },
          { sprint: 'Sprint 4', velocity: 22 },
          { sprint: 'Sprint 5', velocity: projData.length * 4 || 16 }
        ]);

      } catch (err) {
        console.error('Failed to compile analytics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    compileAnalytics();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm text-left">
        <div>
          <span className="text-[10px] text-[#1E40AF] dark:text-cyan-400 font-bold uppercase tracking-wider block">Avon Performance Audit</span>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">Analytics Workspace</h1>
          <p className="text-xs text-slate-500 mt-1">Review department workloads, ticket response turnaround matrices, and sprint delivery velocity charts.</p>
        </div>
        <div className="flex items-center space-x-2 bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#1E40AF] dark:text-cyan-455">
          <BarChart3 className="w-4 h-4 text-[#06B6D4]" />
          <span>Real-time Sync Active</span>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 h-64 animate-pulse" />
          <div className="bg-white p-6 rounded-2xl border border-slate-200 h-64 animate-pulse" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
          
          {/* Radar Workloads */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm min-w-0">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Department Workloads (Radar)</h3>
              <p className="text-[9px] text-slate-405 font-medium">Comparative metrics mapping total employees (scaled) vs delegated tasks</p>
            </div>
            <div className="h-64 w-full flex justify-center items-center">
              {!mounted ? (
                <div className="h-full w-full bg-slate-100 dark:bg-slate-800/40 animate-pulse rounded-xl" />
              ) : (
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={departmentWorkload}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" fontSize={9} />
                    <PolarRadiusAxis fontSize={9} />
                    <Radar name="Staff Ratio" dataKey="Staff" stroke="#1E40AF" fill="#1E40AF" fillOpacity={0.25} isAnimationActive={false} />
                    <Radar name="Delegated Milestones" dataKey="Tasks" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.25} isAnimationActive={false} />
                    <Legend wrapperStyle={{ fontSize: '9px', fontWeight: 'bold' }} />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Ticket Response progression */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm min-w-0">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Support Desk Response Rate</h3>
              <p className="text-[9px] text-slate-405 font-medium">Monthly tickets raised vs resolved timeline progress</p>
            </div>
            <div className="h-64 w-full">
              {!mounted ? (
                <div className="h-full w-full bg-slate-100 dark:bg-slate-800/40 animate-pulse rounded-xl" />
              ) : (
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <ComposedChart data={ticketResponseData}>
                    <CartesianGrid stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" fontSize={9} stroke="#94a3b8" tickLine={false} />
                    <YAxis fontSize={9} stroke="#94a3b8" tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                    <Legend wrapperStyle={{ fontSize: '9px', fontWeight: 'bold' }} />
                    <Area type="monotone" dataKey="Raised" fill="#1e40af" fillOpacity={0.1} stroke="#1e40af" strokeWidth={1.5} isAnimationActive={false} />
                    <Bar dataKey="Resolved" barSize={20} fill="#10B981" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Sprint Velocity */}
          <div className="lg:col-span-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm min-w-0">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Sprint Delivery Velocity</h3>
              <p className="text-[9px] text-slate-405 font-medium">Closed backlog deliverables index per sprint interval</p>
            </div>
            <div className="h-64 w-full">
              {!mounted ? (
                <div className="h-full w-full bg-slate-100 dark:bg-slate-800/40 animate-pulse rounded-xl" />
              ) : (
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <LineChart data={deliveryVelocity}>
                    <CartesianGrid stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="sprint" fontSize={9} stroke="#94a3b8" tickLine={false} />
                    <YAxis fontSize={9} stroke="#94a3b8" tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="velocity" stroke="#0ea5e9" strokeWidth={2.5} dot={{ r: 4 }} name="Sprints closed index" isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default Analytics;
