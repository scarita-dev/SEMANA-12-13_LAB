import { useEffect, useState } from 'react'
import { describeRequestError } from '../services/apiClient'
import { getAll as getCategories } from '../services/categoryService'
import {
  create as createProduct,
  getById as getProductById,
  update as updateProduct,
} from '../services/productService'

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  stock: '0',
  image: null,
  image_url: '',
  category_id: '',
}

export default function useProductForm(productId, onSaved) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [categories, setCategories] = useState([])
  const [status, setStatus] = useState(productId ? 'loading' : 'data')
  const [loadError, setLoadError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitError, setSubmitError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function loadFormData() {
      setStatus('loading')
      try {
        const [categoryList, product] = await Promise.all([
          getCategories(),
          productId ? getProductById(productId) : Promise.resolve(null),
        ])
        if (cancelled) {
          return
        }
        setCategories(categoryList)
        setForm(
          product
            ? {
                name: product.name || '',
                description: product.description || '',
                price: String(product.price ?? ''),
                stock: String(product.stock ?? 0),
                image: null,
                image_url: '',
                category_id: String(product.category?.id ?? categoryList[0]?.id ?? ''),
              }
            : {
                ...EMPTY_FORM,
                category_id: String(categoryList[0]?.id ?? ''),
              },
        )
        setLoadError(null)
        setStatus('data')
      } catch (requestError) {
        if (cancelled) {
          return
        }
        setLoadError(describeRequestError(requestError))
        setStatus('error')
      }
    }

    loadFormData()
    return () => {
      cancelled = true
    }
  }, [productId, reloadToken])

  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setFieldErrors((current) => {
      if (!current[field]) {
        return current
      }
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  const retry = () => setReloadToken((token) => token + 1)

  const submit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setFieldErrors({})
    setSubmitError(null)

    const payload = {
      name: form.name,
      description: form.description,
      price: form.price,
      stock: form.stock,
      category_id: form.category_id,
    }
    if (form.image) {
      payload.image = form.image
    }
    if (form.image_url.trim()) {
      payload.image_url = form.image_url.trim()
    }

    try {
      if (productId) {
        await updateProduct(productId, payload)
      } else {
        await createProduct(payload)
      }
      onSaved()
    } catch (requestError) {
      const described = describeRequestError(requestError)
      setFieldErrors(described.fieldErrors)
      setSubmitError(described)
    } finally {
      setSubmitting(false)
    }
  }

  return {
    form,
    categories,
    status,
    loadError,
    fieldErrors,
    submitError,
    submitting,
    setField,
    retry,
    submit,
  }
}
