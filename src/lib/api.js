const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const TOKEN_STORAGE_KEY = 'kafkaboard_token'
const EMAIL_STORAGE_KEY = 'kafkaboard_email'

let unauthorizedHandler = null

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is not defined')
}

export function getToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function getEmail() {
  return localStorage.getItem(EMAIL_STORAGE_KEY) ?? ''
}

export function clearToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  localStorage.removeItem(EMAIL_STORAGE_KEY)
}

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler
}

async function request(path, options = {}) {
  const token = getToken()

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
    ...options,
  })

  if (response.status === 401) {
    clearToken()
    unauthorizedHandler?.()
    throw new Error('Oturum süresi doldu. Tekrar giriş yapın.')
  }

  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type') ?? ''
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

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
  })
}

export async function login(payload) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
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
