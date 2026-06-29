import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Briefcase, Calendar, Clock, Loader2, FolderClock 
} from 'lucide-react';
import { projectService, employeeService } from '../../services/api';

const MyProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMyProjects = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const [projData, empData] = await Promise.all([
          projectService.getAll(),
          employeeService.getAll()
        ]);

        let activeEmpData = empData;
        let activeProjData = projData;

        if (activeEmpData.length === 0) {
          activeEmpData = [
            { _id: 'mock-1', name: user.name, email: user.email, department: 'AI Solutions', role: 'AIML Associate' }
          ];
          activeProjData = [
            { _id: 'mock-p1', name: 'Cloud Migration Pipeline', client: 'Nexus Ventures', status: 'In Progress', priority: 'High', due: '2026-08-31', description: 'Enterprise migration pipeline' },
            { _id: 'mock-p2', name: 'UI Redesign & Theming', client: 'Hooli Inc', status: 'In Progress', priority: 'Medium', due: '2026-07-31', description: 'Modern dark/light layout themes' },
            { _id: 'mock-p3', name: 'BERT Helpdesk Integration', client: 'Raviga Capital', status: 'Backlog', priority: 'High', due: '2026-09-15', description: 'Train NLP classifiers' },
            { _id: 'mock-p4', name: 'SSL Certificate Automation', client: 'Initech Corp', status: 'Delivered', priority: 'Low', due: '2026-06-25', description: 'Auto renew cron jobs' }
          ];
        }

        const matchedEmp = activeEmpData.find(e => e.email.toLowerCase() === user.email.toLowerCase());
        if (matchedEmp) {
          // Projects matching department or containing tags matching portal, analytics, AI
          const myProjects = activeProjData.filter(p => {
            const clientMatch = p.client?.toLowerCase() === matchedEmp.department?.toLowerCase();
            return clientMatch || p.name?.toLowerCase().includes('portal') || p.name?.toLowerCase().includes('recharts') || p.name?.toLowerCase().includes('migration') || p.name?.toLowerCase().includes('helpdesk');
          });
          setProjects(myProjects);
        }
      } catch (err) {
        console.error('Failed to load employee projects:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyProjects();
  }, [user]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-955/20';
      case 'Medium': return 'bg-amber-50 border-amber-100 text-amber-600 dark:bg-amber-955/20';
      default: return 'bg-sky-50 border-sky-100 text-sky-600 dark:bg-sky-955/20';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm text-left">
        <span className="text-[10px] text-indigo-650 dark:text-indigo-400 font-bold uppercase tracking-wider block">Avon Workspace</span>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">My Assigned Projects</h1>
        <p className="text-xs text-slate-500 mt-1">Review active corporate project contracts you are allocated to and audit sprint delivery timelines.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {projects.map((project, idx) => {
            const projId = project._id || project.id;
            return (
              <div 
                key={projId || idx}
                className="bg-white dark:bg-slate-900 border border-slate-202 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-indigo-650 dark:text-indigo-400 font-bold uppercase tracking-wider">Avon Contract</span>
                    <span className={`px-2 py-0.5 text-[8px] font-bold border rounded-md uppercase tracking-wider ${getPriorityColor(project.priority)}`}>
                      {project.priority || 'Medium'}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-850 dark:text-white leading-relaxed">{project.name}</h3>
                  <div className="flex items-center space-x-1.5 text-slate-505 text-xs font-semibold">
                    <span className="text-slate-400">Account Client:</span>
                    <span className="text-slate-800 dark:text-slate-205">{project.client}</span>
                  </div>
                </div>

                <div className="space-y-3.5">
                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                      <span>Sprint Progress Completion</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full rounded-full transition-all duration-350"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-center text-[10px] text-slate-500 font-semibold">
                    <span className="flex items-center space-x-1">
                      <FolderClock className="w-4 h-4 text-indigo-500" />
                      <span>Pipeline: {project.status}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>Deadline due: {project.due}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-2xl py-12 text-center text-slate-455 space-y-2">
          <Briefcase className="w-10 h-10 mx-auto text-slate-200" />
          <p className="text-xs">No active projects assigned to your department roster yet.</p>
        </div>
      )}

    </div>
  );
};

export default MyProjects;
