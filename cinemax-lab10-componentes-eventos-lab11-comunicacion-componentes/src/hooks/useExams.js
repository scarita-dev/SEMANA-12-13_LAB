import { useCallback, useEffect, useState } from 'react'
import { describeRequestError } from '../services/apiClient'
import { deleteExam, getExams } from '../services/examService'

export default function useExams() {
  const [exams, setExams] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function loadExams() {
      setStatus('loading')
      setActionError(null)
      try {
        const examList = await getExams()
        if (cancelled) {
          return
        }
        setExams(examList)
        setError(null)
        setStatus('data')
      } catch (requestError) {
        if (cancelled) {
          return
        }
        setError(describeRequestError(requestError))
        setStatus('error')
      }
    }

    loadExams()
    return () => {
      cancelled = true
    }
  }, [reloadToken])

  const retry = useCallback(() => {
    setReloadToken((token) => token + 1)
  }, [])

  const removeExam = useCallback(async (examId) => {
    try {
      await deleteExam(examId)
      setExams((current) => current.filter((exam) => exam.id !== examId))
      setActionError(null)
      return true
    } catch (requestError) {
      setActionError(describeRequestError(requestError))
      return false
    }
  }, [])

  const clearActionError = useCallback(() => setActionError(null), [])

  return {
    exams,
    status,
    error,
    actionError,
    retry,
    removeExam,
    clearActionError,
  }
}
