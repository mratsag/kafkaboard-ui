export function Skeleton({ variant = 'row', className = '' }) {
  const variants = {
    row: 'h-4 rounded-full',
    card: 'h-24 rounded-2xl',
    badge: 'h-8 w-24 rounded-full',
  }

  return (
    <div
      className={`animate-pulse bg-stone-200 dark:bg-stone-700 ${variants[variant]} ${className}`}
    />
  )
}
