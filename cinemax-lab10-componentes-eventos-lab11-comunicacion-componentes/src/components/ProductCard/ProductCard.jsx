function ProductCard({ product, onEdit, onDelete }) {
  return (
    <article className="product-card">
      <div className="product-card__media">
        {product.image ? (
          <img src={product.image} alt={product.name} loading="lazy" />
        ) : (
          <span className="product-card__placeholder">No image available</span>
        )}
      </div>
      <div className="product-card__body">
        <span className="product-card__category">
          {product.category?.name || 'Uncategorized'}
        </span>
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__description">{product.description}</p>
        <div className="product-card__meta">
          <span className="product-card__price">
            ${Number(product.price).toFixed(2)}
          </span>
          <span className="product-card__stock">Stock: {product.stock}</span>
        </div>
        <div className="product-card__actions">
          <button type="button" className="button" onClick={() => onEdit(product)}>
            Edit
          </button>
          <button
            type="button"
            className="button button--danger"
            onClick={() => onDelete(product)}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
