export function TopicSection({
  topics,
  loading,
  error,
  deletingTopic,
  onOpenCreate,
  onDelete,
  disabled,
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Topics
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">
            Topic Listesi
          </h2>
        </div>
        <button
          type="button"
          onClick={onOpenCreate}
          disabled={disabled}
          className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
        >
          Yeni Topic
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
              <th className="px-5 py-4">Topic</th>
              <th className="px-5 py-4">Partitions</th>
              <th className="px-5 py-4">Replication</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-700">
            {loading ? (
              <tr>
                <td className="px-5 py-8 text-slate-500" colSpan="4">
                  Topic listesi yükleniyor...
                </td>
              </tr>
            ) : topics.length === 0 ? (
              <tr>
                <td className="px-5 py-8 text-slate-500" colSpan="4">
                  {disabled ? 'Önce bir cluster seçin.' : 'Topic bulunamadı.'}
                </td>
              </tr>
            ) : (
              topics.map((topic) => (
                <tr key={topic.name}>
                  <td className="px-5 py-4 font-medium text-slate-950">
                    {topic.name}
                  </td>
                  <td className="px-5 py-4">{topic.partitionCount}</td>
                  <td className="px-5 py-4">{topic.replicationFactor}</td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => onDelete(topic.name)}
                      disabled={deletingTopic === topic.name}
                      className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:border-rose-400 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingTopic === topic.name ? 'Siliniyor...' : 'Sil'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
