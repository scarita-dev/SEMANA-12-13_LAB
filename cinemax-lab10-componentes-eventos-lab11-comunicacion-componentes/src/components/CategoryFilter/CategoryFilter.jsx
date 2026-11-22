function CategoryFilter({ categories, selectedCategoryId, onChange }) {
  return (
    <div className="category-filter" role="group" aria-label="Filter by category">
      <button
        type="button"
        className={`category-filter__chip${
          selectedCategoryId === '' ? ' category-filter__chip--active' : ''
        }`}
        aria-pressed={selectedCategoryId === ''}
        onClick={() => onChange('')}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          type="button"
          key={category.id}
          className={`category-filter__chip${
            String(selectedCategoryId) === String(category.id)
              ? ' category-filter__chip--active'
              : ''
          }`}
          aria-pressed={String(selectedCategoryId) === String(category.id)}
          onClick={() => onChange(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter
