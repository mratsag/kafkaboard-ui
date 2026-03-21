export function ClusterSidebar({
  clusters,
  selectedClusterId,
  onSelect,
  onOpenCreate,
  onDelete,
  loading,
  deletingClusterId,
  error,
  onLogout,
}) {
  return (
    <aside className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Clusters
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">
            Saved Targets
          </h2>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-2xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-500 hover:text-slate-950"
        >
          Logout
        </button>
      </div>

      <button
        type="button"
        onClick={onOpenCreate}
        className="mt-6 h-11 w-full rounded-2xl bg-slate-950 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Yeni Cluster Ekle
      </button>

      {error ? (
        <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      <div className="mt-6 space-y-3">
        {loading ? (
          <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">
            Cluster listesi yükleniyor...
          </p>
        ) : clusters.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
            Kayıtlı cluster bulunamadı.
          </p>
        ) : (
          clusters.map((cluster) => {
            const selected = cluster.id === selectedClusterId

            return (
              <div
                key={cluster.id}
                className={`block w-full rounded-3xl border px-4 py-4 text-left transition ${
                  selected
                    ? 'border-slate-950 bg-slate-950 text-white shadow-[0_18px_45px_rgba(15,23,42,0.18)]'
                    : 'border-slate-200 bg-slate-50 text-slate-900 hover:border-slate-400 hover:bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => onSelect(cluster.id)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <p className="truncate text-sm font-semibold">{cluster.name}</p>
                    <p
                      className={`mt-2 truncate text-xs ${
                        selected ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {cluster.bootstrapServers}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(cluster.id)}
                    disabled={deletingClusterId === cluster.id}
                    className={`shrink-0 rounded-xl px-3 py-2 text-[11px] font-semibold transition ${
                      selected
                        ? 'border border-white/20 text-white hover:bg-white/10'
                        : 'border border-rose-200 text-rose-700 hover:bg-rose-50'
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    {deletingClusterId === cluster.id ? 'Siliniyor...' : 'Sil'}
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </aside>
  )
}
