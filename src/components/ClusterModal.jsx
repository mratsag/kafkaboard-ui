import { useEffect } from 'react'

export function ClusterModal({
  open,
  form,
  onChange,
  onClose,
  onSubmit,
  loading,
  error,
}) {
  useEffect(() => {
    if (!open) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-6">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Cluster Create
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">
              Yeni Cluster
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-500 transition hover:border-slate-400 hover:text-slate-950"
          >
            Kapat
          </button>
        </div>

        <div className="mt-6 grid gap-4">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Cluster Name
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              className="h-11 rounded-2xl border border-slate-300 bg-slate-50 px-4 outline-none transition focus:border-slate-900 focus:bg-white"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Bootstrap Servers
            <input
              name="bootstrapServers"
              value={form.bootstrapServers}
              onChange={onChange}
              className="h-11 rounded-2xl border border-slate-300 bg-slate-50 px-4 outline-none transition focus:border-slate-900 focus:bg-white"
            />
          </label>
        </div>

        {error ? (
          <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-500 hover:text-slate-950"
          >
            Vazgeç
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? 'Ekleniyor...' : 'Cluster Ekle'}
          </button>
        </div>
      </div>
    </div>
  )
}
