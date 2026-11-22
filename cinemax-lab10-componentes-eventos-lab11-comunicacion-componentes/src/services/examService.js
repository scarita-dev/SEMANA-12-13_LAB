import apiClient, { API_BASE_URL } from './apiClient'

const unwrapList = (data) => (Array.isArray(data) ? data : data?.results || [])

export async function getExams() {
  const exams = []
  let nextUrl = '/exams/'
  let pageCount = 0

  while (nextUrl && pageCount < 20) {
    const { data } = await apiClient.get(nextUrl)
    exams.push(...unwrapList(data))
    nextUrl = data.next ? String(data.next).replace(API_BASE_URL, '') : null
    pageCount += 1
  }

  return exams
}

export async function getExamById(examId) {
  const id = typeof examId === 'object' && examId !== null ? examId.id : examId
  const response = await apiClient.get(`/exams/${id}/`)
  return response.data
}

export async function createExam(exam) {
  const response = await apiClient.post('/exams/', exam)
  return response.data
}

export async function updateExam(examId, exam) {
  const id = typeof examId === 'object' && examId !== null ? examId.id : examId
  const response = await apiClient.put(`/exams/${id}/`, exam)
  return response.data
}

export async function deleteExam(examId) {
  const id = typeof examId === 'object' && examId !== null ? examId.id : examId
  await apiClient.delete(`/exams/${id}/`)
}