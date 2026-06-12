import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, ShieldAlert 
} from 'lucide-react';
import { scheduleService, employeeService } from '../../services/api';

const MySchedule = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedules, setSchedules] = useState([]);
  const [employeeProfile, setEmployeeProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const fetchMySchedule = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [schData, empData] = await Promise.all([
        scheduleService.getAll(),
        employeeService.getAll()
      ]);

      const matchedEmp = empData.find(e => e.email.toLowerCase() === user.email.toLowerCase());
      if (matchedEmp) {
        setEmployeeProfile(matchedEmp);
        const empId = matchedEmp._id || matchedEmp.id;
        
        // Filter only schedules matching this employee id
        const mySch = schData.filter(s => s.employeeId === empId);
        setSchedules(mySch);
      }
    } catch (err) {
      console.error('Failed to load employee schedules:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMySchedule();
  }, [user]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayIndex = (year, month) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDayIndex = getFirstDayIndex(currentDate.getFullYear(), currentDate.getMonth());

  const currentMonthStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  const filteredSchedules = schedules.filter(item => item.month === currentMonthStr);

  const getSchedulesForDay = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return filteredSchedules.filter(item => item.date === dateStr);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20';
      case 'In Progress': return 'bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-950/20';
      default: return 'bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-955/20';
    }
  };

  const calendarCells = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(<div key={`empty-${i}`} className="h-24 bg-slate-50/20 border border-slate-100 dark:bg-slate-900/10 dark:border-slate-800" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const daySchedules = getSchedulesForDay(day);
    const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();

    calendarCells.push(
      <div 
        key={`day-${day}`}
        className={`h-24 p-2 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between relative text-left ${
          isToday ? 'ring-2 ring-indigo-500 bg-indigo-50/10' : ''
        }`}
      >
        <span className={`text-[10px] font-bold ${isToday ? 'text-indigo-650 bg-indigo-50 px-1.5 py-0.5 rounded-md dark:bg-slate-800 dark:text-indigo-400' : 'text-slate-400'}`}>
          {day}
        </span>
        <div className="space-y-1 overflow-y-auto max-h-[50px] mt-1 pr-0.5 scrollbar-thin">
          {daySchedules.map((sch, sIdx) => (
            <div 
              key={sIdx}
              className="text-[8px] px-1.5 py-0.5 rounded truncate font-bold border bg-indigo-50/50 border-indigo-100 text-indigo-700 dark:bg-slate-950 dark:border-slate-800 dark:text-indigo-300"
              title={`${sch.taskTitle} [${sch.status}]`}
            >
              {sch.taskTitle}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm text-left">
        <span className="text-[10px] text-indigo-650 dark:text-indigo-400 font-bold uppercase tracking-wider block">Avon Workspace</span>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">My Work Calendar</h1>
        <p className="text-xs text-slate-500 mt-1">Review scheduled project milestone deadlines and monthly allocation calendars.</p>
      </div>

      {/* Calendar Navigation */}
      <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center bg-[#F8FAFC] dark:bg-slate-950 p-2.5 rounded-2xl border border-slate-150 dark:border-slate-800">
          <button 
            onClick={handlePrevMonth}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-700 dark:text-white uppercase tracking-wider flex items-center space-x-2">
            <CalendarIcon className="w-4 h-4 text-indigo-600" />
            <span>{months[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
          </span>
          <button 
            onClick={handleNextMonth}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Week headings */}
        <div className="grid grid-cols-7 gap-1 text-center font-bold text-[9px] uppercase tracking-wider text-slate-400 py-1 border-b border-slate-100 dark:border-slate-800">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* cells */}
        <div className="grid grid-cols-7 gap-1 bg-slate-50 dark:bg-slate-950/20 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
          {calendarCells}
        </div>
      </div>

      {/* Agenda Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-left">
        <div className="p-4 border-b border-slate-150 dark:border-slate-800 bg-slate-50/20">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">Calendar Allocation List ({filteredSchedules.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-850 text-slate-550 font-bold uppercase tracking-wider text-[9px] border-b border-slate-100 dark:border-slate-800">
                <th className="py-3 px-6">Assigned Task</th>
                <th className="py-3 px-6">Scheduled Date</th>
                <th className="py-3 px-6">Deadline Target</th>
                <th className="py-3 px-6">Current Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredSchedules.length > 0 ? (
                filteredSchedules.map((sch, idx) => {
                  const schId = sch._id || sch.id;
                  return (
                    <tr key={schId || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-850 transition-colors">
                      <td className="py-3.5 px-6 font-bold text-slate-800 dark:text-white">{sch.taskTitle}</td>
                      <td className="py-3.5 px-6 font-mono text-[10px] text-slate-500">{sch.date}</td>
                      <td className="py-3.5 px-6 font-mono text-[10px] text-slate-500">{sch.deadline}</td>
                      <td className="py-3.5 px-6">
                        <span className={`px-2.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${getStatusColor(sch.status)}`}>
                          {sch.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-400 italic">No tasks listed for this month.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default MySchedule;
