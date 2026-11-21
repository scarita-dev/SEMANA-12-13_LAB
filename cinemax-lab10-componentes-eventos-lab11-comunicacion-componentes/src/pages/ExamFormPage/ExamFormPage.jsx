import { useState } from 'react'
import { describeRequestError } from '../../services/apiClient'
import { createExam } from '../../services/examService'

const EMPTY_FORM = { title: '', description: '' }

function ExamFormPage({ onBack, onCreated }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitError, setSubmitError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

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

  const submit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setFieldErrors({})
    setSubmitError(null)

    try {
      await createExam(form)
      onCreated()
    } catch (requestError) {
      const described = describeRequestError(requestError)
      setFieldErrors(described.fieldErrors)
      setSubmitError(described)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="exam-page container">
      <header className="exam-page__header">
        <div>
          <p className="exam-page__eyebrow">Lab 12 - Create request</p>
          <h1>New exam</h1>
        </div>
        <button type="button" className="button" onClick={onBack}>
          Back to exams
        </button>
      </header>

      <form className="exam-form" onSubmit={submit} noValidate>
        {submitError ? (
          <div className="exam-form__error" role="alert">
            <p>{submitError.message}</p>
          </div>
        ) : null}

        <div className="exam-form__field">
          <label htmlFor="exam-title">Title</label>
          <input
            id="exam-title"
            name="title"
            type="text"
            value={form.title}
            onChange={(event) => setField('title', event.target.value)}
          />
          {fieldErrors.title ? (
            <p className="exam-form__field-error">{fieldErrors.title}</p>
          ) : null}
        </div>

        <div className="exam-form__field">
          <label htmlFor="exam-description">Description</label>
          <textarea
            id="exam-description"
            name="description"
            rows="4"
            value={form.description}
            onChange={(event) => setField('description', event.target.value)}
          />
          {fieldErrors.description ? (
            <p className="exam-form__field-error">{fieldErrors.description}</p>
          ) : null}
        </div>

        <div className="exam-form__actions">
          <button type="submit" className="button button--primary">
            {submitting ? 'Saving...' : 'Create exam'}
          </button>
          <button type="button" className="button" onClick={onBack}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  )
}

export default ExamFormPage
