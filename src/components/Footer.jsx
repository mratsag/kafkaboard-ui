export function Footer() {
  return (
    <footer className="border-t border-slate-200 px-6 py-4 text-xs text-slate-400 dark:border-slate-800">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4">
        <span>Built by Murat Sağ · 2026</span>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/mratsag"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-slate-600 dark:hover:text-slate-200"
          >
            GitHub
          </a>
          <a
            href="https://muratsag.com"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-slate-600 dark:hover:text-slate-200"
          >
            Website
          </a>
        </div>
      </div>
    </footer>
  )
}
