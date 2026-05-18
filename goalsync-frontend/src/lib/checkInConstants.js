export const QUARTERS = [
  { id: 'Q1', label: 'Q1 2026', period: 'Jan – Mar', status: 'completed' },
  { id: 'Q2', label: 'Q2 2026', period: 'Apr – Jun', status: 'active' },
  { id: 'Q3', label: 'Q3 2026', period: 'Jul – Sep', status: 'upcoming' },
  { id: 'Q4', label: 'Q4 2026', period: 'Oct – Dec', status: 'upcoming' },
]

export const CHECK_IN_STATUSES = [
  { value: 'not-started', label: 'Not Started' },
  { value: 'on-track', label: 'On Track' },
  { value: 'completed', label: 'Completed' },
  { value: 'behind', label: 'Behind' },
]

export const CURRENT_EMPLOYEE = {
  id: 'alex',
  name: 'Alex Rivera',
  role: 'Product Analyst',
}

export const MANAGER_USER = {
  id: 'jordan',
  name: 'Jordan Lee',
}

export function formatAchievement(value, uomType) {
  if (value === '' || value === null || value === undefined) return '—'
  const n = Number(value)
  if (Number.isNaN(n)) return '—'
  if (uomType === 'Percentage') return `${n}%`
  if (uomType === 'Currency (INR)') return `₹${n.toLocaleString('en-IN')}`
  if (uomType === 'Rating (1-5)') return `${n} / 5`
  return n.toLocaleString('en-IN')
}

export function createInitialCheckIns() {
  return [
    {
      id: 1,
      employeeId: 'alex',
      employeeName: 'Alex Rivera',
      quarter: 'Q2',
      goalTitle: 'Increase enterprise pipeline',
      thrustArea: 'Growth',
      plannedTarget: 25,
      uomType: 'Percentage',
      actualAchievement: 14,
      progress: 56,
      status: 'on-track',
      comments: [
        {
          id: 101,
          authorId: 'jordan',
          authorName: 'Jordan Lee',
          role: 'manager',
          text: 'Good momentum on enterprise outreach — prioritize top 10 accounts next sprint.',
          date: 'May 10, 2026',
        },
      ],
      lastUpdated: 'May 18, 2026',
    },
    {
      id: 2,
      employeeId: 'alex',
      employeeName: 'Alex Rivera',
      quarter: 'Q2',
      goalTitle: 'Launch product analytics dashboard',
      thrustArea: 'Delivery',
      plannedTarget: 1,
      uomType: 'Number',
      actualAchievement: 0,
      progress: 20,
      status: 'behind',
      comments: [],
      lastUpdated: 'May 15, 2026',
    },
    {
      id: 3,
      employeeId: 'alex',
      employeeName: 'Alex Rivera',
      quarter: 'Q2',
      goalTitle: 'Mentor 2 junior engineers',
      thrustArea: 'People',
      plannedTarget: 2,
      uomType: 'Number',
      actualAchievement: 2,
      progress: 100,
      status: 'completed',
      comments: [],
      lastUpdated: 'May 12, 2026',
    },
    {
      id: 4,
      employeeId: 'taylor',
      employeeName: 'Taylor Kim',
      quarter: 'Q2',
      goalTitle: 'Reduce support SLA to 4h',
      thrustArea: 'Customer',
      plannedTarget: 4,
      uomType: 'Days',
      actualAchievement: 5.2,
      progress: 42,
      status: 'behind',
      comments: [
        {
          id: 102,
          authorId: 'jordan',
          authorName: 'Jordan Lee',
          role: 'manager',
          text: 'Let us review staffing for peak hours in our 1:1.',
          date: 'May 14, 2026',
        },
      ],
      lastUpdated: 'May 16, 2026',
    },
    {
      id: 5,
      employeeId: 'sam',
      employeeName: 'Sam Patel',
      quarter: 'Q2',
      goalTitle: 'Ship onboarding v2',
      thrustArea: 'Delivery',
      plannedTarget: 100,
      uomType: 'Percentage',
      actualAchievement: 78,
      progress: 78,
      status: 'on-track',
      comments: [],
      lastUpdated: 'May 17, 2026',
    },
    {
      id: 6,
      employeeId: 'riley',
      employeeName: 'Riley Chen',
      quarter: 'Q2',
      goalTitle: 'Design system adoption',
      thrustArea: 'Efficiency',
      plannedTarget: 80,
      uomType: 'Percentage',
      actualAchievement: 0,
      progress: 0,
      status: 'not-started',
      comments: [],
      lastUpdated: 'May 8, 2026',
    },
  ]
}
