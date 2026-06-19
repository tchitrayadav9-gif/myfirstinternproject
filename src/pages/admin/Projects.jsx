import React, { useState, useEffect } from 'react';
import { 
  Plus, Clock, Briefcase, ChevronRight, User, AlertCircle, 
  X, ShieldAlert, Trash2
} from 'lucide-react';
import { projectService } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const Projects = () => {
  const [projectList, setProjectList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Form states
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    progress: 0,
    status: 'Backlog',
    priority: 'Medium',
    due: new Date().toISOString().split('T')[0]
  });

  const stages = ["Backlog", "In Progress", "In Review", "Delivered"];

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const data = await projectService.getAll();
      setProjectList(data);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400';
      case 'Medium': return 'bg-amber-50 border-amber-100 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400';
      default: return 'bg-sky-50 border-sky-100 text-sky-600 dark:bg-sky-950/20 dark:text-sky-400';
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Project title is required.';
    if (!formData.client.trim()) errors.client = 'Client company name is required.';
    if (!formData.due) errors.due = 'Target deadline due date is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await projectService.create(formData);
      setIsAddModalOpen(false);
      resetForm();
      fetchProjects();
    } catch (err) {
      console.error(err);
      setFormErrors({ server: err.response?.data?.message || 'Error occurred.' });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const projId = selectedProject._id || selectedProject.id;
      const finalProgress = formData.status === 'Delivered' ? 100 : formData.progress;
      await projectService.update(projId, { ...formData, progress: Number(finalProgress) });
      setIsEditModalOpen(false);
      resetForm();
      fetchProjects();
    } catch (err) {
      console.error(err);
      setFormErrors({ server: err.response?.data?.message || 'Error occurred.' });
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      const projId = selectedProject._id || selectedProject.id;
      await projectService.delete(projId);
      setIsEditModalOpen(false);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (proj) => {
    setSelectedProject(proj);
    setFormData({
      name: proj.name,
      client: proj.client,
      progress: proj.progress,
      status: proj.status,
      priority: proj.priority || 'Medium',
      due: proj.due
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      client: '',
      progress: 0,
      status: 'Backlog',
      priority: 'Medium',
      due: new Date().toISOString().split('T')[0]
    });
    setFormErrors({});
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm text-left">
        <div>
          <span className="text-[10px] text-[#1E40AF] dark:text-cyan-400 font-bold uppercase tracking-wider block">Avon Kanban Pipelines</span>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">Project Pipelines</h1>
          <p className="text-xs text-slate-500 mt-1">Audit ongoing application sprint deliverables and timeline completions.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsAddModalOpen(true); }}
          className="px-4 py-2.5 bg-[#1E40AF] hover:bg-[#1E40AF]/90 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-blue-800/10 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Kanban Board columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
        {stages.map((stage) => {
          const stageProjects = projectList.filter(p => p.status === stage);
          return (
            <div key={stage} className="bg-slate-100/60 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col space-y-4 min-h-[500px]">
              
              {/* Header */}
              <div className="flex justify-between items-center bg-white dark:bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-850">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{stage}</span>
                <span className="text-[10px] text-slate-500 font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {isLoading ? '...' : stageProjects.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex-grow space-y-3 overflow-y-auto max-h-[550px] pr-1">
                {isLoading ? (
                  Array.from({ length: 2 }).map((_, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 h-28 animate-pulse" />
                  ))
                ) : stageProjects.length > 0 ? (
                  stageProjects.map((project, idx) => {
                    const projId = project._id ? String(project._id) : (project.id ? String(project.id) : `proj-${idx}`);
                    return (
                      <div 
                        key={projId}
                        onClick={() => openEditModal(project)}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-855 hover:border-[#1E40AF]/20 rounded-xl p-4 text-xs space-y-4 shadow-sm cursor-pointer group transition-all duration-300"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-slate-800 dark:text-white group-hover:text-[#1E40AF] dark:group-hover:text-cyan-400 transition-colors truncate max-w-[130px]">
                            {project.name}
                          </span>
                          <span className={`px-2 py-0.5 text-[8px] font-bold border rounded-md uppercase tracking-wider ${getPriorityColor(project.priority)}`}>
                            {project.priority || 'Medium'}
                          </span>
                        </div>

                        <div className="flex items-center space-x-1.5 text-slate-500 text-[10px]">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Client: <span className="text-slate-800 dark:text-slate-200 font-semibold">{project.client}</span></span>
                        </div>

                        {/* progress */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                            <span>Sprint Completion</span>
                            <span>{project.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-[#1E40AF] dark:bg-cyan-500 h-full rounded-full transition-all duration-350"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="border-t border-slate-100 dark:border-slate-800 pt-2.5 flex justify-between items-center text-[9px] text-slate-450">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>Due: {project.due}</span>
                          </span>
                          <ChevronRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform text-slate-400" />
                        </div>

                      </div>
                    );
                  })
                ) : (
                  <div className="h-28 border border-dashed border-slate-200 dark:border-slate-800/80 rounded-xl flex flex-col items-center justify-center text-slate-400 text-[10px] space-y-1.5">
                    <Briefcase className="w-5 h-5 text-slate-300" />
                    <span>No projects in this stage</span>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Project Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 relative z-10 space-y-4 shadow-2xl text-left"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Project Pipeline</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Initialize a new client application sprint contract.</p>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-455 hover:text-slate-700">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {formErrors.server && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-600">
                  <span>{formErrors.server}</span>
                </div>
              )}

              <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Project Title</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Predictive recommendations engine"
                    className="w-full bg-[#F8FAFC] dark:bg-slate-955 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                  />
                  {formErrors.name && <p className="text-[9px] text-rose-500 mt-1">{formErrors.name}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Client Company</label>
                  <input 
                    type="text" 
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    placeholder="e.g. Google India"
                    className="w-full bg-[#F8FAFC] dark:bg-slate-955 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                  />
                  {formErrors.client && <p className="text-[9px] text-rose-500 mt-1">{formErrors.client}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-505 font-bold uppercase tracking-wider">Priority Level</label>
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

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-550 font-bold uppercase tracking-wider">Initial Column Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-[#F8FAFC] dark:bg-slate-955 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl"
                    >
                      {stages.map((st, i) => (
                        <option key={i} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-505 font-bold uppercase tracking-wider">Target Due Date</label>
                    <input 
                      type="date" 
                      value={formData.due}
                      onChange={(e) => setFormData({ ...formData, due: e.target.value })}
                      className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                    />
                    {formErrors.due && <p className="text-[9px] text-rose-500 mt-1">{formErrors.due}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-505 font-bold uppercase tracking-wider">Initial Progress ({formData.progress}%)</label>
                    <input 
                      type="range" 
                      min="0"
                      max="100"
                      step="5"
                      value={formData.progress}
                      onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                      className="w-full mt-2 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg appearance-none cursor-pointer accent-[#1E40AF]"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-2.5 bg-[#1E40AF] hover:bg-[#1E40AF]/90 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-800/10"
                >
                  Create Project Card
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Project Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
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
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Modify Project Card</h3>
                  <p className="text-[10px] text-slate-550 mt-0.5">Edit progress status or change column placement.</p>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-455 hover:text-slate-700">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {formErrors.server && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-600">
                  <span>{formErrors.server}</span>
                </div>
              )}

              <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Project Title</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                  />
                  {formErrors.name && <p className="text-[9px] text-rose-500 mt-1">{formErrors.name}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Client Company</label>
                  <input 
                    type="text" 
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                  />
                  {formErrors.client && <p className="text-[9px] text-rose-500 mt-1">{formErrors.client}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-505 font-bold uppercase tracking-wider">Priority Level</label>
                    <select 
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full bg-[#F8FAFC] dark:bg-slate-955 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-550 font-bold uppercase tracking-wider">Column Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-[#F8FAFC] dark:bg-slate-955 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl"
                    >
                      {stages.map((st, i) => (
                        <option key={i} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-505 font-bold uppercase tracking-wider">Target Due Date</label>
                    <input 
                      type="date" 
                      value={formData.due}
                      onChange={(e) => setFormData({ ...formData, due: e.target.value })}
                      className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                    />
                    {formErrors.due && <p className="text-[9px] text-rose-500 mt-1">{formErrors.due}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-505 font-bold uppercase tracking-wider">Sprint Progress ({formData.status === 'Delivered' ? 100 : formData.progress}%)</label>
                    <input 
                      type="range" 
                      min="0"
                      max="100"
                      step="5"
                      disabled={formData.status === 'Delivered'}
                      value={formData.status === 'Delivered' ? 100 : formData.progress}
                      onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                      className="w-full mt-2 bg-slate-100 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-lg appearance-none cursor-pointer accent-[#1E40AF] disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-2 text-[10px] uppercase font-bold tracking-wider">
                  <button 
                    type="button"
                    onClick={handleDeleteSubmit}
                    className="w-1/3 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl border border-rose-200 transition-all flex items-center justify-center space-x-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                  <button 
                    type="submit"
                    className="w-2/3 py-2.5 bg-[#1E40AF] hover:bg-[#1E40AF]/90 text-white rounded-xl transition-all shadow-md shadow-blue-800/10"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Projects;
