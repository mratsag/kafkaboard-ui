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
    <section className="kb-panel">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Topics
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
            Topic Listesi
          </h2>
        </div>
        <button
          type="button"
          onClick={onOpenCreate}
          disabled={disabled}
          className="kb-btn-primary disabled:opacity-50"
        >
          Yeni Topic
        </button>
      </div>

      {error ? (
        <div className="kb-alert-error mt-4">
          <p className="font-semibold">Topic hatası</p>
          <p className="mt-1">{error}</p>
        </div>
      ) : null}

      <div className="kb-table-wrap mt-6">
        <table className="kb-table">
          <thead className="kb-thead">
            <tr>
              <th className="px-4 py-3">Topic</th>
              <th className="px-4 py-3">Partitions</th>
              <th className="px-4 py-3">Replication</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="kb-tbody">
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
                    <p className="mt-3 text-sm font-semibold text-stone-900 dark:text-stone-100">
                      {disabled ? 'Cluster seçilmedi' : 'Henüz topic yok'}
                    </p>
                    <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
                      {disabled
                        ? 'Önce soldan bir cluster seçin.'
                        : 'Bu cluster için ilk topic kaydını oluşturabilirsiniz.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              topics.map((topic) => (
                <tr key={topic.name} className="transition hover:bg-stone-50 dark:hover:bg-stone-700/50">
                  <td className="px-4 py-3 font-medium text-stone-900 dark:text-stone-100">
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
                          className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-700 transition hover:bg-stone-50 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-900"
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
