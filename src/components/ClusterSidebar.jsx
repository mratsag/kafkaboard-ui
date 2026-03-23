import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Overview', icon: '📊' },
  { to: '/topics', label: 'Topics', icon: '📋' },
  { to: '/messages', label: 'Messages', icon: '✉️' },
  { to: '/consumer-groups', label: 'Consumer Groups', icon: '👥' },
]

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
  userEmail,
  theme,
  onToggleTheme,
}) {
  const selectedCluster =
    clusters.find((cluster) => cluster.id === selectedClusterId) ?? null

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
        <button
          type="button"
          onClick={onToggleTheme}
          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800">
        <label className="block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Cluster
        </label>

        <select
          value={selectedClusterId ?? ''}
          onChange={(event) => onSelect(event.target.value)}
          disabled={loading || clusters.length === 0}
          className="mt-3 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-violet-400 dark:focus:ring-violet-500/20"
        >
          {clusters.length === 0 ? (
            <option value="">Cluster yok</option>
          ) : null}
          {clusters.map((cluster) => (
            <option key={cluster.id} value={cluster.id}>
              {cluster.name}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onOpenCreate}
          className="mt-3 w-full rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
        >
          + Yeni Cluster
        </button>

        {selectedCluster ? (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                {selectedCluster.name}
              </p>
              <SecurityBadge protocol={selectedCluster.securityProtocol} />
            </div>
            <p className="mt-2 truncate text-xs text-slate-500 dark:text-slate-400">
              {selectedCluster.bootstrapServers}
            </p>
            {confirmingClusterId === selectedCluster.id ? (
              <>
                <p className="mt-3 text-xs font-medium text-rose-700 dark:text-rose-300">
                  Emin misiniz? Seçili cluster silinecek.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onConfirmDelete(selectedCluster.id)}
                    disabled={deletingClusterId === selectedCluster.id}
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
              </>
            ) : (
              <button
                type="button"
                onClick={() => onRequestDelete(selectedCluster.id)}
                disabled={deletingClusterId === selectedCluster.id}
                className="mt-3 rounded-lg px-3 py-2 text-xs font-semibold text-rose-500 transition hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-rose-300 dark:hover:bg-rose-500/10 dark:hover:text-rose-200"
              >
                {deletingClusterId === selectedCluster.id ? 'Siliniyor...' : 'Cluster Sil'}
              </button>
            )}
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center dark:border-slate-700 dark:bg-slate-800">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Cluster seçilmedi
            </p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Devam etmek için bir cluster kaydı seçin.
            </p>
          </div>
        )}

        {error ? (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
            <p className="font-semibold">Cluster hatası</p>
            <p className="mt-1">{error}</p>
          </div>
        ) : null}
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
        {NAV_ITEMS.map((item) => (
          <SidebarLink key={item.to} to={item.to} icon={item.icon} label={item.label} />
        ))}

        <div className="my-4 border-t border-slate-200 dark:border-slate-800" />

        <SidebarLink to="/profile" icon="⚙️" label="Profile" />
      </nav>

      <div className="border-t border-slate-200 px-5 py-4 dark:border-slate-800">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-500">
          Session
        </p>
        <p className="mt-2 max-w-[160px] truncate text-sm text-slate-600 dark:text-slate-300">
          {userEmail}
        </p>
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

function SecurityBadge({ protocol }) {
  if (!protocol || protocol === 'PLAINTEXT') {
    return (
      <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400">
        PLAIN
      </span>
    )
  }
  if (protocol === 'SASL_SSL') {
    return (
      <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
        SSL
      </span>
    )
  }
  return (
    <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
      SASL
    </span>
  )
}

function SidebarLink({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl border-l-2 px-4 py-3 text-sm font-medium transition ${
          isActive
            ? 'border-violet-400 bg-violet-50 text-violet-700 dark:bg-slate-800 dark:text-violet-300'
            : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
        }`
      }
    >
      <span className="text-base">{icon}</span>
      <span>{label}</span>
    </NavLink>
  )
}
