import { Link } from 'react-router-dom'

export function Footer({ inverted = false }) {
  return (
    <footer
      className={`border-t px-6 py-4 text-xs ${
        inverted
          ? 'border-stone-800 bg-stone-950 text-stone-400'
          : 'border-stone-200 text-stone-400 dark:border-stone-800'
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4">
        <span>Built by Murat Sağ · 2026</span>
        <div className="flex items-center gap-4">
          <Link
            to="/security"
            className={`transition ${inverted ? 'hover:text-stone-200' : 'hover:text-stone-600 dark:hover:text-stone-200'}`}
          >
            Security
          </Link>
          <a
            href="https://github.com/mratsag"
            target="_blank"
            rel="noreferrer"
            className={`transition ${inverted ? 'hover:text-stone-200' : 'hover:text-stone-600 dark:hover:text-stone-200'}`}
          >
            GitHub
          </a>
          <a
            href="https://muratsag.com"
            target="_blank"
            rel="noreferrer"
            className={`transition ${inverted ? 'hover:text-stone-200' : 'hover:text-stone-600 dark:hover:text-stone-200'}`}
          >
            Website
          </a>
        </div>
      </div>
    </footer>
  )
}
