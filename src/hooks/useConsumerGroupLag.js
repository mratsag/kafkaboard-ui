import { useEffect, useReducer, useRef } from 'react'

function getWebSocketBaseUrl() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  if (!apiBaseUrl) {
    throw new Error('VITE_API_BASE_URL is not defined')
  }

  if (apiBaseUrl.startsWith('https://')) {
    return apiBaseUrl.replace('https://', 'wss://')
  }

  return apiBaseUrl.replace('http://', 'ws://')
}

const INITIAL_STATE = {
  groups: null,
  loading: false,
  error: '',
  connected: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'reset':
      return INITIAL_STATE
    case 'connecting':
      return {
        ...state,
        groups: null,
        loading: true,
        error: '',
        connected: false,
      }
    case 'connected':
      return {
        ...state,
        connected: true,
        error: '',
      }
    case 'message':
      return {
        ...state,
        groups: action.payload,
        loading: false,
        error: '',
      }
    case 'error':
      return {
        ...state,
        connected: false,
        error: action.payload,
      }
    case 'disconnected':
      return {
        ...state,
        connected: false,
      }
    case 'failed':
      return {
        ...state,
        loading: false,
        connected: false,
        error: 'Bağlantı kurulamadı',
      }
    default:
      return state
  }
}

export function useConsumerGroupLag(clusterId, token) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  const websocketRef = useRef(null)
  const reconnectAttemptsRef = useRef(0)
  const reconnectTimerRef = useRef(null)
  const shouldReconnectRef = useRef(true)

  useEffect(() => {
    if (!clusterId || !token) {
      dispatch({ type: 'reset' })
      return undefined
    }

    shouldReconnectRef.current = true
    reconnectAttemptsRef.current = 0
    dispatch({ type: 'connecting' })

    const connect = () => {
      if (!shouldReconnectRef.current) {
        return
      }

      const websocketUrl = `${getWebSocketBaseUrl()}/ws/clusters/${clusterId}/lag?token=${encodeURIComponent(token)}`
      const socket = new WebSocket(websocketUrl)
      websocketRef.current = socket

      socket.onopen = () => {
        reconnectAttemptsRef.current = 0
        dispatch({ type: 'connected' })
        console.log(`Lag WebSocket connected: ${clusterId}`)
      }

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data)
          if (payload && typeof payload === 'object' && 'error' in payload) {
            dispatch({ type: 'error', payload: payload.error })
            return
          }

          dispatch({
            type: 'message',
            payload: Array.isArray(payload) ? payload : [],
          })
        } catch {
          dispatch({ type: 'error', payload: 'WebSocket verisi okunamadı' })
        }
      }

      socket.onerror = () => {
        dispatch({ type: 'error', payload: 'WebSocket bağlantı hatası' })
      }

      socket.onclose = () => {
        dispatch({ type: 'disconnected' })
        if (!shouldReconnectRef.current) {
          return
        }

        if (reconnectAttemptsRef.current >= 5) {
          dispatch({ type: 'failed' })
          return
        }

        reconnectAttemptsRef.current += 1
        console.log(
          `Lag WebSocket reconnect ${reconnectAttemptsRef.current}/5: ${clusterId}`,
        )
        reconnectTimerRef.current = window.setTimeout(connect, 3000)
      }
    }

    connect()

    return () => {
      shouldReconnectRef.current = false

      if (reconnectTimerRef.current) {
        window.clearTimeout(reconnectTimerRef.current)
      }

      if (websocketRef.current) {
        websocketRef.current.close()
        websocketRef.current = null
      }
    }
  }, [clusterId, token])

  return state
}
