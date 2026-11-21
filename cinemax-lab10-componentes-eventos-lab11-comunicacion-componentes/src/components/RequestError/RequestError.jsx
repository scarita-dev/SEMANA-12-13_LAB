function RequestError({ error, onRetry, title }) {
  const heading = title || (error?.kind === 'network' ? 'Connection error' : 'API error')

  return (
    <div className="request-error" role="alert">
      <h2 className="request-error__title">{heading}</h2>
      <p className="request-error__message">{error?.message}</p>
      {error?.status ? (
        <p className="request-error__status">HTTP status: {error.status}</p>
      ) : null}
      <button type="button" className="button button--primary" onClick={onRetry}>
        Retry
      </button>
    </div>
  )
}

export default RequestError
