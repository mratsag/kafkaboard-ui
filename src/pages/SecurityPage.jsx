import { Link } from 'react-router-dom'

export function SecurityPage() {
  return (
    <div className="relative min-h-full flex-1 overflow-hidden bg-stone-950 text-stone-100">
      <div className="kb-app-background absolute inset-0" />
      <div className="kb-app-grid absolute inset-0 opacity-20" />

      <div className="relative mx-auto flex min-h-full w-full max-w-5xl flex-col px-6 py-8 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">
              kafkaboard
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
              Security & Data Handling
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-300">
              How authentication, saved cluster access, and sensitive credentials are
              handled in the current product.
            </p>
          </div>

          <Link
            to="/"
            className="rounded-full border border-white/12 px-4 py-2 text-sm text-stone-200 transition hover:border-white/25 hover:bg-white/5"
          >
            Back
          </Link>
        </header>

        <section className="mt-10 grid gap-5 lg:grid-cols-2">
          <InfoCard
            title="Authentication"
            body="Passwords are hashed with BCrypt. Access uses short-lived tokens, and refresh flows are protected with rotation."
          />
          <InfoCard
            title="Credential Storage"
            body="Saved Kafka credentials are encrypted before persistence. Plaintext credentials are not stored in the database."
          />
          <InfoCard
            title="Account Isolation"
            body="Saved clusters are scoped per user account. One account cannot read another account’s saved cluster records."
          />
          <InfoCard
            title="Transport"
            body="Production traffic is expected to be served over HTTPS. Security headers are enabled for browser responses."
          />
        </section>

        <section className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
            Current Notes
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
            <li>Local development may use a less strict cookie mode than production.</li>
            <li>Rate limiting is enabled for authentication and API endpoints.</li>
            <li>WebSocket access is restricted to authenticated users and owned clusters.</li>
          </ul>
        </section>
      </div>
    </div>
  )
}

function InfoCard({ title, body }) {
  return (
    <article className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
      <p className="text-xs uppercase tracking-[0.26em] text-amber-200">{title}</p>
      <p className="mt-3 text-sm leading-7 text-stone-300">{body}</p>
    </article>
  )
}
