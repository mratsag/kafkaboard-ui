function lagTone(totalLag) {
  if (totalLag > 100) {
    return 'text-rose-600'
  }
  if (totalLag > 0) {
    return 'text-amber-600'
  }
  return 'text-emerald-600'
}

export function ConsumerGroupsSection({
  groups,
  expandedGroupId,
  onToggle,
  loading,
  error,
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          Consumer Groups
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-950">
          Lag Overview
        </h2>
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
              <th className="px-5 py-4">Group ID</th>
              <th className="px-5 py-4">State</th>
              <th className="px-5 py-4">Total Lag</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-700">
            {loading ? (
              <tr>
                <td className="px-5 py-8 text-slate-500" colSpan="3">
                  Consumer group verisi yükleniyor...
                </td>
              </tr>
            ) : groups.length === 0 ? (
              <tr>
                <td className="px-5 py-8 text-slate-500" colSpan="3">
                  Consumer group bulunamadı.
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

function FragmentRow({ group, expanded, onToggle }) {
  return (
    <>
      <tr
        onClick={() => onToggle(group.groupId)}
        className="cursor-pointer transition hover:bg-slate-50"
      >
        <td className="px-5 py-4 font-medium text-slate-950">{group.groupId}</td>
        <td className="px-5 py-4">{group.state}</td>
        <td className={`px-5 py-4 font-semibold ${lagTone(group.totalLag)}`}>
          {group.totalLag}
        </td>
      </tr>
      {expanded ? (
        <tr className="bg-slate-50/70">
          <td colSpan="3" className="px-5 py-4">
            <div className="rounded-2xl border border-slate-200 bg-white">
              <table className="min-w-full divide-y divide-slate-200 text-left">
                <thead className="bg-slate-100 text-xs uppercase tracking-[0.22em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Topic</th>
                    <th className="px-4 py-3">Partition</th>
                    <th className="px-4 py-3">Current</th>
                    <th className="px-4 py-3">End</th>
                    <th className="px-4 py-3">Lag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {group.partitionLags.map((partitionLag) => (
                    <tr key={`${partitionLag.topic}-${partitionLag.partition}`}>
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
            </div>
          </td>
        </tr>
      ) : null}
    </>
  )
}
