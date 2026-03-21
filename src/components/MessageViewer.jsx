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
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Message Viewer
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Topic Mesajları
        </h2>
      </div>

      <div className="mt-6 grid grid-cols-[1fr_180px_auto] gap-4">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          Topic
          <select
            value={selectedTopic}
            onChange={(event) => onTopicChange(event.target.value)}
            disabled={disabled}
            className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-violet-400 dark:focus:ring-violet-500/20"
          >
            <option value="">Topic seçin</option>
            {topics.map((topic) => (
              <option key={topic.name} value={topic.name}>
                {topic.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          Limit
          <input
            type="number"
            min="1"
            value={limit}
            onChange={(event) => onLimitChange(event.target.value)}
            disabled={disabled}
            className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-violet-400 dark:focus:ring-violet-500/20"
          />
        </label>
        <button
          type="button"
          onClick={onFetch}
          disabled={loading || disabled}
          className="h-11 self-end rounded-lg bg-violet-600 px-4 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? 'Getiriliyor...' : 'Getir'}
        </button>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
          <p className="font-semibold">Mesaj hatası</p>
          <p className="mt-1">{error}</p>
        </div>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
        <table className="min-w-full divide-y divide-slate-100 text-left dark:divide-slate-700">
          <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wider text-slate-500 dark:bg-slate-900 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Partition</th>
              <th className="px-4 py-3">Offset</th>
              <th className="px-4 py-3">Key</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-700 dark:divide-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {loading ? (
              <tr>
                <td className="px-4 py-8 text-slate-500 dark:text-slate-400" colSpan="5">
                  Mesajlar getiriliyor...
                </td>
              </tr>
            ) : messages.length === 0 ? (
              <tr>
                <td className="px-4 py-12" colSpan="5">
                  <div className="text-center">
                    <div className="text-4xl">{disabled ? '📭' : '✉️'}</div>
                    <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {disabled ? 'Cluster seçilmedi' : 'Henüz mesaj yok'}
                    </p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      {disabled
                        ? 'Önce soldan bir cluster seçin.'
                        : 'Topic seçip son N mesajı buradan okuyabilirsiniz.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              messages.map((message) => (
                <tr key={`${message.partition}-${message.offset}`} className="transition hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-4 py-3">{message.partition}</td>
                  <td className="px-4 py-3">{message.offset}</td>
                  <td className="px-4 py-3">{message.key ?? '-'}</td>
                  <td className="max-w-[480px] px-4 py-3 font-mono text-xs text-slate-900 dark:text-slate-100">
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
