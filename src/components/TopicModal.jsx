import { useEffect } from 'react'

export function TopicModal({
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm">
      <div className="kb-panel-solid w-full max-w-md">
        <div className="flex items-start justify-between border-b border-stone-200 px-6 py-5 dark:border-stone-700">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Topic Create
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
              Yeni Topic
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-sm text-stone-500 transition hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-700 dark:hover:text-stone-100"
          >
            Kapat
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 px-6 py-6">
          <label className="col-span-3 flex flex-col gap-2 text-sm font-medium text-stone-700 dark:text-stone-300">
            Topic Name
            <input
              name="topicName"
              value={form.topicName}
              onChange={onChange}
              className="kb-input"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-stone-700 dark:text-stone-300">
            Partitions
            <input
              name="partitions"
              type="number"
              min="1"
              value={form.partitions}
              onChange={onChange}
              className="kb-input"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-stone-700 dark:text-stone-300">
            Replication
            <input
              name="replicationFactor"
              type="number"
              min="1"
              value={form.replicationFactor}
              onChange={onChange}
              className="kb-input"
            />
          </label>
        </div>

        {error ? (
          <p className="kb-alert-error mx-6">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex justify-end gap-3 border-t border-stone-200 px-6 py-5 dark:border-stone-700">
          <button
            type="button"
            onClick={onClose}
            className="kb-btn-secondary"
          >
            Vazgeç
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="kb-btn-primary"
          >
            {loading ? 'Oluşturuluyor...' : 'Oluştur'}
          </button>
        </div>
      </div>
    </div>
  )
}
