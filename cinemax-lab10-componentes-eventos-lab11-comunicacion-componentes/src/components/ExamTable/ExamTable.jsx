function ExamTable({ exams, onDelete }) {
  return (
    <div className="exam-table__wrapper">
      <table className="exam-table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Title</th>
            <th scope="col">Description</th>
            <th scope="col">Created</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam) => (
            <tr key={exam.id}>
              <td>{exam.id}</td>
              <td className="exam-table__title">{exam.title}</td>
              <td>{exam.description || '-'}</td>
              <td>
                {exam.created_at
                  ? new Date(exam.created_at).toLocaleDateString('en-US')
                  : '-'}
              </td>
              <td>
                <button
                  type="button"
                  className="button button--danger"
                  onClick={() => onDelete(exam)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ExamTable
