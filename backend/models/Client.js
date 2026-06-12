const createModel = require('./modelHelper');

const ClientSchema = {
  company: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  projects: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Contract Review', 'Inactive'], default: 'Active' }
};

const defaultClients = [
  {
    company: "TechCorp Inc.",
    contact: "Aditi Rao",
    email: "aditi.r@techcorp.com",
    phone: "+91 80 4910 8274",
    location: "Bangalore, India",
    projects: 3,
    status: "Active"
  },
  {
    company: "FinHealth Corp.",
    contact: "Vikram Sen",
    email: "v.sen@finhealth.in",
    phone: "+91 40 2817 9928",
    location: "Hyderabad, India",
    projects: 2,
    status: "Active"
  },
  {
    company: "EduGlow India",
    contact: "Rajesh Kumar",
    email: "rajesh.k@eduglow.org",
    phone: "+91 44 9827 1029",
    location: "Chennai, India",
    projects: 1,
    status: "Active"
  },
  {
    company: "RetailHub Logistics",
    contact: "Sonia Patel",
    email: "s.patel@retailhub.com",
    phone: "+91 22 2847 9102",
    location: "Mumbai, India",
    projects: 0,
    status: "Contract Review"
  },
  {
    company: "Global Core Apps",
    contact: "David Wright",
    email: "david.w@globalcore.com",
    phone: "+1 650 382 9102",
    location: "San Francisco, USA",
    projects: 2,
    status: "Active"
  }
];

module.exports = createModel('Client', ClientSchema, defaultClients);
