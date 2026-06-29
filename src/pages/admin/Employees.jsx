import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Mail, ShieldAlert, Award, Calendar, Edit2, 
  Trash2, CheckSquare, Clock, X, Check, Filter
} from 'lucide-react';
import { employeeService } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';

const Employees = () => {
  const toast = useToast();
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  
  // Expanded employee details
  const [expandedId, setExpandedId] = useState(null);

  const [createdEmpCredentials, setCreatedEmpCredentials] = useState(null);
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);

  // Form states
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Web Development',
    role: '',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    skills: ''
  });

  const [taskFormData, setTaskFormData] = useState({
    title: '',
    deadline: new Date().toISOString().split('T')[0],
    priority: 'Medium'
  });

  const departments = [
    "Web Development", "Mobile Apps", "AI Solutions", 
    "Cloud Computing", "UI/UX Design", "Support Operations"
  ];

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const data = await employeeService.getAll();
      if (data.length === 0) {
        setEmployees([
          {
            _id: 'mock-1',
            id: 'mock-1',
            employeeId: 'AVON-EMP-1001',
            name: 'Alex Johnson',
            email: 'alex.johnson@avon.co.in',
            department: 'AI Solutions',
            role: 'Senior Web Developer',
            joinDate: '2025-01-15',
            status: 'Active',
            skills: ['React', 'Node.js', 'Express', 'MongoDB'],
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
            joinDate: '2025-03-10',
            status: 'Active',
            skills: ['Figma', 'Sketch', 'Tailwind CSS', 'Wireframing'],
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
            joinDate: '2025-06-01',
            status: 'On Leave',
            skills: ['Python', 'TensorFlow', 'NLP', 'PyTorch'],
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
            joinDate: '2025-08-20',
            status: 'Active',
            skills: ['Kubernetes', 'Docker', 'Vercel CLI', 'AWS'],
            tasks: [
              { title: 'Setup SSL certificates', deadline: '2026-06-25', priority: 'High', status: 'Completed' },
              { title: 'Audit container resource limits', deadline: '2026-07-02', priority: 'Low', status: 'Pending' }
            ]
          }
        ]);
      } else {
        setEmployees(data);
      }
    } catch (err) {
      console.error('Failed to load employees:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full name is required.';
    if (!formData.email.trim()) errors.email = 'Corporate email is required.';
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      errors.email = 'Invalid corporate email format.';
    }
    if (!formData.role.trim()) errors.role = 'Role / Designation is required.';
    if (!formData.joinDate) errors.joinDate = 'Joining date is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const skillsArray = formData.skills
        ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
        : [];
      const res = await employeeService.create({ ...formData, skills: skillsArray });
      toast.success('Employee Added successfully!');
      setIsAddModalOpen(false);
      resetForm();
      fetchEmployees();
      if (res && res.tempPassword) {
        setCreatedEmpCredentials({
          name: res.employee.name,
          email: res.employee.email,
          employeeId: res.employee.employeeId,
          tempPassword: res.tempPassword
        });
        setIsCredentialsModalOpen(true);
      }
    } catch (err) {
      console.error(err);
      const errMessage = err.response?.data?.message || 'Error occurred while saving.';
      setFormErrors({ server: errMessage });
      toast.error(errMessage);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const skillsArray = formData.skills
        ? (Array.isArray(formData.skills) ? formData.skills : formData.skills.split(',').map(s => s.trim()).filter(Boolean))
        : [];
      const empId = selectedEmployee._id || selectedEmployee.id;
      await employeeService.update(empId, { ...formData, skills: skillsArray });
      setIsEditModalOpen(false);
      resetForm();
      fetchEmployees();
    } catch (err) {
      console.error(err);
      setFormErrors({ server: err.response?.data?.message || 'Error updating details.' });
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      const empId = selectedEmployee._id || selectedEmployee.id;
      await employeeService.delete(empId);
      setIsDeleteModalOpen(false);
      fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTaskSubmit = async (e) => {
    e.preventDefault();
    if (!taskFormData.title.trim()) {
      setFormErrors({ taskTitle: 'Task title description is required.' });
      return;
    }
    try {
      const empId = selectedEmployee._id || selectedEmployee.id;
      await employeeService.addTask(empId, { ...taskFormData, status: 'Pending' });
      setIsTaskModalOpen(false);
      setTaskFormData({
        title: '',
        deadline: new Date().toISOString().split('T')[0],
        priority: 'Medium'
      });
      fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleTaskStatus = async (employee, task) => {
    const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      const empId = employee._id || employee.id;
      const taskId = task._id || task.id;
      await employeeService.updateTask(empId, taskId, { status: nextStatus });
      fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (emp) => {
    setSelectedEmployee(emp);
    setFormData({
      name: emp.name,
      email: emp.email,
      department: emp.department,
      role: emp.role,
      joinDate: emp.joinDate,
      status: emp.status || 'Active',
      skills: emp.skills ? emp.skills.join(', ') : ''
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (emp) => {
    setSelectedEmployee(emp);
    setIsDeleteModalOpen(true);
  };

  const openTaskModal = (emp) => {
    setSelectedEmployee(emp);
    setTaskFormData({
      title: '',
      deadline: new Date().toISOString().split('T')[0],
      priority: 'Medium'
    });
    setFormErrors({});
    setIsTaskModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      department: 'Web Development',
      role: '',
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      skills: ''
    });
    setFormErrors({});
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      (emp.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.role || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'All' || emp.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm text-left">
        <div>
          <span className="text-[10px] text-[#1E40AF] dark:text-cyan-400 font-bold uppercase tracking-wider block">Avon HR Manager</span>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">Employee Directory</h1>
          <p className="text-xs text-slate-500 mt-1">Register new corporate staff members, monitor workloads, and audit skills.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsAddModalOpen(true); }}
          className="px-4 py-2.5 bg-[#1E40AF] hover:bg-[#1E40AF]/90 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-blue-800/10 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <div className="flex-grow relative">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search employees by name, email, or designation..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-xs text-slate-800 dark:text-slate-200 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-[#1E40AF]/50 transition-colors"
          />
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <Filter className="w-4 h-4 text-slate-400" />
          <select 
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-xs text-slate-700 dark:text-slate-350 rounded-xl px-3 py-2.5 focus:outline-none"
          >
            <option value="All">All Departments</option>
            {departments.map((dept, i) => (
              <option key={i} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Employee List Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-left">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-850 text-slate-500 font-bold uppercase tracking-wider text-[9px] border-b border-slate-150 dark:border-slate-800">
                <th className="py-4 px-6">Employee</th>
                <th className="py-4 px-6">Department</th>
                <th className="py-4 px-6">Role / Designation</th>
                <th className="py-4 px-6">Joining Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-4 px-6"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-28" /></td>
                    <td className="py-4 px-6"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-24" /></td>
                    <td className="py-4 px-6"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-20" /></td>
                    <td className="py-4 px-6"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-16" /></td>
                    <td className="py-4 px-6"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-14" /></td>
                    <td className="py-4 px-6 text-right"><div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-12 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => {
                  const empId = emp._id || emp.id;
                  const isExpanded = expandedId === empId;
                  return (
                    <React.Fragment key={empId}>
                      <tr 
                        className={`hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors cursor-pointer ${isExpanded ? 'bg-blue-50/20 dark:bg-slate-850/30' : ''}`}
                        onClick={() => setExpandedId(isExpanded ? null : empId)}
                      >
                        <td className="py-4 px-6">
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block hover:text-[#1E40AF] transition-colors">{emp.name}</span>
                            <span className="text-[10px] text-slate-500 mt-0.5 block">{emp.email}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-405">{emp.department}</td>
                        <td className="py-4 px-6 font-medium text-slate-600 dark:text-slate-405">{emp.role}</td>
                        <td className="py-4 px-6 font-mono text-slate-500 text-[10px]">{emp.joinDate}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            emp.status === 'Active' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20'
                          }`}>
                            {emp.status || 'Active'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end items-center space-x-3 text-[10px] font-bold">
                            <button 
                              onClick={() => openTaskModal(emp)}
                              className="text-[#06B6D4] hover:text-[#06B6D4]/80 flex items-center space-x-1"
                              title="Delegate Sprint Task"
                            >
                              <CheckSquare className="w-3.5 h-3.5" />
                              <span>Task</span>
                            </button>
                            <button 
                              onClick={() => openEditModal(emp)}
                              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white flex items-center space-x-1"
                              title="Modify Profile"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button 
                              onClick={() => openDeleteModal(emp)}
                              className="text-rose-500 hover:text-rose-455 flex items-center space-x-0.5"
                              title="Revoke Credentials"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Revoke</span>
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Section */}
                      <AnimatePresence>
                        {isExpanded && (
                          <tr>
                            <td colSpan="6" className="bg-[#F8FAFC]/60 dark:bg-slate-950/40 px-6 py-4 border-t border-b border-slate-100 dark:border-slate-800">
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                              >
                                {/* Skills */}
                                <div className="space-y-2.5">
                                  <h4 className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider flex items-center space-x-1.5">
                                    <Award className="w-4 h-4 text-[#06B6D4]" />
                                    <span>Technical Skills Inventory</span>
                                  </h4>
                                  <div className="flex flex-wrap gap-1.5">
                                    {emp.skills && emp.skills.length > 0 ? (
                                      emp.skills.map((skill, sIdx) => (
                                        <span key={sIdx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 px-2.5 py-1 rounded-lg text-slate-650 dark:text-slate-350 text-[10px] font-semibold">
                                          {skill}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-slate-500 italic">No technical skills configured.</span>
                                    )}
                                  </div>
                                </div>

                                {/* Tasks */}
                                <div className="space-y-2.5">
                                  <h4 className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider flex items-center justify-between">
                                    <span className="flex items-center space-x-1.5">
                                      <Calendar className="w-4 h-4 text-[#1E40AF]" />
                                      <span>Assigned Sprint Milestones ({emp.tasks?.length || 0})</span>
                                    </span>
                                    <button 
                                      onClick={() => openTaskModal(emp)}
                                      className="text-[#1E40AF] hover:underline text-[9px] font-bold lowercase"
                                    >
                                      + Add Task
                                    </button>
                                  </h4>
                                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                    {emp.tasks && emp.tasks.length > 0 ? (
                                      emp.tasks.map((task, tIdx) => {
                                        const taskId = task._id || task.id;
                                        const isCompleted = task.status === 'Completed';
                                        return (
                                          <div 
                                            key={taskId || tIdx} 
                                            className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl shadow-sm"
                                          >
                                            <div className="flex items-start space-x-2">
                                              <input 
                                                type="checkbox" 
                                                checked={isCompleted}
                                                onChange={() => handleToggleTaskStatus(emp, task)}
                                                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500/40 bg-slate-50 border-slate-300 w-3.5 h-3.5 cursor-pointer"
                                              />
                                              <div className="text-left">
                                                <span className={`font-semibold text-slate-700 dark:text-slate-300 block ${isCompleted ? 'line-through text-slate-400 font-normal' : ''}`}>
                                                  {task.title}
                                                </span>
                                                <span className="text-[9px] text-slate-500 flex items-center space-x-1 mt-0.5">
                                                  <Clock className="w-3 h-3 text-slate-400" />
                                                  <span>Due: {task.deadline}</span>
                                                </span>
                                              </div>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold border uppercase tracking-wider ${
                                              task.priority === 'High' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                                              task.priority === 'Medium' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                                              'bg-sky-50 border-sky-100 text-sky-600'
                                            }`}>
                                              {task.priority}
                                            </span>
                                          </div>
                                        );
                                      })
                                    ) : (
                                      <div className="text-slate-500 italic p-3 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                                        No tasks assigned. Click "+ Add Task" to assign one.
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">
                    No employees matching the active filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
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
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 relative z-10 space-y-4 shadow-2xl"
            >
              <div className="flex justify-between items-start text-left">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Register Corporate Employee</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Initialize a staff profile and designation tags.</p>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-650">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {formErrors.server && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-600 flex items-center space-x-1">
                  <ShieldAlert className="w-4 h-4" />
                  <span>{formErrors.server}</span>
                </div>
              )}

              <form onSubmit={handleAddSubmit} className="space-y-4 text-xs text-left">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Pooja Hegde"
                    className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                  />
                  {formErrors.name && <p className="text-[9px] text-rose-500 mt-1">{formErrors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Corporate Email</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="username@avon.co.in"
                      className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                    />
                    {formErrors.email && <p className="text-[9px] text-rose-500 mt-1">{formErrors.email}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Designation / Role</label>
                    <input 
                      type="text" 
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="e.g. Frontend Associate"
                      className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                    />
                    {formErrors.role && <p className="text-[9px] text-rose-500 mt-1">{formErrors.role}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Department</label>
                    <select 
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl"
                    >
                      {departments.map((dept, i) => (
                        <option key={i} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Joining Date</label>
                    <input 
                      type="date" 
                      value={formData.joinDate}
                      onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                      className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Skills Inventory (Comma-separated)</label>
                  <input 
                    type="text" 
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    placeholder="e.g. React.js, Tailwind CSS, Python, Node.js"
                    className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-2.5 bg-[#1E40AF] hover:bg-[#1E40AF]/90 text-white font-bold rounded-xl transition-all shadow-md"
                >
                  Create Associate Profile
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Employee Modal */}
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
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 relative z-10 space-y-4 shadow-2xl"
            >
              <div className="flex justify-between items-start text-left">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Modify Employee Profile</h3>
                  <p className="text-[10px] text-slate-505">Modify details for {selectedEmployee?.name}.</p>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-650">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {formErrors.server && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-600 flex items-center space-x-1">
                  <ShieldAlert className="w-4 h-4" />
                  <span>{formErrors.server}</span>
                </div>
              )}

              <form onSubmit={handleEditSubmit} className="space-y-4 text-xs text-left">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                  />
                  {formErrors.name && <p className="text-[9px] text-rose-500 mt-1">{formErrors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Corporate Email</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                    />
                    {formErrors.email && <p className="text-[9px] text-rose-500 mt-1">{formErrors.email}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Designation / Role</label>
                    <input 
                      type="text" 
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                    />
                    {formErrors.role && <p className="text-[9px] text-rose-500 mt-1">{formErrors.role}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-505 font-bold uppercase tracking-wider">Department</label>
                    <select 
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl"
                    >
                      {departments.map((dept, i) => (
                        <option key={i} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-505 font-bold uppercase tracking-wider">Contract Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl"
                    >
                      <option value="Active">Active</option>
                      <option value="Remote">Remote</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-505 font-bold uppercase tracking-wider">Skills Inventory (Comma-separated)</label>
                  <input 
                    type="text" 
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-2.5 bg-[#1E40AF] hover:bg-[#1E40AF]/90 text-white font-bold rounded-xl transition-all shadow-md"
                >
                  Save Profile Modifications
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-slate-955/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-sm p-6 relative z-10 space-y-4 shadow-2xl text-center"
            >
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-2 border border-rose-200">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Revoke Employee Credentials?</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  This will revoke the corporate access profile for <span className="font-bold text-slate-800 dark:text-white">{selectedEmployee?.name}</span> and delete all associated active tickets. This action is irreversible.
                </p>
              </div>
              <div className="flex space-x-3 text-[10px] uppercase font-bold tracking-wider pt-2">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteSubmit}
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-550 text-white rounded-xl transition-colors shadow-md"
                >
                  Revoke Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Task Modal */}
      <AnimatePresence>
        {isTaskModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTaskModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-[#1E40AF]/15 rounded-3xl w-full max-w-md p-6 relative z-10 space-y-4 shadow-2xl"
            >
              <div className="flex justify-between items-start text-left">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Delegate Task</h3>
                  <p className="text-[10px] text-slate-505">Assigning new work milestone to {selectedEmployee?.name}.</p>
                </div>
                <button onClick={() => setIsTaskModalOpen(false)} className="text-slate-400 hover:text-slate-655">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddTaskSubmit} className="space-y-4 text-xs text-left">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Work Title / Description</label>
                  <input 
                    type="text" 
                    value={taskFormData.title}
                    onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
                    placeholder="e.g. Configure database schema wrappers"
                    className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                  />
                  {formErrors.taskTitle && <p className="text-[9px] text-rose-500 mt-1">{formErrors.taskTitle}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-505 font-bold uppercase tracking-wider">Target Date Deadline</label>
                    <input 
                      type="date" 
                      value={taskFormData.deadline}
                      onChange={(e) => setTaskFormData({ ...taskFormData, deadline: e.target.value })}
                      className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-550 font-bold uppercase tracking-wider">Priority Level</label>
                    <select 
                      value={taskFormData.priority}
                      onChange={(e) => setTaskFormData({ ...taskFormData, priority: e.target.value })}
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

      {/* Credentials Modal */}
      <AnimatePresence>
        {isCredentialsModalOpen && createdEmpCredentials && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCredentialsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-emerald-500/20 rounded-3xl w-full max-w-md p-6 relative z-10 space-y-4 shadow-2xl text-left"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-1.5 text-emerald-600">
                    <Check className="w-5 h-5" />
                    <span>Associate Credentials Created</span>
                  </h3>
                  <p className="text-[10px] text-slate-505 mt-0.5">Please share these temporary sign-in credentials with the employee.</p>
                </div>
                <button onClick={() => setIsCredentialsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-slate-55 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 dark:border-slate-850 space-y-3 text-xs font-mono">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Employee Name</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{createdEmpCredentials.name}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-405 font-bold block">Employee ID</span>
                  <span className="text-[#1E40AF] dark:text-cyan-400 font-bold">{createdEmpCredentials.employeeId}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-405 font-bold block">Login Email</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{createdEmpCredentials.email}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-[9px] uppercase tracking-wider text-rose-500 font-bold block">Temporary Password</span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold text-sm bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded">{createdEmpCredentials.tempPassword}</span>
                </div>
              </div>

              <button 
                onClick={() => setIsCredentialsModalOpen(false)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-550 text-white font-bold rounded-xl transition-all shadow-md text-xs uppercase tracking-wider"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Employees;
