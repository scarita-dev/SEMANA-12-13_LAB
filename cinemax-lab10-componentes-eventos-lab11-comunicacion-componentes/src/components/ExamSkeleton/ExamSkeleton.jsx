function ExamSkeleton() {
  return (
    <div className="exam-skeleton" role="status" aria-live="polite" aria-label="Loading exams">
      <div className="exam-skeleton__row exam-skeleton__row--head" />
      {Array.from({ length: 5 }, (_, index) => (
        <div className="exam-skeleton__row" key={index} aria-hidden="true">
          <span className="exam-skeleton__cell" />
          <span className="exam-skeleton__cell exam-skeleton__cell--wide" />
          <span className="exam-skeleton__cell exam-skeleton__cell--short" />
          <span className="exam-skeleton__cell exam-skeleton__cell--action" />
        </div>
      ))}
    </div>
  )
}

export default ExamSkeleton
