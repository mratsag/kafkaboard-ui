export function AuthScreen({
  mode,
  form,
  loading,
  error,
  onModeChange,
  onFormChange,
  onSubmit,
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_28%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_40%,#f8fafc_100%)] px-8 py-14 text-slate-900">
      <div className="mx-auto grid w-[1120px] max-w-full grid-cols-[1.05fr_0.95fr] gap-8">
        <section className="rounded-[32px] border border-slate-200 bg-slate-950 p-10 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-300">
            Kafkaboard
          </p>
          <h1 className="mt-5 max-w-lg text-5xl font-semibold leading-tight tracking-tight">
            Kafka cluster operasyonlarını tek panelden yönet.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300">
            JWT korumalı oturum açma, kayıtlı cluster listesi, topic yaşam döngüsü,
            consumer lag görünümü ve son mesaj okuma akışı tek yerde.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-4 text-sm">
            <StatCard label="Auth" value="JWT" />
            <StatCard label="Storage" value="Supabase" />
            <StatCard label="Broker" value="Cluster IDs" />
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-10 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="inline-flex rounded-full border border-slate-200 bg-slate-100 p-1">
            <ModeButton
              active={mode === 'login'}
              onClick={() => onModeChange('login')}
              label="Login"
            />
            <ModeButton
              active={mode === 'register'}
              onClick={() => onModeChange('register')}
              label="Register"
            />
          </div>

          <h2 className="mt-8 text-3xl font-semibold text-slate-950">
            {mode === 'login' ? 'Hesabınıza giriş yapın' : 'Yeni kullanıcı oluşturun'}
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            {mode === 'login'
              ? 'Token localStorage içinde tutulur ve dashboard doğrudan açılır.'
              : 'Kayıt başarılı olunca otomatik olarak giriş yapılır.'}
          </p>

          <div className="mt-8 space-y-5">
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                value={form.email}
                onChange={(event) =>
                  onFormChange((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                className="h-12 rounded-2xl border border-slate-300 bg-slate-50 px-4 outline-none transition focus:border-slate-900 focus:bg-white"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Password
              <input
                type="password"
                value={form.password}
                onChange={(event) =>
                  onFormChange((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
                className="h-12 rounded-2xl border border-slate-300 bg-slate-50 px-4 outline-none transition focus:border-slate-900 focus:bg-white"
              />
            </label>
          </div>

          {error ? (
            <p className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </p>
          ) : null}

          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="mt-8 h-12 w-full rounded-2xl bg-slate-950 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading
              ? mode === 'login'
                ? 'Giriş yapılıyor...'
                : 'Kayıt oluşturuluyor...'
              : mode === 'login'
                ? 'Login'
                : 'Register'}
          </button>
        </section>
      </div>
    </div>
  )
}

function ModeButton({ active, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active
          ? 'bg-white text-slate-950 shadow-sm'
          : 'text-slate-500 hover:text-slate-900'
      }`}
    >
      {label}
    </button>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
      <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">
        {label}
      </p>
      <p className="mt-3 text-lg font-semibold">{value}</p>
    </div>
  )
}
