function formatTimestamp(timestamp) {
  if (!timestamp) {
    return '-'
  }

  return new Date(timestamp).toLocaleString()
}

export function MessageViewer({
  topics,
  selectedTopic,
  onTopicChange,
  limit,
  onLimitChange,
  onFetch,
  loading,
  error,
  messages,
  disabled,
}) {
  return (
    <section className="kb-panel">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">
          Message Viewer
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
          Topic Mesajları
        </h2>
      </div>

      <div className="mt-6 grid grid-cols-[1fr_180px_auto] gap-4">
        <label className="flex flex-col gap-2 text-sm font-medium text-stone-700 dark:text-stone-300">
          Topic
          <select
            value={selectedTopic}
            onChange={(event) => onTopicChange(event.target.value)}
            disabled={disabled}
            className="kb-input disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">Topic seçin</option>
            {topics.map((topic) => (
              <option key={topic.name} value={topic.name}>
                {topic.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-stone-700 dark:text-stone-300">
          Limit
          <input
            type="number"
            min="1"
            value={limit}
            onChange={(event) => onLimitChange(event.target.value)}
            disabled={disabled}
            className="kb-input disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>
        <button
          type="button"
          onClick={onFetch}
          disabled={loading || disabled}
          className="kb-btn-primary h-11 self-end"
        >
          {loading ? 'Getiriliyor...' : 'Getir'}
        </button>
      </div>

      {error ? (
        <div className="kb-alert-error mt-4">
          <p className="font-semibold">Mesaj hatası</p>
          <p className="mt-1">{error}</p>
        </div>
      ) : null}

      <div className="kb-table-wrap mt-6">
        <table className="kb-table">
          <thead className="kb-thead">
            <tr>
              <th className="px-4 py-3">Partition</th>
              <th className="px-4 py-3">Offset</th>
              <th className="px-4 py-3">Key</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">Timestamp</th>
            </tr>
          </thead>
          <tbody className="kb-tbody">
            {loading ? (
              <tr>
                <td className="px-4 py-8 text-stone-500 dark:text-stone-400" colSpan="5">
                  Mesajlar getiriliyor...
                </td>
              </tr>
            ) : messages.length === 0 ? (
              <tr>
                <td className="px-4 py-12" colSpan="5">
                  <div className="text-center">
                    <div className="text-4xl">{disabled ? '📭' : '✉️'}</div>
                    <p className="mt-3 text-sm font-semibold text-stone-900 dark:text-stone-100">
                      {disabled ? 'Cluster seçilmedi' : 'Henüz mesaj yok'}
                    </p>
                    <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
                      {disabled
                        ? 'Önce soldan bir cluster seçin.'
                        : 'Topic seçip son N mesajı buradan okuyabilirsiniz.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              messages.map((message) => (
                <tr key={`${message.partition}-${message.offset}`} className="transition hover:bg-stone-50 dark:hover:bg-stone-700/50">
                  <td className="px-4 py-3">{message.partition}</td>
                  <td className="px-4 py-3">{message.offset}</td>
                  <td className="px-4 py-3">{message.key ?? '-'}</td>
                  <td className="max-w-[480px] px-4 py-3 font-mono text-xs text-stone-900 dark:text-stone-100">
                    <div className="truncate">{message.value}</div>
                  </td>
                  <td className="px-4 py-3">{formatTimestamp(message.timestamp)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
