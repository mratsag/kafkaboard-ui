export function ClusterEmptyState({
  icon = '🛰️',
  title = 'Cluster seçilmedi',
  description = 'Devam etmek için soldan bir cluster seçin veya yeni bir cluster ekleyin.',
}) {
  return (
    <section className="flex min-h-full items-center justify-center rounded-2xl border border-dashed border-stone-200 bg-white p-10 text-center shadow-sm dark:border-stone-700 dark:bg-stone-800">
      <div>
        <div className="text-6xl">{icon}</div>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
          {title}
        </h1>
        <p className="mt-4 max-w-xl text-sm text-stone-600 dark:text-stone-400">
          {description}
        </p>
      </div>
    </section>
  )
}
