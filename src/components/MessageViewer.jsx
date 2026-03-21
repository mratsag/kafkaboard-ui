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
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          Message Viewer
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-950">
          Topic Mesajları
        </h2>
      </div>

      <div className="mt-6 grid grid-cols-[1fr_180px_auto] gap-4">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Topic
          <select
            value={selectedTopic}
            onChange={(event) => onTopicChange(event.target.value)}
            className="h-11 rounded-2xl border border-slate-300 bg-slate-50 px-4 outline-none transition focus:border-slate-900 focus:bg-white"
          >
            <option value="">Topic seçin</option>
            {topics.map((topic) => (
              <option key={topic.name} value={topic.name}>
                {topic.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Limit
          <input
            type="number"
            min="1"
            value={limit}
            onChange={(event) => onLimitChange(event.target.value)}
            className="h-11 rounded-2xl border border-slate-300 bg-slate-50 px-4 outline-none transition focus:border-slate-900 focus:bg-white"
          />
        </label>
        <button
          type="button"
          onClick={onFetch}
          disabled={loading}
          className="h-11 self-end rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? 'Getiriliyor...' : 'Getir'}
        </button>
      </div>

      {error ? (
        <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-left">
          <thead className="bg-slate-100 text-xs uppercase tracking-[0.24em] text-slate-500">
            <tr>
              <th className="px-5 py-4">Partition</th>
              <th className="px-5 py-4">Offset</th>
              <th className="px-5 py-4">Key</th>
              <th className="px-5 py-4">Value</th>
              <th className="px-5 py-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-700">
            {loading ? (
              <tr>
                <td className="px-5 py-8 text-slate-500" colSpan="5">
                  Mesajlar getiriliyor...
                </td>
              </tr>
            ) : messages.length === 0 ? (
              <tr>
                <td className="px-5 py-8 text-slate-500" colSpan="5">
                  Mesaj bulunamadı.
                </td>
              </tr>
            ) : (
              messages.map((message) => (
                <tr key={`${message.partition}-${message.offset}`}>
                  <td className="px-5 py-4">{message.partition}</td>
                  <td className="px-5 py-4">{message.offset}</td>
                  <td className="px-5 py-4">{message.key ?? '-'}</td>
                  <td className="max-w-[480px] px-5 py-4 font-mono text-xs text-slate-900">
                    <div className="truncate">{message.value}</div>
                  </td>
                  <td className="px-5 py-4">{formatTimestamp(message.timestamp)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
