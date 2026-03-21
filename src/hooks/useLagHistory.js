import { useEffect, useState } from 'react'

const MAX_POINTS = 60

export function useLagHistory(groups) {
  const [history, setHistory] = useState({})

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!Array.isArray(groups) || groups.length === 0) {
        setHistory({})
        return
      }

      const timestamp = Date.now()

      setHistory((current) => {
        const nextHistory = {}

        groups.forEach((group) => {
          const previousPoints = current[group.groupId] ?? []
          nextHistory[group.groupId] = [
            ...previousPoints,
            {
              time: timestamp,
              lag: group.totalLag,
            },
          ].slice(-MAX_POINTS)
        })

        return nextHistory
      })
    }, 0)

    return () => {
      window.clearTimeout(timer)
    }
  }, [groups])

  return history
}
