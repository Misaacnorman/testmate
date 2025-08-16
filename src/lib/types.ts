export type Sample = {
  id: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Requires Review';
  location: string;
  lastUpdate: string;
  expectedNextStep: string;
  history: {
    step: string;
    timestamp: string;
    user: string;
  }[];
};

export type Instrument = {
  id: string;
  name: string;
  status: 'Online' | 'Offline' | 'Maintenance';
  lastCalibration: string;
};

export type AuditLog = {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
};
