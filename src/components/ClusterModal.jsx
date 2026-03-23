import { useEffect, useState } from 'react'

const SECURITY_PROTOCOLS = ['PLAINTEXT', 'SASL_SSL', 'SASL_PLAINTEXT']
const SASL_MECHANISMS = ['PLAIN', 'SCRAM-SHA-256', 'SCRAM-SHA-512']

export function ClusterModal({
  open,
  form,
  onChange,
  onClose,
  onTestConnection,
  onSubmit,
  loading,
  testLoading,
  testResult,
  error,
}) {
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (!open) {
      setShowPassword(false)
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

  const isSasl =
    form.securityProtocol === 'SASL_SSL' || form.securityProtocol === 'SASL_PLAINTEXT'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm">
      <div className="kb-panel-solid w-full max-w-md">
        <div className="flex items-start justify-between border-b border-stone-200 px-6 py-5 dark:border-stone-700">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Cluster Create
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
              Yeni Cluster
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

        <div className="grid gap-4 px-6 py-6">
          <label className="flex flex-col gap-2 text-sm font-medium text-stone-700 dark:text-stone-300">
            Cluster Name
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              className="kb-input"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-stone-700 dark:text-stone-300">
            Bootstrap Servers
            <input
              name="bootstrapServers"
              value={form.bootstrapServers}
              onChange={onChange}
              className="kb-input"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-stone-700 dark:text-stone-300">
            Security Protocol
            <select
              name="securityProtocol"
              value={form.securityProtocol}
              onChange={onChange}
              className="kb-input"
            >
              {SECURITY_PROTOCOLS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>

          {isSasl ? (
            <>
              <label className="flex flex-col gap-2 text-sm font-medium text-stone-700 dark:text-stone-300">
                SASL Mechanism
                <select
                  name="saslMechanism"
                  value={form.saslMechanism}
                  onChange={onChange}
                  className="kb-input"
                >
                  {SASL_MECHANISMS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-stone-700 dark:text-stone-300">
                Username
                <input
                  name="saslUsername"
                  value={form.saslUsername}
                  onChange={onChange}
                  autoComplete="off"
                  className="kb-input"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-stone-700 dark:text-stone-300">
                Password
                <div className="relative">
                  <input
                    name="saslPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={form.saslPassword}
                    onChange={onChange}
                    autoComplete="new-password"
                    className="kb-input h-11 w-full pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -transtone-y-1/2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                    aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074L3.707 2.293zM9.071 9.071a2 2 0 012.857 2.857L9.071 9.071z" clipRule="evenodd" />
                        <path d="M10 17c-4.478 0-8.268-2.943-9.542-7a10.002 10.002 0 012.145-3.723L4.05 7.724A8.003 8.003 0 002.46 10c1.274 4.057 5.064 7 7.54 7 .893 0 1.75-.149 2.55-.42l-1.401-1.401A4 4 0 0110 17z" />
                      </svg>
                    )}
                  </button>
                </div>
              </label>
            </>
          ) : null}
        </div>

        {error ? (
          <p className="kb-alert-error mx-6">
            {error}
          </p>
        ) : null}

        {testResult ? (
          <p
            className={`mx-6 mt-4 rounded-xl border px-4 py-3 text-sm font-medium ${
              testResult.status === 'HEALTHY'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200'
                : 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200'
            }`}
          >
            {testResult.status === 'HEALTHY'
              ? 'Bağlantı başarılı'
              : 'Bağlantı kurulamadı'}
          </p>
        ) : null}

        <div className="mt-6 flex justify-end gap-3 border-t border-stone-200 px-6 py-5 dark:border-stone-700">
          <button
            type="button"
            onClick={onTestConnection}
            disabled={testLoading || !form.bootstrapServers.trim()}
            className="kb-btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {testLoading ? 'Test ediliyor...' : 'Bağlantıyı Test Et'}
          </button>
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
            {loading ? 'Ekleniyor...' : 'Cluster Ekle'}
          </button>
        </div>
      </div>
    </div>
  )
}
