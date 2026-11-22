import CatalogSkeleton from '../../components/CatalogSkeleton/CatalogSkeleton'
import RequestError from '../../components/RequestError/RequestError'
import useProductForm from '../../hooks/useProductForm'

function FieldError({ message }) {
  return message ? <p className="product-form__error">{message}</p> : null
}

function ProductFormPage({ productId, onBack, onSaved }) {
  const {
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
  } = useProductForm(productId, onSaved)

  return (
    <section className="product-form-page container">
      <header className="product-form-page__header">
        <div>
          <p className="product-form-page__eyebrow">Lab 13 - Product editor</p>
          <h1>{productId ? 'Edit product' : 'New product'}</h1>
        </div>
        <button type="button" className="button" onClick={onBack}>
          Back to catalog
        </button>
      </header>

      {status === 'error' ? (
        <RequestError error={loadError} onRetry={retry} />
      ) : status === 'loading' ? (
        <CatalogSkeleton />
      ) : (
        <form className="product-form" onSubmit={submit} noValidate>
          {submitError ? (
            <div className="product-form__submit-error" role="alert">
              <p>{submitError.message}</p>
            </div>
          ) : null}

          <div className="product-form__field">
            <label htmlFor="product-name">Name</label>
            <input
              id="product-name"
              name="name"
              type="text"
              value={form.name}
              onChange={(event) => setField('name', event.target.value)}
            />
            <FieldError message={fieldErrors.name} />
          </div>

          <div className="product-form__field">
            <label htmlFor="product-description">Description</label>
            <textarea
              id="product-description"
              name="description"
              rows="4"
              value={form.description}
              onChange={(event) => setField('description', event.target.value)}
            />
            <FieldError message={fieldErrors.description} />
          </div>

          <div className="product-form__row">
            <div className="product-form__field">
              <label htmlFor="product-price">Price</label>
              <input
                id="product-price"
                name="price"
                type="number"
                step="0.01"
                value={form.price}
                onChange={(event) => setField('price', event.target.value)}
              />
              <FieldError message={fieldErrors.price} />
            </div>

            <div className="product-form__field">
              <label htmlFor="product-stock">Stock</label>
              <input
                id="product-stock"
                name="stock"
                type="number"
                value={form.stock}
                onChange={(event) => setField('stock', event.target.value)}
              />
              <FieldError message={fieldErrors.stock} />
            </div>
          </div>

          <div className="product-form__field">
            <label htmlFor="product-category">Category</label>
            <select
              id="product-category"
              name="category_id"
              value={form.category_id}
              onChange={(event) => setField('category_id', event.target.value)}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <FieldError message={fieldErrors.category_id} />
          </div>

          <div className="product-form__field">
            <label htmlFor="product-image">Image file</label>
            <input
              id="product-image"
              name="image"
              type="file"
              accept="image/*"
              onChange={(event) =>
                setField('image', event.target.files?.[0] || null)
              }
            />
            <FieldError message={fieldErrors.image} />
          </div>

          <div className="product-form__field">
            <label htmlFor="product-image-url">Image URL (optional)</label>
            <input
              id="product-image-url"
              name="image_url"
              type="url"
              value={form.image_url}
              onChange={(event) => setField('image_url', event.target.value)}
            />
            <FieldError message={fieldErrors.image_url} />
          </div>

          <div className="product-form__actions">
            <button type="submit" className="button button--primary">
              {submitting
                ? 'Saving...'
                : productId
                  ? 'Save changes'
                  : 'Create product'}
            </button>
            <button type="button" className="button" onClick={onBack}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  )
}

export default ProductFormPage
