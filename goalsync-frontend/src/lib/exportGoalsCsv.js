const STATUS_LABELS = {
  'not-started': 'Not Started',
  'on-track': 'On Track',
  'at-risk': 'At Risk',
  behind: 'Behind',
  pending: 'Pending',
  completed: 'Completed',
  draft: 'Draft',
}

function escapeCsvCell(value) {
  const text = String(value ?? '')
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

function formatStatus(status) {
  return STATUS_LABELS[status] ?? String(status ?? '').replace(/-/g, ' ')
}

export function goalsToReportRows(goals) {
  return goals.map((goal) => ({
    employeeName: goal.employeeName?.trim() || 'Unknown',
    title: goal.title ?? '',
    thrustArea: goal.thrustArea ?? '',
    target: goal.target ?? 0,
    progress: goal.progress ?? 0,
    status: formatStatus(goal.status),
    weightage: goal.weightage ?? 0,
  }))
}

export function buildGoalsReportCsv(rows) {
  const headers = [
    'Employee Name',
    'Goal Title',
    'Thrust Area',
    'Target',
    'Progress',
    'Status',
    'Weightage',
  ]

  const lines = [
    headers.join(','),
    ...rows.map((row) =>
      [
        escapeCsvCell(row.employeeName),
        escapeCsvCell(row.title),
        escapeCsvCell(row.thrustArea),
        escapeCsvCell(row.target),
        escapeCsvCell(`${row.progress}%`),
        escapeCsvCell(row.status),
        escapeCsvCell(`${row.weightage}%`),
      ].join(','),
    ),
  ]

  return `\uFEFF${lines.join('\r\n')}`
}

export function getReportFilename() {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  return `goals-report-${yyyy}-${mm}-${dd}.csv`
}

export function downloadCsvFile(csvContent, filename) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
