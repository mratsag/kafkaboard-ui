import { Skeleton } from './Skeleton'

export function TopicSection({
  topics,
  loading,
  error,
  deletingTopic,
  confirmingTopicName,
  onOpenCreate,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
  disabled,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Topics
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Topic Listesi
          </h2>
        </div>
        <button
          type="button"
          onClick={onOpenCreate}
          disabled={disabled}
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Yeni Topic
        </button>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
          <p className="font-semibold">Topic hatası</p>
          <p className="mt-1">{error}</p>
        </div>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
        <table className="min-w-full divide-y divide-slate-100 text-left dark:divide-slate-700">
          <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wider text-slate-500 dark:bg-slate-900 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Topic</th>
              <th className="px-4 py-3">Partitions</th>
              <th className="px-4 py-3">Replication</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-700 dark:divide-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td className="px-4 py-3"><Skeleton variant="row" className="w-40" /></td>
                  <td className="px-4 py-3"><Skeleton variant="row" className="w-12" /></td>
                  <td className="px-4 py-3"><Skeleton variant="row" className="w-12" /></td>
                  <td className="px-4 py-3 text-right">
                    <Skeleton variant="row" className="ml-auto w-20 rounded-xl" />
                  </td>
                </tr>
              ))
            ) : topics.length === 0 ? (
              <tr>
                <td className="px-4 py-12" colSpan="4">
                  <div className="text-center">
                    <div className="text-4xl">{disabled ? '📡' : '🪹'}</div>
                    <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {disabled ? 'Cluster seçilmedi' : 'Henüz topic yok'}
                    </p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      {disabled
                        ? 'Önce soldan bir cluster seçin.'
                        : 'Bu cluster için ilk topic kaydını oluşturabilirsiniz.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              topics.map((topic) => (
                <tr key={topic.name} className="transition hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                    {topic.name}
                  </td>
                  <td className="px-4 py-3">{topic.partitionCount}</td>
                  <td className="px-4 py-3">{topic.replicationFactor}</td>
                  <td className="px-4 py-3 text-right">
                    {confirmingTopicName === topic.name ? (
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onConfirmDelete(topic.name)}
                          disabled={deletingTopic === topic.name}
                          className="rounded-lg bg-rose-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Evet
                        </button>
                        <button
                          type="button"
                          onClick={onCancelDelete}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
                        >
                          Hayır
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onRequestDelete(topic.name)}
                        disabled={deletingTopic === topic.name}
                        className="rounded-lg px-3 py-2 text-xs font-semibold text-rose-500 transition hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-rose-300 dark:hover:bg-rose-500/10 dark:hover:text-rose-200"
                      >
                        {deletingTopic === topic.name ? 'Siliniyor...' : 'Sil'}
                      </button>
                    )}
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
