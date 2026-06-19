const createModel = require('./modelHelper');

const TicketSchema = {
  id: { type: String, required: true },
  client: { type: String, required: true },
  poc: { type: String, required: true },
  subject: { type: String, required: true },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  date: { type: String, required: true },
  status: { type: String, enum: ['Open', 'In Progress', 'Resolved'], default: 'Open' },
  text: { type: String, required: true },
  replies: [{
    sender: { type: String, required: true },
    senderRole: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }]
};

const defaultTickets = [
  {
    _id: "seed-ticket-1",
    id: "AVON-2041",
    client: "TechCorp Inc.",
    poc: "Aditi Rao",
    subject: "Server connection timeout error during deployment.",
    priority: "High",
    date: "2026-06-03",
    status: "Open",
    text: "We are getting a database connection timeout error on the main API gateway whenever we attempt to run the deployment scripts. Logs show pool exhaustions. Need urgent review.",
    replies: []
  },
  {
    _id: "seed-ticket-2",
    id: "AVON-2039",
    client: "FinHealth Corp.",
    poc: "Vikram Sen",
    subject: "Portal dashboard chart data lagging on Safari.",
    priority: "Medium",
    date: "2026-06-02",
    status: "In Progress",
    text: "The Recharts area graph under the Overview panel is failing to scale correctly on Safari mobile viewport layouts. Looks like custom Flexbox overrides are triggering layout shift warnings.",
    replies: []
  },
  {
    _id: "seed-ticket-3",
    id: "AVON-2035",
    client: "EduGlow India",
    poc: "Rajesh Kumar",
    subject: "SSL certificate expiry warning emails.",
    priority: "Low",
    date: "2026-05-28",
    status: "Resolved",
    text: "We received an automated domain registry alert saying our SSL credentials will expire in 15 days. Need to verify automated certificate renewals on AWS.",
    replies: [
      {
        sender: "Rahul Deshmukh",
        senderRole: "Lead DevOps Architect",
        message: "I verified AWS ACM renewal settings. The SSL updates will execute on 2026-06-05 automatically. I will monitor it.",
        timestamp: new Date("2026-05-29T10:00:00Z")
      }
    ]
  }
];

module.exports = createModel('Ticket', TicketSchema, defaultTickets);
