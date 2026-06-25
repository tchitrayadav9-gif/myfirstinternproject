import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, ShieldAlert, Calendar, CheckSquare, 
  Clock, User, Tag, AlertCircle, X, Check
} from 'lucide-react';
import { employeeService } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const Tasks = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tasksList, setTasksList] = useState([]);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedEmp, setSelectedEmp] = useState(null); // hold reference of the task owner

  // Form states
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    employeeId: '',
    title: '',
    deadline: new Date().toISOString().split('T')[0],
    priority: 'Medium',
    status: 'Pending'
  });

  const fetchEmployeesAndTasks = async () => {
    setIsLoading(true);
    try {
      let data = await employeeService.getAll();

      if (data.length === 0) {
        data = [
          {
            _id: 'mock-1',
            id: 'mock-1',
            employeeId: 'AVON-EMP-1001',
            name: 'Alex Johnson',
            email: 'alex.johnson@avon.co.in',
            department: 'AI Solutions',
            role: 'Senior Web Developer',
            status: 'Active',
            tasks: [
              { title: 'Refactor Auth Interceptor', deadline: '2026-07-01', priority: 'High', status: 'Completed' },
              { title: 'Setup Atlas VPC Peering', deadline: '2026-07-05', priority: 'Medium', status: 'Pending' },
              { title: 'Audit Session Tokens Cache', deadline: '2026-06-30', priority: 'High', status: 'Pending' }
            ]
          },
          {
            _id: 'mock-2',
            id: 'mock-2',
            employeeId: 'AVON-EMP-1002',
            name: 'Sarah Connor',
            email: 'sarah.connor@avon.co.in',
            department: 'UI/UX Design',
            role: 'Lead UI/UX Designer',
            status: 'Active',
            tasks: [
              { title: 'Design Glassmorphism Dashboard Layout', deadline: '2026-06-28', priority: 'High', status: 'Completed' },
              { title: 'Create Client Portal Mockup V2', deadline: '2026-07-10', priority: 'Medium', status: 'Pending' }
            ]
          },
          {
            _id: 'mock-3',
            id: 'mock-3',
            employeeId: 'AVON-EMP-1003',
            name: 'John Doe',
            email: 'john.doe@avon.co.in',
            department: 'AI Solutions',
            role: 'AIML Engineer',
            status: 'On Leave',
            tasks: [
              { title: 'Train BERT Model for Helpdesk Classification', deadline: '2026-07-15', priority: 'High', status: 'Pending' }
            ]
          },
          {
            _id: 'mock-4',
            id: 'mock-4',
            employeeId: 'AVON-EMP-1004',
            name: 'Emily Davis',
            email: 'emily.davis@avon.co.in',
            department: 'Support Operations',
            role: 'Operations Lead',
            status: 'Active',
            tasks: [
              { title: 'Setup SSL certificates', deadline: '2026-06-25', priority: 'High', status: 'Completed' },
              { title: 'Audit container resource limits', deadline: '2026-07-02', priority: 'Low', status: 'Pending' }
            ]
          }
        ];
      }

      setEmployees(data);

      // Compile tasks list from all employees
      const allTasks = [];
      data.forEach(emp => {
        (emp.tasks || []).forEach(task => {
          allTasks.push({
            ...task,
            employeeName: emp.name,
            employeeId: emp._id || emp.id
          });
        });
      });
      setTasksList(allTasks);

      // default form assignment
      if (data.length > 0) {
        setFormData(prev => ({ ...prev, employeeId: data[0]._id || data[0].id }));
      }
    } catch (err) {
      console.error('Failed to load tasks database:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeesAndTasks();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Task description is required.';
    if (!formData.employeeId) errors.employeeId = 'Please select a designated employee.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const { employeeId, ...taskPayload } = formData;
      await employeeService.addTask(employeeId, taskPayload);
      setIsAddModalOpen(false);
      resetForm();
      fetchEmployeesAndTasks();
    } catch (err) {
      console.error(err);
      setFormErrors({ server: 'Failed to create sprint task.' });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const { employeeId, title, deadline, priority, status } = formData;
      const empId = selectedEmp._id || selectedEmp.id;
      const taskId = selectedTask._id || selectedTask.id;

      // Update task on backend
      await employeeService.updateTask(empId, taskId, {
        title,
        deadline,
        priority,
        status
      });

      setIsEditModalOpen(false);
      resetForm();
      fetchEmployeesAndTasks();
    } catch (err) {
      console.error(err);
      setFormErrors({ server: 'Failed to update details.' });
    }
  };

  const handleDeleteTask = async (task) => {
    try {
      // Backend deletion is usually handled by setting status or deleting from employee subdocument
      // In our wrapper we can update task status or call delete endpoints.
      // Since delete of task inside employee subdocument is handled on updates, we can update tasks array
      const emp = employees.find(e => (e._id || e.id) === task.employeeId);
      if (emp) {
        const taskId = task._id || task.id;
        const updatedTasks = emp.tasks.filter(t => (t._id || t.id) !== taskId);
        
        await employeeService.update(task.employeeId, {
          ...emp,
          tasks: updatedTasks
        });
        fetchEmployeesAndTasks();
      }
    } catch (err) {
      console.error('Failed to remove task:', err);
    }
  };

  const openEditModal = (task) => {
    const emp = employees.find(e => (e._id || e.id) === task.employeeId);
    setSelectedTask(task);
    setSelectedEmp(emp);
    setFormData({
      employeeId: task.employeeId,
      title: task.title,
      deadline: task.deadline,
      priority: task.priority || 'Medium',
      status: task.status || 'Pending'
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData(prev => ({
      ...prev,
      title: '',
      deadline: new Date().toISOString().split('T')[0],
      priority: 'Medium',
      status: 'Pending'
    }));
    setFormErrors({});
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400';
      case 'Medium': return 'bg-amber-50 border-amber-100 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400';
      default: return 'bg-sky-50 border-sky-100 text-sky-600 dark:bg-sky-950/20 dark:text-sky-400';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400';
      case 'In Progress': return 'bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-950/20 dark:text-amber-400';
      default: return 'bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-950/20 dark:text-rose-455';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm text-left">
        <div>
          <span className="text-[10px] text-[#1E40AF] dark:text-cyan-400 font-bold uppercase tracking-wider block">Avon Sprint orchestration</span>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">Work Tasks Manager</h1>
          <p className="text-xs text-slate-500 mt-1">Delegate specific milestones to active software developers and track timeline completions.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsAddModalOpen(true); }}
          className="px-4 py-2.5 bg-[#1E40AF] hover:bg-[#1E40AF]/90 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-blue-800/10 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Task</span>
        </button>
      </div>

      {/* Task Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="bg-white p-5 border border-slate-200 rounded-2xl h-40 animate-pulse" />
          ))}
        </div>
      ) : tasksList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasksList.map((task, idx) => {
            const taskId = task._id || task.id;
            return (
              <div 
                key={taskId || idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#1E40AF]/20 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between group transition-all duration-300 relative text-left"
              >
                {/* floating edit controls */}
                <div className="absolute top-4 right-4 flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => openEditModal(task)}
                    className="p-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-[#1E40AF] rounded-lg transition-colors"
                    title="Modify Task Details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleDeleteTask(task)}
                    className="p-1.5 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 text-rose-500 hover:text-rose-455 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3.5">
                  <div className="flex justify-between items-start">
                    <span className={`px-2 py-0.5 text-[8px] font-bold border rounded-md uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                      {task.priority || 'Medium'}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${getStatusColor(task.status)}`}>
                      {task.status || 'Pending'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-850 dark:text-white leading-relaxed pr-8">{task.title}</h3>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-center text-[10px] text-slate-500">
                  <span className="flex items-center space-x-1 font-semibold text-slate-700 dark:text-slate-300">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{task.employeeName}</span>
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
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-12 text-center text-slate-400 space-y-2">
          <CheckSquare className="w-10 h-10 mx-auto text-slate-300" />
          <p className="text-xs">No active delegated tasks found. Click "Create Task" above to assign some work.</p>
        </div>
      )}

      {/* Add Task Modal */}
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
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Sprint Task</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Initialize a work item and delegate it to a developer.</p>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-650">
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
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Assigned Developer</label>
                  <select 
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-slate-850 dark:text-slate-350"
                  >
                    {employees.map((emp) => (
                      <option key={emp._id || emp.id} value={emp._id || emp.id}>
                        {emp.name} ({emp.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Task Title / Description</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Implement corporate billing gateways"
                    className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                  />
                  {formErrors.title && <p className="text-[9px] text-rose-500 mt-1">{formErrors.title}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-505 font-bold uppercase tracking-wider">Target Due Date</label>
                    <input 
                      type="date" 
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-550 font-bold uppercase tracking-wider">Priority Level</label>
                    <select 
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full bg-[#F8FAFC] dark:bg-slate-955 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl"
                    >
                      <option value="Low">Low Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="High">High Priority</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-2.5 bg-[#1E40AF] hover:bg-[#1E40AF]/90 text-white font-bold rounded-xl transition-all shadow-md"
                >
                  Delegate Sprint Task
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Task Modal */}
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
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 relative z-10 space-y-4 shadow-2xl text-left"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Modify Task Details</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Edit progress status or change priority for delegated task.</p>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-655">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Assigned Developer (Read Only)</label>
                  <input 
                    type="text" 
                    disabled
                    value={selectedEmp?.name || ''}
                    className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-slate-500 cursor-not-allowed font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Task Title / Description</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                  />
                  {formErrors.title && <p className="text-[9px] text-rose-500 mt-1">{formErrors.title}</p>}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-505 font-bold uppercase tracking-wider">Due Date</label>
                    <input 
                      type="date" 
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-550 font-bold uppercase tracking-wider">Priority Level</label>
                    <select 
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full bg-[#F8FAFC] dark:bg-slate-955 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-550 font-bold uppercase tracking-wider">Task Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-[#F8FAFC] dark:bg-slate-955 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-2.5 bg-[#1E40AF] hover:bg-[#1E40AF]/90 text-white font-bold rounded-xl transition-all shadow-md"
                >
                  Save Task Modification
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Tasks;
