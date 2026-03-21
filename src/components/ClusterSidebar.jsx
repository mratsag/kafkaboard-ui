export function ClusterSidebar({
  clusters,
  selectedClusterId,
  confirmingClusterId,
  onSelect,
  onOpenCreate,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
  loading,
  deletingClusterId,
  error,
  onLogout,
  theme,
  onToggleTheme,
}) {
  return (
    <aside className="flex h-full w-64 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:shadow-2xl">
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-5 dark:border-slate-800">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Workspace
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            kafkaboard
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      <div className="px-5 py-5">
        <button
          type="button"
          onClick={onOpenCreate}
          className="w-full rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
        >
          Yeni Cluster Ekle
        </button>

        {error ? (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
            <p className="font-semibold">Cluster hatası</p>
            <p className="mt-1">{error}</p>
          </div>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-4">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800"
              />
            ))}
          </div>
        ) : clusters.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center dark:border-slate-700 dark:bg-slate-800/60">
            <div className="text-3xl">🛰️</div>
            <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
              Henüz cluster yok
            </p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Sol panelden yeni bir Kafka cluster kaydı ekleyin.
            </p>
          </div>
        ) : (
          clusters.map((cluster) => {
            const selected = cluster.id === selectedClusterId
            const confirming = cluster.id === confirmingClusterId

            return (
              <div
                key={cluster.id}
                className={`rounded-xl border-l-2 px-4 py-4 text-left transition ${
                  selected
                    ? 'border-violet-400 bg-violet-50 dark:bg-slate-700'
                    : 'border-transparent bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/70 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => onSelect(cluster.id)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {cluster.name}
                    </p>
                    <p className="mt-2 truncate text-xs text-slate-500 dark:text-slate-400">
                      {cluster.bootstrapServers}
                    </p>
                  </button>
                  {confirming ? (
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onConfirmDelete(cluster.id)}
                        disabled={deletingClusterId === cluster.id}
                        className="rounded-lg bg-rose-500 px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Evet
                      </button>
                      <button
                        type="button"
                        onClick={onCancelDelete}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                      >
                        Hayır
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onRequestDelete(cluster.id)}
                      disabled={deletingClusterId === cluster.id}
                      className="shrink-0 rounded-lg p-2 text-[11px] font-semibold text-rose-500 transition hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-rose-300 dark:hover:bg-slate-700 dark:hover:text-rose-200"
                    >
                      Sil
                    </button>
                  )}
                </div>
                {confirming ? (
                  <p className="mt-3 text-xs font-medium text-rose-700 dark:text-rose-200">
                    Emin misiniz? Bu kayıt sidebar’dan kaldırılacak.
                  </p>
                ) : null}
              </div>
            )
          })
        )}
      </div>

      <div className="border-t border-slate-200 px-5 py-4 dark:border-slate-800">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-500">
          Session
        </p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Authenticated user</p>
        <button
          type="button"
          onClick={onLogout}
          className="mt-4 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          Logout
        </button>
      </div>
    </aside>
  )
}
