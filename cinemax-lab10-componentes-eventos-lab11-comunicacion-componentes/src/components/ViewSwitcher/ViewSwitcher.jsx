function ViewSwitcher({ view, onChange }) {
  const activeView = view === 'movies' ? 'movies' : 'exams'

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
          activeView === 'exams' ? ' view-switcher__button--active' : ''
        }`}
        aria-pressed={activeView === 'exams'}
        onClick={() => onChange('exams')}
      >
        Exams API
      </button>
    </nav>
  )
}

export default ViewSwitcher
