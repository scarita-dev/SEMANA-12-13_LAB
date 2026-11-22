import apiClient from './apiClient'

const unwrapList = (data) => (Array.isArray(data) ? data : data?.results || [])

function buildPayload(product) {
  if (product instanceof FormData) {
    return product
  }

  if (product.image instanceof File) {
    const formData = new FormData()
    Object.entries(product).forEach(([key, value]) => {
      if (key === 'image' || value === undefined || value === null) {
        return
      }
      formData.append(key, value)
    })
    formData.append('image', product.image)
    return formData
  }

  return product
}

export async function list(categoryId) {
  const params = categoryId ? { category: categoryId } : {}
  const response = await apiClient.get('/products/', { params })
  return unwrapList(response.data)
}

export async function getById(productId) {
  const response = await apiClient.get(`/products/${productId}/`)
  return response.data
}

export async function create(product) {
  const response = await apiClient.post('/products/', buildPayload(product))
  return response.data
}

export async function update(productId, product) {
  const response = await apiClient.put(
    `/products/${productId}/`,
    buildPayload(product),
  )
  return response.data
}

export async function remove(productId) {
  await apiClient.delete(`/products/${productId}/`)
}

export const getAll = list
export const getProducts = list
export const getProductById = getById
export const createProduct = create
export const updateProduct = update
export const deleteProduct = remove
export { remove as delete }

export default { list, getAll, getById, create, update, delete: remove }
