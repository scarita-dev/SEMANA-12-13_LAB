import apiClient from './apiClient'

const unwrapList = (data) => (Array.isArray(data) ? data : data?.results || [])

export async function getCategories() {
  const response = await apiClient.get('/categories/')
  return unwrapList(response.data)
}

export async function getCategoryById(categoryId) {
  const response = await apiClient.get(`/categories/${categoryId}/`)
  return response.data
}

export async function createCategory(category) {
  const response = await apiClient.post('/categories/', category)
  return response.data
}

export async function updateCategory(categoryId, category) {
  const response = await apiClient.put(`/categories/${categoryId}/`, category)
  return response.data
}

export async function deleteCategory(categoryId) {
  await apiClient.delete(`/categories/${categoryId}/`)
}
