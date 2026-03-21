import { useEffect, useMemo, useState } from 'react'
import { Skeleton } from '../components/Skeleton'

function formatDate(value) {
  if (!value) {
    return '-'
  }

  return new Date(value).toLocaleString()
}

function getInitials(profile) {
  const source = profile?.displayName?.trim() || profile?.email || ''
  const parts = source.split(/\s+/).filter(Boolean)

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }

  return source.slice(0, 2).toUpperCase()
}

export function ProfilePage({
  profile,
  loading,
  error,
  onRefresh,
  onUpdateDisplayName,
  onUpdateEmail,
  onUpdatePassword,
  onDeleteAccount,
}) {
  const [displayNameDraft, setDisplayNameDraft] = useState('')
  const [editingDisplayName, setEditingDisplayName] = useState(false)
  const [displayNameLoading, setDisplayNameLoading] = useState(false)
  const [displayNameError, setDisplayNameError] = useState('')

  const [emailForm, setEmailForm] = useState({ newEmail: '', password: '' })
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [emailSuccess, setEmailSuccess] = useState('')

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  const [deletePassword, setDeletePassword] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    setDisplayNameDraft(profile?.displayName ?? '')
    setEmailForm((current) => ({
      ...current,
      newEmail: profile?.email ?? '',
    }))
  }, [profile])

  const initials = useMemo(() => getInitials(profile), [profile])

  async function handleDisplayNameSave() {
    setDisplayNameLoading(true)
    setDisplayNameError('')

    try {
      await onUpdateDisplayName(displayNameDraft)
      setEditingDisplayName(false)
    } catch (nextError) {
      setDisplayNameError(
        nextError instanceof Error ? nextError.message : 'Unknown error',
      )
    } finally {
      setDisplayNameLoading(false)
    }
  }

  async function handleEmailSubmit(event) {
    event.preventDefault()
    setEmailLoading(true)
    setEmailError('')
    setEmailSuccess('')

    try {
      await onUpdateEmail(emailForm)
      setEmailForm((current) => ({ ...current, password: '' }))
      setEmailSuccess('Email güncellendi. Oturum tokenları yenilendi.')
    } catch (nextError) {
      setEmailError(nextError instanceof Error ? nextError.message : 'Unknown error')
    } finally {
      setEmailLoading(false)
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Yeni şifre ve tekrar şifresi eşleşmiyor')
      return
    }

    setPasswordLoading(true)
    setPasswordError('')
    setPasswordSuccess('')

    try {
      await onUpdatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      setPasswordSuccess('Şifre güncellendi.')
    } catch (nextError) {
      setPasswordError(
        nextError instanceof Error ? nextError.message : 'Unknown error',
      )
    } finally {
      setPasswordLoading(false)
    }
  }

  async function handleDeleteSubmit(event) {
    event.preventDefault()
    setDeleteLoading(true)
    setDeleteError('')

    try {
      await onDeleteAccount(deletePassword)
    } catch (nextError) {
      setDeleteError(nextError instanceof Error ? nextError.message : 'Unknown error')
      setDeleteLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Profile
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Account settings
            </h1>
          </div>
          <button
            type="button"
            onClick={onRefresh}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            Yenile
          </button>
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="mt-6 grid gap-4">
            <Skeleton variant="card" />
            <Skeleton variant="card" />
          </div>
        ) : profile ? (
          <div className="mt-6 flex items-start gap-6">
            <div
              className="flex h-24 w-24 items-center justify-center rounded-full text-3xl font-semibold text-white shadow-lg"
              style={{ backgroundColor: profile.avatarColor ?? '#6366f1' }}
            >
              {initials}
            </div>
            <div className="grid flex-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Display name
                </p>
                {editingDisplayName ? (
                  <div className="mt-3 flex items-center gap-3">
                    <input
                      value={displayNameDraft}
                      onChange={(event) => setDisplayNameDraft(event.target.value)}
                      className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-violet-400 dark:focus:ring-violet-500/20"
                    />
                    <button
                      type="button"
                      onClick={handleDisplayNameSave}
                      disabled={displayNameLoading}
                      className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                      Kaydet
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingDisplayName(false)
                        setDisplayNameDraft(profile.displayName ?? '')
                        setDisplayNameError('')
                      }}
                      className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      Vazgeç
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 flex items-center justify-between gap-4">
                    <p className="text-sm text-slate-900 dark:text-slate-100">
                      {profile.displayName || 'Not set'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setEditingDisplayName(true)}
                      className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      Düzenle
                    </button>
                  </div>
                )}
                {displayNameError ? (
                  <p className="mt-3 text-sm text-rose-600 dark:text-rose-300">{displayNameError}</p>
                ) : null}
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Member since
                </p>
                <p className="mt-3 text-sm text-slate-900 dark:text-slate-100">
                  {formatDate(profile.createdAt)}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Email
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Email address
        </h2>

        <form className="mt-6 grid gap-4 md:grid-cols-[1fr_1fr_auto]" onSubmit={handleEmailSubmit}>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            New email
            <input
              type="email"
              value={emailForm.newEmail}
              onChange={(event) =>
                setEmailForm((current) => ({ ...current, newEmail: event.target.value }))
              }
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-violet-400 dark:focus:ring-violet-500/20"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            Current password
            <input
              type="password"
              value={emailForm.password}
              onChange={(event) =>
                setEmailForm((current) => ({ ...current, password: event.target.value }))
              }
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-violet-400 dark:focus:ring-violet-500/20"
            />
          </label>
          <button
            type="submit"
            disabled={emailLoading}
            className="h-11 self-end rounded-lg bg-violet-600 px-4 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {emailLoading ? 'Güncelleniyor...' : 'Email Güncelle'}
          </button>
        </form>
        {emailError ? <p className="mt-3 text-sm text-rose-600 dark:text-rose-300">{emailError}</p> : null}
        {emailSuccess ? <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-300">{emailSuccess}</p> : null}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Security
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Change password
        </h2>

        <form className="mt-6 grid gap-4 md:grid-cols-3" onSubmit={handlePasswordSubmit}>
          <Field
            label="Current password"
            type="password"
            value={passwordForm.currentPassword}
            onChange={(value) =>
              setPasswordForm((current) => ({ ...current, currentPassword: value }))
            }
          />
          <Field
            label="New password"
            type="password"
            value={passwordForm.newPassword}
            onChange={(value) =>
              setPasswordForm((current) => ({ ...current, newPassword: value }))
            }
          />
          <Field
            label="Confirm new password"
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(value) =>
              setPasswordForm((current) => ({ ...current, confirmPassword: value }))
            }
          />
          <button
            type="submit"
            disabled={passwordLoading}
            className="h-11 rounded-lg bg-violet-600 px-4 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-400 md:col-span-3 md:w-fit"
          >
            {passwordLoading ? 'Güncelleniyor...' : 'Şifre Güncelle'}
          </button>
        </form>
        {passwordError ? <p className="mt-3 text-sm text-rose-600 dark:text-rose-300">{passwordError}</p> : null}
        {passwordSuccess ? <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-300">{passwordSuccess}</p> : null}
      </section>

      <section className="rounded-2xl border border-rose-200 bg-rose-50/60 p-6 shadow-sm dark:border-rose-500/30 dark:bg-rose-500/10">
        <p className="text-xs font-medium uppercase tracking-wider text-rose-600 dark:text-rose-300">
          Danger Zone
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Delete account
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Bu işlem geri alınamaz. Tüm cluster kayıtları ve refresh tokenları silinir.
        </p>

        <form className="mt-6 flex max-w-xl items-end gap-4" onSubmit={handleDeleteSubmit}>
          <Field
            label="Current password"
            type="password"
            value={deletePassword}
            onChange={setDeletePassword}
          />
          <button
            type="submit"
            disabled={deleteLoading}
            className="h-11 rounded-lg bg-rose-500 px-4 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {deleteLoading ? 'Siliniyor...' : 'Hesabı Sil'}
          </button>
        </form>
        {deleteError ? <p className="mt-3 text-sm text-rose-600 dark:text-rose-300">{deleteError}</p> : null}
      </section>
    </div>
  )
}

function Field({ label, type, value, onChange }) {
  return (
    <label className="flex flex-1 flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-violet-400 dark:focus:ring-violet-500/20"
      />
    </label>
  )
}
