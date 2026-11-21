import CategoryFilter from '../../components/CategoryFilter/CategoryFilter'
import CatalogSkeleton from '../../components/CatalogSkeleton/CatalogSkeleton'
import ProductCard from '../../components/ProductCard/ProductCard'
import RequestError from '../../components/RequestError/RequestError'
import useCatalog from '../../hooks/useCatalog'

function CatalogPage({ onCreate, onEdit }) {
  const {
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
  } = useCatalog()

  return (
    <section className="catalog-page container">
      <header className="catalog-page__header">
        <div>
          <p className="catalog-page__eyebrow">Lab 13 - E-commerce structure</p>
          <h1>Product catalog</h1>
          <p className="catalog-page__subtitle">
            Products and their nested category data in a single API request.
          </p>
        </div>
        <button
          type="button"
          className="button button--primary"
          onClick={onCreate}
        >
          New product
        </button>
      </header>

      {status === 'error' ? (
        <RequestError error={error} onRetry={retry} />
      ) : (
        <>
          <CategoryFilter
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onChange={setSelectedCategoryId}
          />

          {actionError ? (
            <RequestError
              error={actionError}
              onRetry={clearActionError}
              title="Last action failed"
            />
          ) : null}

          {status === 'loading' ? (
            <CatalogSkeleton />
          ) : products.length === 0 ? (
            <div className="catalog-empty" role="status">
              <h2>No products found</h2>
              <p>Try another category or create the first product.</p>
            </div>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={onEdit}
                  onDelete={removeProduct}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default CatalogPage
