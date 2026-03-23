import { useState } from 'react'

export function AuthScreen({
  mode,
  form,
  loading,
  error,
  onModeChange,
  onFormChange,
  onSubmit,
}) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault()
      onSubmit()
    }
  }

  return (
    <div className="flex min-h-full flex-1 text-stone-100">
      <section className="flex w-2/5 flex-col justify-center bg-stone-950 px-16 py-12 text-white">
        <div className="mx-auto flex w-full max-w-xl flex-col justify-center">
          <p className="text-sm font-medium uppercase tracking-wider text-amber-300">
            kafkaboard
          </p>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight">
            Kafka cluster management, simplified.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-stone-300">
            Tek panelden cluster sağlığı, topic işlemleri, consumer group görünümü ve mesaj okuma akışını yönetin.
          </p>

          <ul className="mt-14 space-y-4 text-sm text-stone-300">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-amber-300">✦</span>
              <span>Real-time cluster health monitoring</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-amber-300">✦</span>
              <span>Topic & consumer group management</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-amber-300">✦</span>
              <span>Multi-cluster support</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="flex w-3/5 flex-col items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.12),_transparent_30%),linear-gradient(180deg,_#1c1917,_#0c0a09)] px-16 py-12">
        <form
          className="w-full max-w-md"
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit()
          }}
          onKeyDown={handleKeyDown}
        >
          {error ? (
            <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          <p className="text-xs font-medium uppercase tracking-wider text-amber-300">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-100">
            {mode === 'login' ? 'Giriş yapın' : 'Yeni hesap oluşturun'}
          </h2>
          <p className="mt-2 text-sm text-stone-400">
            {mode === 'login'
              ? 'Kaydedilmiş cluster listenize erişmek için oturum açın.'
              : 'Yeni hesabınızı oluşturun, ardından dashboard doğrudan açılacak.'}
          </p>

          <div className="mt-8 space-y-5">
            <FieldLabel label="Email">
              <input
                type="email"
                value={form.email}
                onChange={(event) =>
                  onFormChange((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                className="kb-input-auth"
              />
            </FieldLabel>

            <FieldLabel label="Password">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(event) =>
                    onFormChange((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  className="kb-input-auth"
                />
                <PasswordToggleButton
                  visible={showPassword}
                  onClick={() => setShowPassword((current) => !current)}
                />
              </div>
            </FieldLabel>

            {mode === 'register' ? (
              <FieldLabel label="Confirm Password">
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={form.confirmPassword ?? ''}
                    onChange={(event) =>
                      onFormChange((current) => ({
                        ...current,
                        confirmPassword: event.target.value,
                      }))
                    }
                    className="kb-input-auth"
                  />
                  <PasswordToggleButton
                    visible={showConfirmPassword}
                    onClick={() => setShowConfirmPassword((current) => !current)}
                  />
                </div>
              </FieldLabel>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="kb-btn-primary mt-8 h-12 w-full rounded-xl"
          >
            {loading
              ? mode === 'login'
                ? 'Giriş yapılıyor...'
                : 'Kayıt oluşturuluyor...'
              : mode === 'login'
                ? 'Login'
                : 'Register'}
          </button>

          <p className="mt-6 text-sm text-stone-400">
            {mode === 'login' ? 'Hesabınız yok mu?' : 'Zaten hesabınız var mı?'}{' '}
            <button
              type="button"
              onClick={() => onModeChange(mode === 'login' ? 'register' : 'login')}
              className="font-medium text-amber-300 transition hover:text-amber-200"
            >
              {mode === 'login' ? 'Register' : 'Login'}
            </button>
          </p>
        </form>
      </section>
    </div>
  )
}

function FieldLabel({ label, children }) {
  return (
    <label className="block text-sm font-medium text-stone-300">
      <span className="mb-2 block">{label}</span>
      {children}
    </label>
  )
}

function PasswordToggleButton({ visible, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-stone-500 transition hover:text-stone-200"
      aria-label={visible ? 'Şifreyi gizle' : 'Şifreyi göster'}
    >
      {visible ? <EyeOpenIcon /> : <EyeClosedIcon />}
    </button>
  )
}

function EyeOpenIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeClosedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 3l18 18" />
      <path d="M10.6 10.7a3 3 0 0 0 4.2 4.2" />
      <path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c6.5 0 10 7 10 7a16.9 16.9 0 0 1-3.2 3.9" />
      <path d="M6.2 6.3C3.8 8 2.4 10.5 2 12c0 0 3.5 7 10 7 1.6 0 3-.3 4.2-.8" />
    </svg>
  )
}
