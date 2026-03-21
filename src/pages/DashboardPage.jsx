import { Skeleton } from '../components/Skeleton'
import { ClusterEmptyState } from '../components/ClusterEmptyState'

export function DashboardPage({
  selectedCluster,
  health,
  healthLoading,
  healthError,
}) {
  if (!selectedCluster) {
    return (
      <ClusterEmptyState description="Soldan kayıtlı bir cluster seçin veya yeni bir cluster ekleyin. Overview paneli seçimden sonra açılır." />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Overview
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              {selectedCluster.name}
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {selectedCluster.bootstrapServers}
            </p>
          </div>
          {healthLoading ? (
            <Skeleton variant="badge" />
          ) : health ? (
            <span
              className={`inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold ring-1 ${
                health.status === 'HEALTHY'
                  ? 'bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30'
                  : health.status === 'DEGRADED'
                    ? 'bg-amber-100 text-amber-700 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30'
                    : 'bg-rose-100 text-rose-700 ring-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-500/30'
              }`}
            >
              {health.status}
            </span>
          ) : null}
        </div>

        <div className="mt-6 grid grid-cols-4 gap-4">
          {healthLoading ? (
            <>
              <Skeleton variant="card" />
              <Skeleton variant="card" />
              <Skeleton variant="card" />
              <Skeleton variant="card" />
            </>
          ) : (
            <>
              <MetricCard label="Cluster ID" value={health?.clusterId ?? selectedCluster.id} truncate />
              <MetricCard label="Node Count" value={health?.nodeCount ?? '-'} large />
              <MetricCard label="Topic Count" value={health?.topicCount ?? '-'} large />
              <MetricCard
                label="Bootstrap"
                value={selectedCluster.bootstrapServers}
                truncate
              />
            </>
          )}
        </div>

        {healthError ? (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
            <p className="font-semibold">Health hatası</p>
            <p className="mt-1">{healthError}</p>
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Cluster Nodes
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Broker listesi
          </h2>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
          <table className="min-w-full divide-y divide-slate-100 text-left dark:divide-slate-700">
            <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wider text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Node ID</th>
                <th className="px-4 py-3">Host</th>
                <th className="px-4 py-3">Port</th>
                <th className="px-4 py-3">Rack</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-700 dark:divide-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {healthLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3"><Skeleton variant="row" className="w-10" /></td>
                    <td className="px-4 py-3"><Skeleton variant="row" className="w-32" /></td>
                    <td className="px-4 py-3"><Skeleton variant="row" className="w-16" /></td>
                    <td className="px-4 py-3"><Skeleton variant="row" className="w-20" /></td>
                  </tr>
                ))
              ) : health?.nodes?.length ? (
                health.nodes.map((node) => (
                  <tr key={`${node.nodeId}-${node.host}`} className="transition hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{node.nodeId}</td>
                    <td className="px-4 py-3">{node.host}</td>
                    <td className="px-4 py-3">{node.port}</td>
                    <td className="px-4 py-3">{node.rack ?? '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400" colSpan="4">
                    Node bilgisi bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function MetricCard({ label, value, truncate = false, large = false }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p
        className={`mt-2 text-slate-900 dark:text-slate-100 ${
          large ? 'text-2xl font-semibold tracking-tight' : 'text-sm'
        } ${truncate ? 'truncate' : ''}`}
      >
        {value}
      </p>
    </div>
  )
}
