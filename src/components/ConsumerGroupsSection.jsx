import { LagChart } from './LagChart'
import { Skeleton } from './Skeleton'
import { useLagHistory } from '../hooks/useLagHistory'

function lagTone(totalLag) {
  if (totalLag > 100) {
    return 'text-rose-600 dark:text-rose-300'
  }
  if (totalLag > 0) {
    return 'text-amber-600 dark:text-amber-300'
  }
  return 'text-emerald-600 dark:text-emerald-300'
}

export function ConsumerGroupsSection({
  groups,
  expandedGroupId,
  onToggle,
  onRefresh,
  loading,
  error,
  connected,
}) {
  const lagHistory = useLagHistory(groups)

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Consumer Groups
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Lag Overview
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
              connected
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                : 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
            }`}
          >
            <span>{connected ? '🟢' : '🔴'}</span>
            <span>{connected ? 'Live' : 'Disconnected'}</span>
          </span>
          <button
            type="button"
            onClick={onRefresh}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            Yenile
          </button>
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
          <p className="font-semibold">Consumer group hatası</p>
          <p className="mt-1">{error}</p>
        </div>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
        <table className="min-w-full divide-y divide-slate-100 text-left dark:divide-slate-700">
          <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wider text-slate-500 dark:bg-slate-900 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Group ID</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3">Total Lag</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-700 dark:divide-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={index}>
                  <td className="px-4 py-3"><Skeleton variant="row" className="w-36" /></td>
                  <td className="px-4 py-3"><Skeleton variant="row" className="w-16" /></td>
                  <td className="px-4 py-3"><Skeleton variant="row" className="w-12" /></td>
                </tr>
              ))
            ) : groups.length === 0 ? (
              <tr>
                <td className="px-4 py-12" colSpan="3">
                  <div className="text-center">
                    <div className="text-4xl">🧭</div>
                    <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Henüz consumer group yok
                    </p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      Offset commit eden bir consumer çalıştığında burada görünecek.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              groups.map((group) => {
                const expanded = expandedGroupId === group.groupId

                return (
                  <FragmentRow
                    key={group.groupId}
                    group={group}
                    expanded={expanded}
                    onToggle={onToggle}
                    chartData={lagHistory[group.groupId] ?? []}
                  />
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function FragmentRow({ group, expanded, onToggle, chartData }) {
  return (
    <>
      <tr
        onClick={() => onToggle(group.groupId)}
        className="cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-700/50"
      >
        <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
          {group.groupId}
        </td>
        <td className="px-4 py-3">{group.state}</td>
        <td className={`px-4 py-3 font-semibold ${lagTone(group.totalLag)}`}>
          {group.totalLag}
        </td>
      </tr>
      {expanded ? (
        <tr className="bg-slate-50 dark:bg-slate-900/40">
          <td colSpan="3" className="px-4 py-3">
            <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              <table className="min-w-full divide-y divide-slate-100 text-left dark:divide-slate-700">
                <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wider text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Topic</th>
                    <th className="px-4 py-3">Partition</th>
                    <th className="px-4 py-3">Current</th>
                    <th className="px-4 py-3">End</th>
                    <th className="px-4 py-3">Lag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-700 dark:divide-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {group.partitionLags.map((partitionLag) => (
                    <tr key={`${partitionLag.topic}-${partitionLag.partition}`} className="transition hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-4 py-3">{partitionLag.topic}</td>
                      <td className="px-4 py-3">{partitionLag.partition}</td>
                      <td className="px-4 py-3">{partitionLag.currentOffset}</td>
                      <td className="px-4 py-3">{partitionLag.endOffset}</td>
                      <td
                        className={`px-4 py-3 font-semibold ${lagTone(
                          partitionLag.lag,
                        )}`}
                      >
                        {partitionLag.lag}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {chartData.length > 0 ? (
                <LagChart groupId={group.groupId} data={chartData} />
              ) : (
                <div className="border-t border-slate-200 px-4 py-6 text-center dark:border-slate-700">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Son 10 dakika
                  </p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Grafik için veri toplanıyor...
                  </p>
                </div>
              )}
            </div>
          </td>
        </tr>
      ) : null}
    </>
  )
}
