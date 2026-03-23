import { Link } from 'react-router-dom'

export function LandingPage({ token }) {
  const primaryHref = token ? '/dashboard' : '/register'
  const primaryLabel = token ? 'Open Dashboard' : 'Get Started'
  const secondaryHref = token ? '/messages' : '/login'
  const secondaryLabel = token ? 'Inspect Messages' : 'Sign In'

  return (
    <div className="relative min-h-full flex-1 overflow-hidden bg-stone-950 text-stone-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.22),_transparent_32%),radial-gradient(circle_at_80%_20%,_rgba(251,191,36,0.16),_transparent_28%),linear-gradient(135deg,_rgba(28,25,23,0.96),_rgba(12,10,9,1))]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(245,245,244,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(245,245,244,0.06)_1px,transparent_1px)] [background-size:44px_44px]" />

      <div className="relative mx-auto flex min-h-full w-full max-w-7xl flex-col px-6 py-8 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">
              kafkaboard
            </p>
            <p className="mt-2 text-sm text-stone-400">
              Kafka visibility for development and production.
            </p>
          </div>

          <nav className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-full border border-white/12 px-4 py-2 text-sm text-stone-200 transition hover:border-white/25 hover:bg-white/5"
            >
              Sign In
            </Link>
            <Link
              to={primaryHref}
              className="rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-amber-300"
            >
              {primaryLabel}
            </Link>
          </nav>
        </header>

        <section className="grid flex-1 items-center gap-16 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div>
            <div className="inline-flex items-center rounded-full border border-amber-200/15 bg-amber-300/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-amber-200">
              Live lag, topics, and recent events
            </div>

            <h1 className="mt-8 max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              From local events to production lag, in one board.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-300">
              Kafkaboard helps you inspect Kafka topics, track consumer lag, and review
              recent messages across your environments from a single interface.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to={primaryHref}
                className="rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-300"
              >
                {primaryLabel}
              </Link>
              <Link
                to={secondaryHref}
                className="rounded-full border border-white/12 px-6 py-3 text-sm font-semibold text-stone-100 transition hover:border-white/25 hover:bg-white/5"
              >
                {secondaryLabel}
              </Link>
            </div>

            <div className="mt-6 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur-sm">
              <p className="text-sm leading-7 text-stone-300">
                Built for engineers who need Kafka visibility without exposing credentials in
                the browser.
              </p>
              <div className="mt-3 flex flex-wrap gap-3 text-xs uppercase tracking-[0.22em] text-amber-200">
                <span>Encrypted saved credentials</span>
                <span>Account-scoped cluster access</span>
                <span>Short-lived access tokens</span>
              </div>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {[
                ['Multi-cluster visibility', 'Switch between Kafka environments from one workspace.'],
                ['Live lag monitoring', 'Track consumer group lag as it changes.'],
                ['Topic inspection', 'Browse topics, partitions, and cluster health quickly.'],
                ['Recent message view', 'Read the latest records without custom scripts.'],
              ].map(([title, copy]) => (
                <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <h2 className="text-base font-semibold text-white">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-stone-300">{copy}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-10 h-24 w-24 rounded-full bg-amber-300/25 blur-3xl" />
            <div className="absolute bottom-6 right-8 h-28 w-28 rounded-full bg-orange-500/20 blur-3xl" />

            <div className="relative rounded-[2rem] border border-white/10 bg-stone-900/80 p-5 shadow-2xl shadow-black/40 backdrop-blur">
              <div className="rounded-[1.5rem] border border-white/10 bg-stone-950/80 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                      Cluster Health
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">production-eu</h2>
                  </div>
                  <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-300">
                    Healthy
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {[
                    ['Brokers', '6'],
                    ['Topics', '24'],
                    ['Groups', '18'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-stone-500">{label}</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white">Consumer lag</p>
                      <span className="text-xs uppercase tracking-[0.2em] text-stone-500">live</span>
                    </div>
                    <div className="mt-4 space-y-4">
                      {[
                        ['checkout-consumer', 128, 'bg-amber-300'],
                        ['billing-sync', 42, 'bg-orange-400'],
                        ['inventory-projector', 9, 'bg-emerald-400'],
                      ].map(([name, lag, barClass]) => (
                        <div key={name}>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-stone-200">{name}</span>
                            <span className="text-stone-400">{lag} lag</span>
                          </div>
                          <div className="mt-2 h-2 rounded-full bg-white/5">
                            <div
                              className={`h-2 rounded-full ${barClass}`}
                              style={{ width: `${Math.min(Number(lag) / 1.4, 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white">Latest messages</p>
                      <span className="rounded-full border border-white/10 px-2 py-1 text-[11px] text-stone-400">
                        orders.v1
                      </span>
                    </div>
                    <div className="mt-4 space-y-3 text-sm">
                      {[
                        ['partition 2', 'order.created', '{"orderId":"A-1042","status":"paid"}'],
                        ['partition 0', 'payment.captured', '{"paymentId":"P-998","amount":129.90}'],
                        ['partition 5', 'shipment.queued', '{"shipmentId":"S-771","eta":"2d"}'],
                      ].map(([partition, key, value]) => (
                        <div key={`${partition}-${key}`} className="rounded-2xl border border-white/8 bg-stone-950/80 p-3">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-xs uppercase tracking-[0.22em] text-stone-500">
                              {partition}
                            </span>
                            <span className="text-xs text-amber-200">{key}</span>
                          </div>
                          <pre className="mt-2 overflow-x-auto text-xs leading-6 text-stone-300">
                            {value}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {[
                  ['1. Connect', 'Add a hosted cluster or prepare a local Kafka workflow.'],
                  ['2. Inspect', 'Review topics, health, and recent events immediately.'],
                  ['3. Monitor', 'Watch consumer lag and spot delays before they grow.'],
                ].map(([title, copy]) => (
                  <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-stone-400">{copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 border-t border-white/10 py-8 lg:grid-cols-2">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-xs uppercase tracking-[0.26em] text-stone-500">Hosted Kafka</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              Connect to managed or self-hosted clusters through the backend.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-stone-300">
              Secure credentials, saved cluster profiles, and a shared operational view for
              production environments.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-amber-200/12 bg-amber-300/8 p-6">
            <p className="text-xs uppercase tracking-[0.26em] text-amber-200">Local Workflows</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              Inspect development events without bouncing between scripts and terminals.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-stone-300">
              Ideal for validating producers, consumers, and topic behavior while building and
              debugging services locally.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
