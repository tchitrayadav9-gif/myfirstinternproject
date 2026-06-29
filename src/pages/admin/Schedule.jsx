import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, X, 
  Search, CheckCircle, Clock, Trash2, ShieldAlert, Filter, Edit
} from 'lucide-react';
import { scheduleService, employeeService } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';

const Schedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'week'
  const [schedules, setSchedules] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // Filters
  const [selectedEmpFilter, setSelectedEmpFilter] = useState('All');
  const [weekFilter, setWeekFilter] = useState('All'); // 'All', '1', '2', '3', '4', '5'

  // Modal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState('');
  const [selectedDateStr, setSelectedDateStr] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    employeeId: '',
    taskTitle: '',
    deadline: '',
    status: 'Pending'
  });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const fetchSchedulesAndEmployees = async () => {
    setIsLoading(true);
    try {
      const [schData, empData] = await Promise.all([
        scheduleService.getAll(),
        employeeService.getAll()
      ]);

      setEmployees(empData);
      setSchedules(schData);

      if (empData.length > 0 && !formData.employeeId) {
        setFormData(prev => ({ ...prev, employeeId: empData[0]._id || empData[0].id }));
      }
    } catch (err) {
      console.error('Failed to load scheduling data:', err);
      toast.error('Failed to load scheduling index.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedulesAndEmployees();
  }, []);

  const handlePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7));
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7));
    }
  };

  // Calendar helpers
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayIndex = (year, month) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDayIndex = getFirstDayIndex(currentDate.getFullYear(), currentDate.getMonth());

  // Filter schedules matching criteria
  const currentMonthStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  
  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const startOfWeek = getStartOfWeek(currentDate);

  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(startOfWeek);
      nextDay.setDate(startOfWeek.getDate() + i);
      days.push(nextDay);
    }
    return days;
  };

  const weekDays = getWeekDays();

  const filteredSchedules = schedules.filter(item => {
    // Employee filter
    const matchesEmp = selectedEmpFilter === 'All' || item.employeeId === selectedEmpFilter;
    if (!matchesEmp) return false;

    if (viewMode === 'month') {
      const matchesMonth = item.date.substring(0, 7) === currentMonthStr;
      if (!matchesMonth) return false;

      // Weekly filter within the month
      if (weekFilter !== 'All') {
        const day = parseInt(item.date.split('-')[2], 10);
        const weekNum = Math.ceil(day / 7);
        return String(weekNum) === weekFilter;
      }
      return true;
    } else {
      // Week mode: check if date falls within week bounds
      const itemDate = new Date(item.date);
      const start = new Date(startOfWeek);
      start.setHours(0,0,0,0);
      const end = new Date(startOfWeek);
      end.setDate(end.getDate() + 6);
      end.setHours(23,59,59,999);
      return itemDate >= start && itemDate <= end;
    }
  });

  const getSchedulesForDateStr = (dateStr) => {
    return filteredSchedules.filter(item => item.date === dateStr);
  };

  const handleOpenAssignModal = (dateStr) => {
    setSelectedDateStr(dateStr);
    setIsEditing(false);
    setFormData({
      employeeId: employees.length > 0 ? (employees[0]._id || employees[0].id) : '',
      taskTitle: '',
      deadline: dateStr,
      status: 'Pending'
    });
    setFormErrors({});
    setIsAssignModalOpen(true);
  };

  const handleOpenEditModal = (sch) => {
    setIsEditing(true);
    setSelectedScheduleId(sch._id || sch.id);
    setSelectedDateStr(sch.date);
    setFormData({
      employeeId: sch.employeeId,
      taskTitle: sch.taskTitle,
      deadline: sch.deadline,
      status: sch.status || 'Pending'
    });
    setFormErrors({});
    setIsAssignModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.taskTitle.trim()) {
      setFormErrors({ taskTitle: 'Task description is required.' });
      return;
    }

    try {
      const payload = {
        ...formData,
        date: selectedDateStr
      };

      if (isEditing) {
        await scheduleService.update(selectedScheduleId, payload);
        toast.success('Schedule details updated successfully.');
      } else {
        await scheduleService.create(payload);
        toast.success('Work schedule card created.');
      }
      setIsAssignModalOpen(false);
      fetchSchedulesAndEmployees();
    } catch (err) {
      console.error(err);
      setFormErrors({ server: 'Error occurred while scheduling.' });
      toast.error('Failed to commit schedule changes.');
    }
  };

  const handleDeleteSchedule = async (id) => {
    if (!window.confirm('Are you sure you want to delete this schedule agendum?')) return;
    try {
      await scheduleService.delete(id);
      toast.success('Schedule deleted successfully.');
      fetchSchedulesAndEmployees();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete schedule agendum.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-450';
      case 'In Progress': return 'bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-950/20 dark:text-amber-450';
      default: return 'bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-955/20 dark:text-rose-455';
    }
  };

  // Month view cells builder
  const calendarCells = [];
  if (viewMode === 'month') {
    // empty day paddings
    for (let i = 0; i < firstDayIndex; i++) {
      calendarCells.push(<div key={`empty-${i}`} className="h-24 bg-slate-50/20 border border-slate-100 dark:bg-slate-900/10 dark:border-slate-800" />);
    }
    // month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const daySchedules = getSchedulesForDateStr(dateStr);
      const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();
      
      let isFilteredOut = false;
      if (weekFilter !== 'All') {
        const weekNum = Math.ceil(day / 7);
        if (String(weekNum) !== weekFilter) {
          isFilteredOut = true;
        }
      }

      calendarCells.push(
        <div 
          key={`day-${day}`}
          onClick={() => !isFilteredOut && handleOpenAssignModal(dateStr)}
          className={`h-24 p-2 border border-slate-100 dark:border-slate-800 transition-colors flex flex-col justify-between relative text-left ${
            isFilteredOut 
              ? 'bg-slate-100/30 dark:bg-slate-900/10 opacity-30 cursor-not-allowed' 
              : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer'
          } ${isToday ? 'ring-2 ring-indigo-500 bg-indigo-50/10' : ''}`}
        >
          <span className={`text-[10px] font-bold ${isToday ? 'text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md dark:bg-slate-850 dark:text-cyan-400' : 'text-slate-400'}`}>
            {day}
          </span>
          <div className="space-y-1 overflow-y-auto max-h-[50px] mt-1 pr-0.5 scrollbar-thin">
            {daySchedules.map((sch, sIdx) => (
              <div 
                key={sIdx}
                onClick={(e) => {
                  e.stopPropagation(); // prevent opening create modal
                  handleOpenEditModal(sch);
                }}
                className="text-[8px] px-1.5 py-0.5 rounded truncate font-bold border bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300 hover:border-indigo-500/50"
                title={`${sch.employeeName}: ${sch.taskTitle} (${sch.status})`}
              >
                ({sch.employeeName.split(' ')[0]}) {sch.taskTitle}
              </div>
            ))}
          </div>
        </div>
      );
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm text-left">
        <div>
          <span className="text-[10px] text-[#1E40AF] dark:text-cyan-400 font-bold uppercase tracking-wider block">Avon Workforce Scheduling</span>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">Monthly Employee Schedule</h1>
          <p className="text-xs text-slate-500 mt-1">Map task timelines, assign dates on the monthly grid, and audit availability.</p>
        </div>
        
        {/* Toggle Mode */}
        <div className="flex bg-slate-100 dark:bg-slate-850 p-1 rounded-xl shrink-0">
          <button 
            onClick={() => setViewMode('month')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'month' 
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
            }`}
          >
            Month View
          </button>
          <button 
            onClick={() => setViewMode('week')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'week' 
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
            }`}
          >
            Week View
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm text-left">
        <div className="flex-grow flex flex-col sm:flex-row gap-4">
          <div className="space-y-1.5 flex-1">
            <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Filter Employee</label>
            <select 
              value={selectedEmpFilter}
              onChange={(e) => setSelectedEmpFilter(e.target.value)}
              className="w-full bg-[#F8FAFC] dark:bg-slate-955 border border-slate-200 dark:border-slate-850 text-xs text-slate-700 dark:text-slate-355 rounded-xl px-3 py-2.5"
            >
              <option value="All">All Employees</option>
              {employees.map((emp, idx) => {
                const empId = emp._id ? String(emp._id) : (emp.id ? String(emp.id) : `emp-opt-${idx}`);
                return (
                  <option key={empId} value={empId}>{emp.name}</option>
                );
              })}
            </select>
          </div>
          {viewMode === 'month' && (
            <div className="space-y-1.5 w-48 shrink-0">
              <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Weekly Filter</label>
              <select 
                value={weekFilter}
                onChange={(e) => setWeekFilter(e.target.value)}
                className="w-full bg-[#F8FAFC] dark:bg-slate-955 border border-slate-200 dark:border-slate-850 text-xs text-slate-700 dark:text-slate-355 rounded-xl px-3 py-2.5"
              >
                <option value="All">All Weeks</option>
                <option value="1">Week 1 (Days 1-7)</option>
                <option value="2">Week 2 (Days 8-14)</option>
                <option value="3">Week 3 (Days 15-21)</option>
                <option value="4">Week 4 (Days 22-28)</option>
                <option value="5">Week 5 (Days 29+)</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Calendar Grid navigation */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center bg-[#F8FAFC] dark:bg-slate-950 p-2.5 rounded-2xl border border-slate-150 dark:border-slate-800">
          <button 
            onClick={handlePrev}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-700 dark:text-white uppercase tracking-wider flex items-center space-x-2">
            <CalendarIcon className="w-4 h-4 text-[#1E40AF]" />
            <span>
              {viewMode === 'month' 
                ? `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}` 
                : `Week of ${startOfWeek.toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}`
              }
            </span>
          </span>
          <button 
            onClick={handleNext}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Calendar Grid Cells */}
        {viewMode === 'month' ? (
          <div>
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-[9px] uppercase tracking-wider text-slate-400 py-1 border-b border-slate-100 dark:border-slate-800 mb-1">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>
            <div className="grid grid-cols-7 gap-1 bg-slate-50 dark:bg-slate-950/20 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
              {calendarCells}
            </div>
          </div>
        ) : (
          /* Week view layout */
          <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
            {weekDays.map((day, idx) => {
              const dateStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
              const daySchedules = getSchedulesForDateStr(dateStr);
              const isToday = new Date().toDateString() === day.toDateString();
              
              return (
                <div 
                  key={idx}
                  onClick={() => handleOpenAssignModal(dateStr)}
                  className={`p-3 min-h-[160px] border border-slate-100 dark:border-slate-800 rounded-2xl transition-colors flex flex-col justify-between text-left cursor-pointer ${
                    isToday 
                      ? 'ring-2 ring-indigo-500 bg-indigo-50/10' 
                      : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">
                      {day.toLocaleDateString(undefined, { weekday: 'short' })}
                    </span>
                    <span className={`text-base font-extrabold block mt-0.5 ${
                      isToday ? 'text-indigo-600 dark:text-cyan-400' : 'text-slate-850 dark:text-white'
                    }`}>
                      {day.getDate()}
                    </span>
                  </div>
                  
                  <div className="space-y-1.5 flex-1 mt-3 overflow-y-auto max-h-[100px] scrollbar-thin pr-0.5">
                    {daySchedules.map((sch, sIdx) => (
                      <div 
                        key={sIdx}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditModal(sch);
                        }}
                        className="p-1.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-[8px] font-bold text-slate-700 dark:text-slate-350 hover:border-indigo-500"
                        title={sch.taskTitle}
                      >
                        <div className="truncate text-slate-850 dark:text-white">{sch.taskTitle}</div>
                        <div className="text-[7px] text-slate-400 mt-0.5">({sch.employeeName.split(' ')[0]})</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Details Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-left">
        <div className="p-4 border-b border-slate-150 dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-855 dark:text-white">Assigned Schedules Index ({filteredSchedules.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-850 text-slate-550 font-bold uppercase tracking-wider text-[9px] border-b border-slate-100 dark:border-slate-800">
                <th className="py-3 px-6">Employee</th>
                <th className="py-3 px-6">Task Description</th>
                <th className="py-3 px-6">Scheduled Date</th>
                <th className="py-3 px-6">Target Deadline</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                [1, 2, 3].map((n) => (
                  <tr key={n} className="animate-pulse">
                    <td className="py-4 px-6"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24"></div></td>
                    <td className="py-4 px-6"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-48"></div></td>
                    <td className="py-4 px-6"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16"></div></td>
                    <td className="py-4 px-6"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16"></div></td>
                    <td className="py-4 px-6"><div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-16"></div></td>
                    <td className="py-4 px-6 text-right"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-12 ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredSchedules.length > 0 ? (
                filteredSchedules.map((sch, idx) => {
                  const schId = sch._id || sch.id;
                  return (
                    <tr key={schId || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-850 transition-colors">
                      <td className="py-3 px-6 font-bold text-slate-800 dark:text-white">{sch.employeeName}</td>
                      <td className="py-3 px-6 text-slate-700 dark:text-slate-300 font-medium">{sch.taskTitle}</td>
                      <td className="py-3 px-6 font-mono text-[10px] text-slate-500">{sch.date}</td>
                      <td className="py-3 px-6 font-mono text-[10px] text-slate-500">{sch.deadline}</td>
                      <td className="py-3 px-6">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${getStatusColor(sch.status)}`}>
                          {sch.status}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-right">
                        <button 
                          onClick={() => handleOpenEditModal(sch)}
                          className="p-1 text-indigo-500 hover:text-indigo-405 transition-colors mr-2.5"
                          title="Edit Schedule Entry"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteSchedule(schId)}
                          className="p-1 text-rose-500 hover:text-rose-455 transition-colors"
                          title="Remove Schedule Entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400 italic">No schedules match the active view and filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign / Edit Task Modal */}
      <AnimatePresence>
        {isAssignModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAssignModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 relative z-10 space-y-4 shadow-2xl text-left"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {isEditing ? 'Modify Work Schedule' : 'Schedule Work Assignment'}
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Scheduling task for: <span className="text-indigo-650 dark:text-cyan-400 font-bold">{selectedDateStr}</span></p>
                </div>
                <button onClick={() => setIsAssignModalOpen(false)} className="text-slate-455 hover:text-slate-700">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {formErrors.server && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-600">
                  <span>{formErrors.server}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-505 font-bold uppercase tracking-wider">Employee Candidate</label>
                  <select 
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    disabled={isEditing} // employee lock on edit to maintain database coherence
                    className="w-full bg-[#F8FAFC] dark:bg-slate-955 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl disabled:opacity-60"
                  >
                    {employees.map((emp, idx) => {
                      const empId = emp._id ? String(emp._id) : (emp.id ? String(emp.id) : `emp-opt-${idx}`);
                      return (
                        <option key={empId} value={empId}>
                          {emp.name} ({emp.department})
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-505 font-bold uppercase tracking-wider">Work Title / Description</label>
                  <input 
                    type="text" 
                    value={formData.taskTitle}
                    onChange={(e) => setFormData({ ...formData, taskTitle: e.target.value })}
                    placeholder="e.g. Model validation scripting"
                    className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                  />
                  {formErrors.taskTitle && <p className="text-[9px] text-rose-500 mt-1">{formErrors.taskTitle}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-505 font-bold uppercase tracking-wider">Target Deadline</label>
                    <input 
                      type="date" 
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      className="w-full bg-[#F8FAFC] dark:bg-slate-955 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                    />
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
                  {isEditing ? 'Save Changes' : 'Create Schedule Card'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Schedule;
