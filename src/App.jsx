import { useCallback, useEffect, useRef, useState } from 'react'
import { AuthScreen } from './components/AuthScreen'
import { ClusterModal } from './components/ClusterModal'
import { ClusterSidebar } from './components/ClusterSidebar'
import { ConsumerGroupsSection } from './components/ConsumerGroupsSection'
import { MessageViewer } from './components/MessageViewer'
import { TopicModal } from './components/TopicModal'
import { TopicSection } from './components/TopicSection'
import {
  clearToken,
  createCluster,
  createTopic,
  deleteCluster,
  deleteTopic,
  fetchClusterHealth,
  fetchClusters,
  fetchConsumerGroups,
  fetchTopicMessages,
  fetchTopics,
  getToken,
  login,
  register,
  setUnauthorizedHandler,
} from './lib/api'

const INITIAL_TOPIC_FORM = {
  topicName: '',
  partitions: '1',
  replicationFactor: '1',
}
const INITIAL_CLUSTER_FORM = {
  name: '',
  bootstrapServers: 'localhost:9092',
}

function App() {
  const isMountedRef = useRef(true)

  const [view, setView] = useState(getToken() ? 'dashboard' : 'login')
  const [token, setToken] = useState(() => getToken())

  const [clusters, setClusters] = useState([])
  const [selectedClusterId, setSelectedClusterId] = useState(null)
  const [health, setHealth] = useState(null)
  const [topics, setTopics] = useState([])
  const [consumerGroups, setConsumerGroups] = useState([])
  const [messages, setMessages] = useState([])

  const [selectedTopic, setSelectedTopic] = useState('')
  const [messageLimit, setMessageLimit] = useState('10')
  const [expandedGroupId, setExpandedGroupId] = useState(null)

  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({ email: '', password: '' })

  const [authError, setAuthError] = useState('')
  const [clusterError, setClusterError] = useState('')
  const [healthError, setHealthError] = useState('')
  const [topicsError, setTopicsError] = useState('')
  const [groupsError, setGroupsError] = useState('')
  const [messagesError, setMessagesError] = useState('')
  const [createTopicError, setCreateTopicError] = useState('')
  const [createClusterError, setCreateClusterError] = useState('')

  const [authLoading, setAuthLoading] = useState(false)
  const [clustersLoading, setClustersLoading] = useState(false)
  const [clusterActionLoading, setClusterActionLoading] = useState(false)
  const [healthLoading, setHealthLoading] = useState(false)
  const [topicsLoading, setTopicsLoading] = useState(false)
  const [groupsLoading, setGroupsLoading] = useState(false)
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [createTopicLoading, setCreateTopicLoading] = useState(false)
  const [deletingTopic, setDeletingTopic] = useState('')
  const [deletingClusterId, setDeletingClusterId] = useState('')

  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false)
  const [isClusterModalOpen, setIsClusterModalOpen] = useState(false)
  const [topicForm, setTopicForm] = useState(INITIAL_TOPIC_FORM)
  const [clusterForm, setClusterForm] = useState(INITIAL_CLUSTER_FORM)

  function safeSetState(updater) {
    if (isMountedRef.current) {
      updater()
    }
  }

  const resetDashboardData = useCallback(() => {
    setHealth(null)
    setTopics([])
    setConsumerGroups([])
    setMessages([])
    setSelectedTopic('')
    setExpandedGroupId(null)
    setHealthError('')
    setTopicsError('')
    setGroupsError('')
    setMessagesError('')
  }, [])

  const resetToLoginState = useCallback(() => {
    clearToken()
    setToken(null)
    setView('login')
    setClusters([])
    setSelectedClusterId(null)
    resetDashboardData()
    setClusterError('')
    setAuthError('')
    setAuthMode('login')
    setAuthForm({ email: '', password: '' })
  }, [resetDashboardData])

  const loadClusters = useCallback(async (preferredClusterId = null) => {
    safeSetState(() => {
      setClustersLoading(true)
      setClusterError('')
    })

    try {
      const clusterData = await fetchClusters()

      safeSetState(() => {
        setClusters(clusterData)
        setSelectedClusterId((current) => {
          if (
            preferredClusterId &&
            clusterData.some((cluster) => cluster.id === preferredClusterId)
          ) {
            return preferredClusterId
          }
          if (current && clusterData.some((cluster) => cluster.id === current)) {
            return current
          }
          return clusterData[0]?.id ?? null
        })

        if (clusterData.length === 0) {
          resetDashboardData()
        }
      })
    } catch (error) {
      safeSetState(() => {
        setClusterError(error instanceof Error ? error.message : 'Unknown error')
      })
    } finally {
      safeSetState(() => {
        setClustersLoading(false)
      })
    }
  }, [resetDashboardData])

  const loadClusterDashboard = useCallback(async (clusterId) => {
    safeSetState(() => {
      setHealthLoading(true)
      setTopicsLoading(true)
      setGroupsLoading(true)
      setHealthError('')
      setTopicsError('')
      setGroupsError('')
      setMessages([])
      setMessagesError('')
      setExpandedGroupId(null)
    })

    try {
      const [healthData, topicsData, groupsData] = await Promise.all([
        fetchClusterHealth(clusterId),
        fetchTopics(clusterId),
        fetchConsumerGroups(clusterId),
      ])

      safeSetState(() => {
        setHealth(healthData)
        setTopics(topicsData)
        setConsumerGroups(groupsData)
        setSelectedTopic((currentTopic) => {
          if (
            currentTopic &&
            topicsData.some((topic) => topic.name === currentTopic)
          ) {
            return currentTopic
          }
          return topicsData[0]?.name ?? ''
        })
      })

      console.log('Scenario 5 - cluster selected:', {
        clusterId,
        status: healthData.status,
        topicCount: topicsData.length,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      safeSetState(() => {
        setHealthError(errorMessage)
        setTopicsError(errorMessage)
        setGroupsError(errorMessage)
      })
    } finally {
      safeSetState(() => {
        setHealthLoading(false)
        setTopicsLoading(false)
        setGroupsLoading(false)
      })
    }
  }, [])

  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
    }
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(() => {
      safeSetState(() => {
        resetToLoginState()
      })
    })

    return () => {
      setUnauthorizedHandler(null)
    }
  }, [resetToLoginState])

  useEffect(() => {
    if (!token) {
      return
    }

    loadClusters()
  }, [loadClusters, token])

  useEffect(() => {
    if (!token || !selectedClusterId) {
      return
    }

    loadClusterDashboard(selectedClusterId)
  }, [loadClusterDashboard, selectedClusterId, token])

  async function handleAuthSubmit() {
    setAuthLoading(true)
    setAuthError('')

    try {
      const payload = {
        email: authForm.email.trim(),
        password: authForm.password,
      }

      const response =
        authMode === 'login' ? await login(payload) : await register(payload)

      localStorage.setItem('kafkaboard_token', response.token)
      safeSetState(() => {
        setToken(response.token)
        setView('dashboard')
        setAuthForm({ email: '', password: '' })
      })

      console.log(
        authMode === 'login'
          ? 'Scenario 3 - login successful'
          : 'Scenario 2 - register successful',
      )
    } catch (error) {
      safeSetState(() => {
        setAuthError(error instanceof Error ? error.message : 'Unknown error')
      })
    } finally {
      safeSetState(() => {
        setAuthLoading(false)
      })
    }
  }

  function handleLogout() {
    console.log('Scenario 3 - logout successful')
    resetToLoginState()
  }

  function handleTopicFormChange(event) {
    const { name, value } = event.target
    setTopicForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleClusterFormChange(event) {
    const { name, value } = event.target
    setClusterForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleCreateCluster() {
    setClusterActionLoading(true)
    setCreateClusterError('')

    try {
      const nextCluster = await createCluster({
        name: clusterForm.name.trim(),
        bootstrapServers: clusterForm.bootstrapServers.trim(),
      })

      safeSetState(() => {
        setIsClusterModalOpen(false)
        setClusterForm(INITIAL_CLUSTER_FORM)
      })

      await loadClusters(nextCluster.id)
      console.log('Scenario 4 - cluster created:', nextCluster.name)
    } catch (error) {
      safeSetState(() => {
        setCreateClusterError(
          error instanceof Error ? error.message : 'Unknown error',
        )
      })
    } finally {
      safeSetState(() => {
        setClusterActionLoading(false)
      })
    }
  }

  async function handleDeleteCluster(clusterId) {
    const cluster = clusters.find((item) => item.id === clusterId)
    const confirmed = window.confirm(
      `${cluster?.name ?? 'Cluster'} kaydını silmek istediğinize emin misiniz?`,
    )

    if (!confirmed) {
      return
    }

    const nextRemainingClusters = clusters.filter((item) => item.id !== clusterId)

    setDeletingClusterId(clusterId)
    setClusterError('')

    try {
      await deleteCluster(clusterId)

      safeSetState(() => {
        setClusters(nextRemainingClusters)
        if (selectedClusterId === clusterId) {
          setSelectedClusterId(nextRemainingClusters[0]?.id ?? null)
          resetDashboardData()
        }
      })

      console.log('Scenario 9 - cluster deleted:', clusterId)
    } catch (error) {
      safeSetState(() => {
        setClusterError(error instanceof Error ? error.message : 'Unknown error')
      })
    } finally {
      safeSetState(() => {
        setDeletingClusterId('')
      })
    }
  }

  async function handleCreateTopic() {
    if (!selectedClusterId) {
      setCreateTopicError('Önce bir cluster seçin')
      return
    }

    setCreateTopicError('')
    setCreateTopicLoading(true)

    try {
      await createTopic(selectedClusterId, {
        topicName: topicForm.topicName.trim(),
        partitions: Number(topicForm.partitions),
        replicationFactor: Number(topicForm.replicationFactor),
      })

      await loadTopicsOnly(selectedClusterId)
      setIsTopicModalOpen(false)
      setTopicForm(INITIAL_TOPIC_FORM)
      console.log('Scenario 6 - topic created:', topicForm.topicName.trim())
    } catch (error) {
      setCreateTopicError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      safeSetState(() => {
        setCreateTopicLoading(false)
      })
    }
  }

  async function loadTopicsOnly(clusterId) {
    setTopicsLoading(true)
    setTopicsError('')

    try {
      const topicsData = await fetchTopics(clusterId)
      safeSetState(() => {
        setTopics(topicsData)
        setSelectedTopic((currentTopic) => {
          if (
            currentTopic &&
            topicsData.some((topic) => topic.name === currentTopic)
          ) {
            return currentTopic
          }
          return topicsData[0]?.name ?? ''
        })
      })
    } catch (error) {
      safeSetState(() => {
        setTopicsError(error instanceof Error ? error.message : 'Unknown error')
      })
    } finally {
      safeSetState(() => {
        setTopicsLoading(false)
      })
    }
  }

  async function handleDeleteTopic(topicName) {
    if (!selectedClusterId) {
      return
    }

    const confirmed = window.confirm(
      `${topicName} topic'ini silmek istediğinize emin misiniz?`,
    )

    if (!confirmed) {
      return
    }

    setDeletingTopic(topicName)
    setTopicsError('')

    try {
      await deleteTopic(selectedClusterId, topicName)
      await loadTopicsOnly(selectedClusterId)
      if (selectedTopic === topicName) {
        setMessages([])
      }
      console.log('Scenario 6 - topic deleted:', topicName)
    } catch (error) {
      setTopicsError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      safeSetState(() => {
        setDeletingTopic('')
      })
    }
  }

  async function handleFetchMessages() {
    if (!selectedClusterId) {
      setMessagesError('Önce bir cluster seçin')
      return
    }
    if (!selectedTopic) {
      setMessagesError('Topic seçin')
      return
    }

    setMessagesLoading(true)
    setMessagesError('')

    try {
      const nextMessages = await fetchTopicMessages(
        selectedClusterId,
        selectedTopic,
        Number(messageLimit),
      )

      safeSetState(() => {
        setMessages(nextMessages)
      })

      console.log('Scenario 8 - messages loaded:', {
        topic: selectedTopic,
        limit: Number(messageLimit),
        count: nextMessages.length,
      })
    } catch (error) {
      safeSetState(() => {
        setMessagesError(error instanceof Error ? error.message : 'Unknown error')
      })
    } finally {
      safeSetState(() => {
        setMessagesLoading(false)
      })
    }
  }

  function handleToggleGroup(groupId) {
    setExpandedGroupId((current) => (current === groupId ? null : groupId))

    const nextGroup = consumerGroups.find((group) => group.groupId === groupId)
    if (nextGroup) {
      console.log('Scenario 7 - consumer group toggled:', {
        groupId: nextGroup.groupId,
        totalLag: nextGroup.totalLag,
        partitions: nextGroup.partitionLags.length,
      })
    }
  }

  const selectedCluster =
    clusters.find((cluster) => cluster.id === selectedClusterId) ?? null

  if (view === 'login') {
    console.log('Scenario 1 - login screen visible: no token present')

    return (
      <AuthScreen
        mode={authMode}
        form={authForm}
        loading={authLoading}
        error={authError}
        onModeChange={setAuthMode}
        onFormChange={setAuthForm}
        onSubmit={handleAuthSubmit}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.15),_transparent_28%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_38%,#f8fafc_100%)] text-slate-900">
      <div className="mx-auto grid min-h-screen w-[1440px] max-w-full grid-cols-[320px_1fr] gap-8 px-8 py-8">
        <ClusterSidebar
          clusters={clusters}
          selectedClusterId={selectedClusterId}
          onSelect={setSelectedClusterId}
          onOpenCreate={() => setIsClusterModalOpen(true)}
          onDelete={handleDeleteCluster}
          loading={clustersLoading}
          deletingClusterId={deletingClusterId}
          error={clusterError}
          onLogout={handleLogout}
        />

        <main className="flex flex-col gap-8">
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Selected Cluster
                </p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
                  Kafka Cluster Control Room
                </h1>
                <p className="mt-3 max-w-3xl text-sm text-slate-600">
                  {selectedCluster
                    ? `${selectedCluster.name} • ${selectedCluster.bootstrapServers}`
                    : 'Sağ paneli doldurmak için soldan bir cluster seçin veya yeni cluster ekleyin.'}
                </p>
              </div>
              {health ? (
                <span
                  className={`inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold ring-1 ${
                    health.status === 'HEALTHY'
                      ? 'bg-emerald-100 text-emerald-700 ring-emerald-200'
                      : health.status === 'DEGRADED'
                        ? 'bg-amber-100 text-amber-700 ring-amber-200'
                        : 'bg-rose-100 text-rose-700 ring-rose-200'
                  }`}
                >
                  {health.status}
                </span>
              ) : null}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="rounded-2xl bg-slate-950 px-5 py-4 text-white">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                  Cluster ID
                </p>
                <p className="mt-3 truncate text-sm font-medium">
                  {health?.clusterId ?? selectedCluster?.id ?? 'Cluster seçilmedi'}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                  Node Count
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">
                  {healthLoading ? '...' : health?.nodeCount ?? '-'}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                  Topic Count
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">
                  {healthLoading ? '...' : health?.topicCount ?? '-'}
                </p>
              </div>
            </div>

            {healthError ? (
              <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {healthError}
              </p>
            ) : null}
          </section>

          <div className="grid grid-cols-[1.25fr_0.95fr] gap-8">
            <TopicSection
              topics={topics}
              loading={topicsLoading}
              error={topicsError}
              deletingTopic={deletingTopic}
              onOpenCreate={() => setIsTopicModalOpen(true)}
              onDelete={handleDeleteTopic}
              disabled={!selectedClusterId}
            />

            <MessageViewer
              topics={topics}
              selectedTopic={selectedTopic}
              onTopicChange={setSelectedTopic}
              limit={messageLimit}
              onLimitChange={setMessageLimit}
              onFetch={handleFetchMessages}
              loading={messagesLoading}
              error={messagesError}
              messages={messages}
              disabled={!selectedClusterId}
            />
          </div>

          <ConsumerGroupsSection
            groups={consumerGroups}
            expandedGroupId={expandedGroupId}
            onToggle={handleToggleGroup}
            loading={groupsLoading}
            error={groupsError}
          />
        </main>
      </div>

      <TopicModal
        open={isTopicModalOpen}
        form={topicForm}
        onChange={handleTopicFormChange}
        onClose={() => {
          setIsTopicModalOpen(false)
          setCreateTopicError('')
          setTopicForm(INITIAL_TOPIC_FORM)
        }}
        onSubmit={handleCreateTopic}
        loading={createTopicLoading}
        error={createTopicError}
      />

      <ClusterModal
        open={isClusterModalOpen}
        form={clusterForm}
        onChange={handleClusterFormChange}
        onClose={() => {
          setIsClusterModalOpen(false)
          setCreateClusterError('')
          setClusterForm(INITIAL_CLUSTER_FORM)
        }}
        onSubmit={handleCreateCluster}
        loading={clusterActionLoading}
        error={createClusterError}
      />
    </div>
  )
}

export default App
