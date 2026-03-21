function statusTone(status) {
  if (status === 'HEALTHY') {
    return 'bg-emerald-100 text-emerald-700 ring-emerald-200'
  }
  if (status === 'DEGRADED') {
    return 'bg-amber-100 text-amber-700 ring-amber-200'
  }
  return 'bg-rose-100 text-rose-700 ring-rose-200'
}

export function ConnectionPanel({
  bootstrapServers,
  onBootstrapServersChange,
  onConnect,
  loading,
  error,
  health,
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Cluster Connection
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
            Kafka Cluster Control Room
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600">
            Cluster health, topic lifecycle, consumer lag and topic messages in a
            single page.
          </p>
        </div>
        {health ? (
          <span
            className={`inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold ring-1 ${statusTone(
              health.status,
            )}`}
          >
            {health.status}
          </span>
        ) : null}
      </div>

      <div className="mt-8 grid grid-cols-[1fr_auto] gap-4">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Bootstrap Servers
          <input
            value={bootstrapServers}
            onChange={(event) => onBootstrapServersChange(event.target.value)}
            placeholder="localhost:9092"
            className="h-12 rounded-2xl border border-slate-300 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:bg-white"
          />
        </label>
        <button
          type="button"
          onClick={onConnect}
          disabled={loading}
          className="h-12 self-end rounded-2xl bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? 'Bağlanıyor...' : 'Bağlan'}
        </button>
      </div>

      {error ? (
        <p className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="rounded-2xl bg-slate-950 px-5 py-4 text-white">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
            Cluster ID
          </p>
          <p className="mt-3 truncate text-sm font-medium">
            {health?.clusterId ?? 'Not connected'}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
            Node Count
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">
            {health?.nodeCount ?? '-'}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
            Topic Count
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">
            {health?.topicCount ?? '-'}
          </p>
        </div>
      </div>
    </section>
  )
}
