import ExamSkeleton from '../../components/ExamSkeleton/ExamSkeleton'
import ExamTable from '../../components/ExamTable/ExamTable'
import RequestError from '../../components/RequestError/RequestError'
import useExams from '../../hooks/useExams'

function ExamListPage({ onCreate }) {
  const {
    exams,
    status,
    error,
    actionError,
    retry,
    removeExam,
    clearActionError,
  } = useExams()

  return (
    <section className="exam-page container">
      <header className="exam-page__header">
        <div>
          <p className="exam-page__eyebrow">Lab 12 - Ajax and web services</p>
          <h1>Exams from the Lab 8 API</h1>
          <p className="exam-page__subtitle">
            Listed, created and deleted with Axios through a single API client.
          </p>
        </div>
        <button type="button" className="button button--primary" onClick={onCreate}>
          New exam
        </button>
      </header>

      {status === 'error' ? (
        <RequestError error={error} onRetry={retry} />
      ) : (
        <>
          {actionError ? (
            <RequestError
              error={actionError}
              onRetry={clearActionError}
              title="Last action failed"
            />
          ) : null}

          {status === 'loading' ? (
            <ExamSkeleton />
          ) : exams.length === 0 ? (
            <div className="exam-empty" role="status">
              <h2>No exams yet</h2>
              <p>Create the first exam with the button above.</p>
            </div>
          ) : (
            <ExamTable exams={exams} onDelete={removeExam} />
          )}
        </>
      )}
    </section>
  )
}

export default ExamListPage
