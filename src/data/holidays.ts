export interface Holiday {
  date: string;
  name: string;
  type: 'holiday' | 'event' | 'awareness';
  color?: string;
}

export const holidays: Holiday[] = [
  // Q1
  { date: '2024-01-01', name: 'New Year\'s Day', type: 'holiday' },
  { date: '2024-01-15', name: 'MLK Jr. Day', type: 'holiday' },
  { date: '2024-02-14', name: 'Valentine\'s Day', type: 'holiday' },
  { date: '2024-03-17', name: 'St. Patrick\'s Day', type: 'holiday' },
  { date: '2024-03-20', name: 'First Day of Spring', type: 'event' },
  
  // Q2
  { date: '2024-04-01', name: 'April Fools\' Day', type: 'holiday' },
  { date: '2024-04-22', name: 'Earth Day', type: 'awareness' },
  { date: '2024-05-12', name: 'Mother\'s Day', type: 'holiday' },
  { date: '2024-05-27', name: 'Memorial Day', type: 'holiday' },
  { date: '2024-06-19', name: 'Juneteenth', type: 'holiday' },
  
  // Q3
  { date: '2024-07-04', name: 'Independence Day', type: 'holiday' },
  { date: '2024-09-02', name: 'Labor Day', type: 'holiday' },
  { date: '2024-09-23', name: 'First Day of Fall', type: 'event' },
  
  // Q4
  { date: '2024-10-31', name: 'Halloween', type: 'holiday' },
  { date: '2024-11-28', name: 'Thanksgiving', type: 'holiday' },
  { date: '2024-12-25', name: 'Christmas', type: 'holiday' },
  { date: '2024-12-31', name: 'New Year\'s Eve', type: 'holiday' },
  
  // Awareness Months
  { date: '2024-02-01', name: 'Black History Month', type: 'awareness' },
  { date: '2024-03-01', name: 'Women\'s History Month', type: 'awareness' },
  { date: '2024-06-01', name: 'Pride Month', type: 'awareness' },
  { date: '2024-10-01', name: 'Breast Cancer Awareness', type: 'awareness' }
];