const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is not defined')
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  })

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

export async function fetchClusterHealth(bootstrapServers) {
  return request(
    `/api/cluster/health?bootstrapServers=${encodeURIComponent(bootstrapServers)}`,
  )
}

export async function fetchTopics(bootstrapServers) {
  return request(
    `/api/cluster/topics?bootstrapServers=${encodeURIComponent(bootstrapServers)}`,
  )
}

export async function createTopic(payload) {
  return request('/api/cluster/topics', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function deleteTopic(bootstrapServers, topicName) {
  return request(
    `/api/cluster/topics/${encodeURIComponent(topicName)}?bootstrapServers=${encodeURIComponent(bootstrapServers)}`,
    {
      method: 'DELETE',
    },
  )
}

export async function fetchConsumerGroups(bootstrapServers) {
  return request(
    `/api/cluster/consumer-groups?bootstrapServers=${encodeURIComponent(bootstrapServers)}`,
  )
}

export async function fetchTopicMessages(bootstrapServers, topicName, limit) {
  return request(
    `/api/cluster/topics/${encodeURIComponent(topicName)}/messages?bootstrapServers=${encodeURIComponent(bootstrapServers)}&limit=${encodeURIComponent(limit)}`,
  )
}
