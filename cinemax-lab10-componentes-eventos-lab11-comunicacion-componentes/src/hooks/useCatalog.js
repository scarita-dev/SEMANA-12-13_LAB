import { useCallback, useEffect, useState } from 'react'
import { describeRequestError } from '../services/apiClient'
import { getCategories } from '../services/categoryService'
import { deleteProduct, getProducts } from '../services/productService'

export default function useCatalog() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function loadCatalog() {
      setStatus('loading')
      setActionError(null)
      try {
        const [categoryList, productList] = await Promise.all([
          getCategories(),
          getProducts(selectedCategoryId),
        ])
        if (cancelled) {
          return
        }
        setCategories(categoryList)
        setProducts(productList)
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

    loadCatalog()
    return () => {
      cancelled = true
    }
  }, [selectedCategoryId, reloadToken])

  const retry = useCallback(() => {
    setReloadToken((token) => token + 1)
  }, [])

  const removeProduct = useCallback(async (productId) => {
    try {
      await deleteProduct(productId)
      setProducts((current) => current.filter((item) => item.id !== productId))
      setActionError(null)
      return true
    } catch (requestError) {
      setActionError(describeRequestError(requestError))
      return false
    }
  }, [])

  const clearActionError = useCallback(() => setActionError(null), [])

  return {
    categories,
    products,
    selectedCategoryId,
    setSelectedCategoryId,
    status,
    error,
    actionError,
    retry,
    removeProduct,
    clearActionError,
  }
}
