import Skeleton from '../Skeleton/Skeleton'

function CatalogSkeleton() {
  return (
    <div
      className="catalog-skeleton"
      role="status"
      aria-live="polite"
      aria-label="Loading catalog"
    >
      <Skeleton count={6} label="Loading products" />
    </div>
  )
}

export default CatalogSkeleton
