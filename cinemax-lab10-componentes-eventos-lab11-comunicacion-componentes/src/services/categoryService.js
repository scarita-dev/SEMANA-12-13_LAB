import apiClient from './apiClient'

const unwrapList = (data) => (Array.isArray(data) ? data : data?.results || [])

export async function getAll() {
  const response = await apiClient.get('/categories/')
  return unwrapList(response.data)
}

export async function getById(categoryId) {
  const response = await apiClient.get(`/categories/${categoryId}/`)
  return response.data
}

export async function create(category) {
  const response = await apiClient.post('/categories/', category)
  return response.data
}

export async function update(categoryId, category) {
  const response = await apiClient.put(`/categories/${categoryId}/`, category)
  return response.data
}

export async function remove(categoryId) {
  await apiClient.delete(`/categories/${categoryId}/`)
}

export const getCategories = getAll
export const getCategoryById = getById
export const createCategory = create
export const updateCategory = update
export const deleteCategory = remove
export { remove as delete }

export default { getAll, getById, create, update, delete: remove }
