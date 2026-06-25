import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, MapPin, User, Mail, Phone, ExternalLink, 
  ShieldAlert, X, Edit2, Trash2, Filter
} from 'lucide-react';
import { clientService } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState([]);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  // Form states
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    company: '',
    contact: '',
    email: '',
    phone: '',
    location: '',
    projects: 0,
    status: 'Active'
  });

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const data = await clientService.getAll();
      if (data.length === 0) {
        setClients([
          { _id: 'mock-c1', company: 'Nexus Ventures', contact: 'Richard Hendricks', email: 'richard@nexus.com', phone: '+1-555-0199', location: 'San Francisco, USA', status: 'Active' },
          { _id: 'mock-c2', company: 'Hooli Inc', contact: 'Gavin Belson', email: 'gavin@hooli.com', phone: '+1-555-0182', location: 'Palo Alto, USA', status: 'Active' },
          { _id: 'mock-c3', company: 'Raviga Capital', contact: 'Laurie Bream', email: 'laurie@raviga.com', phone: '+1-555-0177', location: 'Silicon Valley, USA', status: 'Active' },
          { _id: 'mock-c4', company: 'Initech Corp', contact: 'Peter Gibbons', email: 'peter@initech.com', phone: '+1-555-0164', location: 'Austin, USA', status: 'Inactive' }
        ]);
      } else {
        setClients(data);
      }
    } catch (err) {
      console.error('Failed to load clients:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.company.trim()) errors.company = 'Company name is required.';
    if (!formData.contact.trim()) errors.contact = 'POC Contact person is required.';
    if (!formData.email.trim()) errors.email = 'Email address is required.';
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      errors.email = 'Invalid email address format.';
    }
    if (!formData.phone.trim()) errors.phone = 'Phone number is required.';
    if (!formData.location.trim()) errors.location = 'Location (City, Country) is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await clientService.create(formData);
      setIsAddModalOpen(false);
      resetForm();
      fetchClients();
    } catch (err) {
      console.error(err);
      setFormErrors({ server: err.response?.data?.message || 'Error occurred.' });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const cliId = selectedClient._id || selectedClient.id;
      await clientService.update(cliId, formData);
      setIsEditModalOpen(false);
      resetForm();
      fetchClients();
    } catch (err) {
      console.error(err);
      setFormErrors({ server: err.response?.data?.message || 'Error occurred.' });
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      const cliId = selectedClient._id || selectedClient.id;
      await clientService.delete(cliId);
      setIsDeleteModalOpen(false);
      fetchClients();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (client) => {
    setSelectedClient(client);
    setFormData({
      company: client.company,
      contact: client.contact,
      email: client.email,
      phone: client.phone,
      location: client.location,
      projects: client.projects,
      status: client.status
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (client) => {
    setSelectedClient(client);
    setIsDeleteModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      company: '',
      contact: '',
      email: '',
      phone: '',
      location: '',
      projects: 0,
      status: 'Active'
    });
    setFormErrors({});
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400';
      case 'Contract Review': return 'bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-950/20 dark:text-amber-400';
      default: return 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-900 dark:text-slate-400';
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          client.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          client.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm text-left">
        <div>
          <span className="text-[10px] text-[#1E40AF] dark:text-cyan-400 font-bold uppercase tracking-wider block">Avon Accounts Department</span>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">Client Directory</h1>
          <p className="text-xs text-slate-500 mt-1">Audit active enterprise client accounts, manage stakeholders, and register contracts.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsAddModalOpen(true); }}
          className="px-4 py-2.5 bg-[#1E40AF] hover:bg-[#1E40AF]/90 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-blue-800/10 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Register Client</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm text-left">
        <div className="flex-grow relative">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by company name, POC, or location..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-xs text-slate-800 dark:text-slate-200 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none"
          />
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <Filter className="w-4 h-4 text-slate-400" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F8FAFC] dark:bg-slate-955 border border-slate-200 dark:border-slate-850 text-xs text-slate-700 dark:text-slate-355 rounded-xl px-3 py-2.5 focus:outline-none"
          >
            <option value="All">All Client States</option>
            <option value="Active">Active</option>
            <option value="Contract Review">Contract Review</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Cards List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="bg-white p-6 border border-slate-200 rounded-2xl h-52 animate-pulse" />
          ))}
        </div>
      ) : filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client, idx) => {
            const cliId = client._id ? String(client._id) : (client.id ? String(client.id) : `cli-${idx}`);
            return (
              <div 
                key={cliId}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#1E40AF]/20 rounded-2xl p-5 space-y-4 flex flex-col justify-between group transition-all duration-300 relative text-left shadow-sm"
              >
                
                {/* floating edit buttons */}
                <div className="absolute top-4 right-4 flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => openEditModal(client)}
                    className="p-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-[#1E40AF] rounded-lg transition-all"
                    title="Edit Client"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => openDeleteModal(client)}
                    className="p-1.5 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 text-rose-500 hover:text-rose-455 hover:bg-rose-50 rounded-lg transition-all"
                    title="Delete Client"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-850 dark:text-white group-hover:text-[#1E40AF] dark:group-hover:text-cyan-400 transition-colors pr-12">{client.company}</h3>
                      <span className="text-[10px] text-slate-550 flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{client.location}</span>
                      </span>
                    </div>
                    <span className={`px-2.5 py-1 text-[9px] font-semibold border rounded-full group-hover:opacity-0 transition-opacity ${getStatusColor(client.status)}`}>
                      {client.status}
                    </span>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2 text-xs">
                    <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                      <User className="w-4 h-4 text-slate-400" />
                      <span>POC: <span className="font-bold text-slate-800 dark:text-white">{client.contact}</span></span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="truncate">{client.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span>{client.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-center text-[10px] text-slate-500">
                  <span className="font-semibold">Active contracts: <span className="text-[#1E40AF] dark:text-cyan-455 font-bold">{client.projects} Projects</span></span>
                  <button className="flex items-center space-x-1 text-[#1E40AF] dark:text-cyan-400 hover:underline font-bold">
                    <span>Open Folder</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-12 text-center text-slate-400 space-y-2">
          <ShieldAlert className="w-10 h-10 mx-auto text-slate-300" />
          <p className="text-xs">No client companies found.</p>
        </div>
      )}

      {/* Add Client Modal */}
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
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Register Corporate Client</h3>
                  <p className="text-[10px] text-slate-550 mt-0.5">Initialize a client company record and point of contact.</p>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-655">
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
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Company Name</label>
                  <input 
                    type="text" 
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Google India"
                    className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                  />
                  {formErrors.company && <p className="text-[9px] text-rose-500 mt-1">{formErrors.company}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">POC Contact Person</label>
                    <input 
                      type="text" 
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      placeholder="e.g. Vikram Sen"
                      className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                    />
                    {formErrors.contact && <p className="text-[9px] text-rose-500 mt-1">{formErrors.contact}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Corporate Location</label>
                    <input 
                      type="text" 
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Hyderabad, India"
                      className="w-full bg-[#F8FAFC] dark:bg-slate-955 border border-slate-200 dark:border-slate-855 p-2.5 rounded-xl focus:outline-none"
                    />
                    {formErrors.location && <p className="text-[9px] text-rose-500 mt-1">{formErrors.location}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">POC Corporate Email</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. contact@techcorp.com"
                      className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                    />
                    {formErrors.email && <p className="text-[9px] text-rose-500 mt-1">{formErrors.email}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">POC Direct Phone</label>
                    <input 
                      type="text" 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +91 40 2817 9928"
                      className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                    />
                    {formErrors.phone && <p className="text-[9px] text-rose-500 mt-1">{formErrors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-505 font-bold uppercase tracking-wider">Active Projects</label>
                    <input 
                      type="number" 
                      value={formData.projects}
                      onChange={(e) => setFormData({ ...formData, projects: Number(e.target.value) })}
                      className="w-full bg-[#F8FAFC] dark:bg-slate-955 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-505 font-bold uppercase tracking-wider">Contract Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-[#F8FAFC] dark:bg-slate-955 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl"
                    >
                      <option value="Active">Active</option>
                      <option value="Contract Review">Contract Review</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-2.5 bg-[#1E40AF] hover:bg-[#1E40AF]/90 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-800/10"
                >
                  Register Client Entity
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Client Modal */}
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
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Modify Client Details</h3>
                  <p className="text-[10px] text-slate-555 mt-0.5">Edit credentials or contract settings for {selectedClient?.company}.</p>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-650">
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
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Company Name</label>
                  <input 
                    type="text" 
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                  />
                  {formErrors.company && <p className="text-[9px] text-rose-500 mt-1">{formErrors.company}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">POC Contact Person</label>
                    <input 
                      type="text" 
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                    />
                    {formErrors.contact && <p className="text-[9px] text-rose-500 mt-1">{formErrors.contact}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-550 font-bold uppercase tracking-wider">Corporate Location</label>
                    <input 
                      type="text" 
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                    />
                    {formErrors.location && <p className="text-[9px] text-rose-500 mt-1">{formErrors.location}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">POC Corporate Email</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#F8FAFC] dark:bg-slate-955 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                    />
                    {formErrors.email && <p className="text-[9px] text-rose-500 mt-1">{formErrors.email}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">POC Direct Phone</label>
                    <input 
                      type="text" 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                    />
                    {formErrors.phone && <p className="text-[9px] text-rose-500 mt-1">{formErrors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-505 font-bold uppercase tracking-wider">Active Projects</label>
                    <input 
                      type="number" 
                      value={formData.projects}
                      onChange={(e) => setFormData({ ...formData, projects: Number(e.target.value) })}
                      className="w-full bg-[#F8FAFC] dark:bg-slate-955 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-505 font-bold uppercase tracking-wider">Contract Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-[#F8FAFC] dark:bg-slate-955 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl"
                    >
                      <option value="Active">Active</option>
                      <option value="Contract Review">Contract Review</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-2.5 bg-[#1E40AF] hover:bg-[#1E40AF]/90 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-800/10"
                >
                  Save Client Modifications
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
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
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
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Unregister Client Company?</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  This will remove the client profile for <span className="font-bold text-slate-800 dark:text-white">{selectedClient?.company}</span> and dissociate all active pipelines. This action cannot be undone.
                </p>
              </div>
              <div className="flex space-x-3 text-[10px] uppercase font-bold tracking-wider pt-2">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-205 text-slate-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteSubmit}
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-550 text-white rounded-xl transition-colors shadow-md shadow-rose-650/15"
                >
                  Remove Account
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Clients;
