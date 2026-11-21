import axios from 'axios'

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

function collectFieldErrors(data, fieldErrors = {}) {
  Object.entries(data || {}).forEach(([field, value]) => {
    if (Array.isArray(value)) {
      fieldErrors[field] = value.join(' ')
    } else if (value && typeof value === 'object') {
      fieldErrors[field] = Object.values(value).flat().join(' ')
    } else {
      fieldErrors[field] = String(value)
    }
  })
  return fieldErrors
}

export function describeRequestError(error) {
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return {
        kind: 'network',
        status: null,
        message: `The API at ${API_BASE_URL} did not respond in time. Check that Django is running.`,
        fieldErrors: {},
      }
    }
    return {
      kind: 'network',
      status: null,
      message: `Cannot reach the API at ${API_BASE_URL}. Check that Django is running and that CORS allows this origin.`,
      fieldErrors: {},
    }
  }

  const { status, data } = error.response
  const fieldErrors = collectFieldErrors(data)
  const message =
    data?.detail ||
    fieldErrors.non_field_errors ||
    (status === 400
      ? 'The API rejected the submitted data. Review the highlighted fields.'
      : `The API returned an error (HTTP ${status}).`)

  return { kind: 'api', status, message, fieldErrors }
}

export default apiClient
