function ViewSwitcher({ view, onChange }) {
  const activeView = view === 'movies' ? 'movies' : 'catalog'

  return (
    <nav className="view-switcher container" aria-label="Application sections">
      <button
        type="button"
        className={`view-switcher__button${
          activeView === 'movies' ? ' view-switcher__button--active' : ''
        }`}
        aria-pressed={activeView === 'movies'}
        onClick={() => onChange('movies')}
      >
        Movies
      </button>
      <button
        type="button"
        className={`view-switcher__button${
          activeView === 'catalog' ? ' view-switcher__button--active' : ''
        }`}
        aria-pressed={activeView === 'catalog'}
        onClick={() => onChange('catalog')}
      >
        E-commerce catalog
      </button>
    </nav>
  )
}

export default ViewSwitcher
