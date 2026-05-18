import { createContext, useContext, useMemo, useState } from 'react'
import { createInitialCheckIns, MANAGER_USER } from '../lib/checkInConstants'

const CheckInContext = createContext(null)

let nextCommentId = 200

export function CheckInProvider({ children }) {
  const [checkIns, setCheckIns] = useState(createInitialCheckIns)
  const [activeQuarter, setActiveQuarter] = useState('Q2')

  function updateCheckIn(id, updates) {
    setCheckIns((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
              lastUpdated: new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }),
            }
          : item,
      ),
    )
  }

  function addComment(checkInId, text) {
    if (!text.trim()) return
    const comment = {
      id: nextCommentId++,
      authorId: MANAGER_USER.id,
      authorName: MANAGER_USER.name,
      role: 'manager',
      text: text.trim(),
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    }
    setCheckIns((prev) =>
      prev.map((item) =>
        item.id === checkInId
          ? {
              ...item,
              comments: [...item.comments, comment],
            }
          : item,
      ),
    )
  }

  const value = useMemo(
    () => ({
      checkIns,
      activeQuarter,
      setActiveQuarter,
      updateCheckIn,
      addComment,
    }),
    [checkIns, activeQuarter],
  )

  return <CheckInContext.Provider value={value}>{children}</CheckInContext.Provider>
}

export function useCheckIns() {
  const ctx = useContext(CheckInContext)
  if (!ctx) throw new Error('useCheckIns must be used within CheckInProvider')
  return ctx
}
