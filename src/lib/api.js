const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
const TOKEN_STORAGE_KEY = 'kafkaboard_token'
const REFRESH_TOKEN_STORAGE_KEY = 'kafkaboard_refresh_token'
const EMAIL_STORAGE_KEY = 'kafkaboard_email'

let unauthorizedHandler = null
let tokenUpdateHandler = null
let refreshRequestPromise = null

export function getToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)
}

export function getEmail() {
  return localStorage.getItem(EMAIL_STORAGE_KEY) ?? ''
}

export function storeAuthSession({ token, refreshToken, email }) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken)
  } else {
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
  }
  if (email) {
    localStorage.setItem(EMAIL_STORAGE_KEY, email)
  }
}

export function clearToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
  localStorage.removeItem(EMAIL_STORAGE_KEY)
}

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler
}

export function setTokenUpdateHandler(handler) {
  tokenUpdateHandler = handler
}

function shouldTryRefresh(path, allowRefresh) {
  if (!allowRefresh) {
    return false
  }

  return ![
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/refresh',
    '/api/auth/logout',
  ].includes(path)
}

async function parseResponseBody(response) {
  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type') ?? ''
  return contentType.includes('application/json')
    ? await response.json()
    : await response.text()
}

async function performFetch(path, options = {}, tokenOverride = null) {
  const { headers, useAuth = true, ...fetchOptions } = options
  const token = tokenOverride ?? getToken()

  return fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(useAuth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers ?? {}),
    },
    ...fetchOptions,
  })
}

async function refreshAccessTokenInternal() {
  if (refreshRequestPromise) {
    return refreshRequestPromise
  }

  const refreshToken = getRefreshToken()

  refreshRequestPromise = (async () => {
    const response = await performFetch(
      '/api/auth/refresh',
      {
        method: 'POST',
        body: JSON.stringify(refreshToken ? { refreshToken } : {}),
        useAuth: false,
      },
      null,
    )

    const data = await parseResponseBody(response)

    if (response.status === 401) {
      throw new Error('Oturum süresi doldu. Tekrar giriş yapın.')
    }

    if (!response.ok) {
      const errorMessage =
        typeof data === 'object' && data !== null && 'error' in data
          ? data.error
          : 'Unexpected API error'
      throw new Error(errorMessage)
    }

    localStorage.setItem(TOKEN_STORAGE_KEY, data.token)
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
    tokenUpdateHandler?.(data.token)
    return data.token
  })()

  try {
    return await refreshRequestPromise
  } finally {
    refreshRequestPromise = null
  }
}

async function request(path, options = {}) {
  const { allowRefresh = true, ...fetchOptions } = options
  let response = await performFetch(path, fetchOptions)

  if (response.status === 401 && shouldTryRefresh(path, allowRefresh)) {
    try {
      const refreshedToken = await refreshAccessTokenInternal()
      response = await performFetch(path, fetchOptions, refreshedToken)
    } catch {
      clearToken()
      unauthorizedHandler?.()
      throw new Error('Oturum süresi doldu. Tekrar giriş yapın.')
    }
  }

  const data = await parseResponseBody(response)

  if (response.status === 401) {
    const errorMessage =
      typeof data === 'object' && data !== null && 'error' in data
        ? data.error
        : 'Oturum süresi doldu. Tekrar giriş yapın.'

    if (path === '/api/auth/login' || path === '/api/auth/register') {
      throw new Error(errorMessage)
    }

    clearToken()
    unauthorizedHandler?.()
    throw new Error('Oturum süresi doldu. Tekrar giriş yapın.')
  }

  if (response.status === 429) {
    const errorMessage =
      typeof data === 'object' && data !== null && 'error' in data
        ? data.error
        : 'Çok fazla istek. Lütfen bekleyin.'
    const retryAfter =
      typeof data === 'object' && data !== null && 'retryAfter' in data
        ? data.retryAfter
        : null

    throw new Error(
      retryAfter ? `${errorMessage} (${retryAfter}s sonra tekrar deneyin)` : errorMessage,
    )
  }

  if (!response.ok) {
    const errorMessage =
      typeof data === 'object' && data !== null && 'error' in data
        ? data.error
        : 'Unexpected API error'

    throw new Error(errorMessage)
  }

  return data
}

export async function register(payload) {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
    allowRefresh: false,
  })
}

export async function login(payload) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
    allowRefresh: false,
  })
}

export async function refreshAccessToken() {
  return refreshAccessTokenInternal()
}

export async function logout() {
  const response = await performFetch('/api/auth/logout', {
    method: 'POST',
    body: JSON.stringify(getRefreshToken() ? { refreshToken: getRefreshToken() } : {}),
    useAuth: false,
  })

  if (response.status === 204) {
    return null
  }

  return parseResponseBody(response)
}

export async function fetchClusters() {
  return request('/api/clusters')
}

export async function createCluster(payload) {
  return request('/api/clusters', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function testConnection(payload) {
  return request('/api/clusters/test-connection', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function deleteCluster(clusterId) {
  return request(`/api/clusters/${encodeURIComponent(clusterId)}`, {
    method: 'DELETE',
  })
}

export async function fetchClusterHealth(clusterId) {
  return request(`/api/clusters/${encodeURIComponent(clusterId)}/health`)
}

export async function fetchTopics(clusterId) {
  return request(`/api/clusters/${encodeURIComponent(clusterId)}/topics`)
}

export async function createTopic(clusterId, payload) {
  return request(`/api/clusters/${encodeURIComponent(clusterId)}/topics`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function deleteTopic(clusterId, topicName) {
  return request(
    `/api/clusters/${encodeURIComponent(clusterId)}/topics/${encodeURIComponent(topicName)}`,
    {
      method: 'DELETE',
    },
  )
}

export async function fetchConsumerGroups(clusterId) {
  return request(`/api/clusters/${encodeURIComponent(clusterId)}/consumer-groups`)
}

export async function fetchTopicMessages(clusterId, topicName, limit) {
  return request(
    `/api/clusters/${encodeURIComponent(clusterId)}/topics/${encodeURIComponent(topicName)}/messages?limit=${encodeURIComponent(limit)}`,
  )
}

export async function fetchProfile() {
  return request('/api/profile')
}

export async function updateDisplayName(payload) {
  return request('/api/profile/display-name', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function updateProfileEmail(payload) {
  return request('/api/profile/email', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function updateProfilePassword(payload) {
  return request('/api/profile/password', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function deleteProfile(payload) {
  return request('/api/profile', {
    method: 'DELETE',
    body: JSON.stringify(payload),
  })
}
