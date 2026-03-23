import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

function formatTime(value) {
  return new Date(value).toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function getStrokeColor(currentLag) {
  if (currentLag > 100) {
    return '#f43f5e'
  }
  if (currentLag > 0) {
    return '#f59e0b'
  }
  return '#10b981'
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs text-stone-700 shadow-lg dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200">
      <p className="font-semibold">Lag: {payload[0].value}</p>
      <p className="mt-1 text-stone-500 dark:text-stone-400">
        Zaman: {formatTime(label)}
      </p>
    </div>
  )
}

export function LagChart({ groupId, data }) {
  const currentLag = data[data.length - 1]?.lag ?? 0
  const stroke = getStrokeColor(currentLag)

  return (
    <div className="mt-4 rounded-xl border border-stone-200 bg-white p-4 dark:border-stone-700 dark:bg-stone-800">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Son 10 dakika
          </p>
          <h3 className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">
            {groupId} lag trendi
          </h3>
        </div>
        <span
          className="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
          style={{
            color: stroke,
            backgroundColor:
              currentLag > 100
                ? 'rgba(244, 63, 94, 0.12)'
                : currentLag > 0
                  ? 'rgba(245, 158, 11, 0.12)'
                  : 'rgba(16, 185, 129, 0.12)',
          }}
        >
          Anlık lag: {currentLag}
        </span>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" opacity={0.18} />
            <XAxis
              dataKey="time"
              tickFormatter={formatTime}
              minTickGap={24}
              stroke="#94a3b8"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              allowDecimals={false}
              domain={[0, 'auto']}
              stroke="#94a3b8"
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="lag"
              stroke={stroke}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5, fill: stroke }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
