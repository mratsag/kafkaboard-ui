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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-8 py-14 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs font-medium uppercase tracking-wider text-violet-600 dark:text-violet-300">
            kafkaboard
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Kafka yönetim paneli
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Oturum açın veya yeni kullanıcı oluşturun.
          </p>

          <div className="mt-8 inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-900">
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

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {mode === 'login' ? 'Hesabınıza giriş yapın' : 'Yeni kullanıcı oluşturun'}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {mode === 'login'
              ? 'Token localStorage içinde tutulur ve dashboard doğrudan açılır.'
              : 'Kayıt başarılı olunca otomatik olarak giriş yapılır.'}
          </p>

          <div className="mt-8 space-y-5">
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
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
                className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-violet-400 dark:focus:ring-violet-500/20"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
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
                className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-violet-400 dark:focus:ring-violet-500/20"
              />
            </label>
          </div>

          {error ? (
            <p className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
              {error}
            </p>
          ) : null}

          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="mt-8 h-11 w-full rounded-lg bg-violet-600 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-400"
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
  )
}

function ModeButton({ active, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
        active
          ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-slate-100'
          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
      }`}
    >
      {label}
    </button>
  )
}
