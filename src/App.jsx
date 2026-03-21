import { useCallback, useEffect, useRef, useState } from 'react'
import { AuthScreen } from './components/AuthScreen'
import { ClusterModal } from './components/ClusterModal'
import { ClusterSidebar } from './components/ClusterSidebar'
import { ConsumerGroupsSection } from './components/ConsumerGroupsSection'
import { Footer } from './components/Footer'
import { MessageViewer } from './components/MessageViewer'
import { Skeleton } from './components/Skeleton'
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

const THEME_STORAGE_KEY = 'kafkaboard_theme'
const INITIAL_TOPIC_FORM = {
  topicName: '',
  partitions: '1',
  replicationFactor: '1',
}
const INITIAL_CLUSTER_FORM = {
  name: '',
  bootstrapServers: 'localhost:9092',
}
const INITIAL_AUTH_FORM = {
  email: '',
  password: '',
  confirmPassword: '',
}

function getInitialTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function App() {
  const isMountedRef = useRef(true)

  const [view, setView] = useState(getToken() ? 'dashboard' : 'login')
  const [token, setToken] = useState(() => getToken())
  const [theme, setTheme] = useState(getInitialTheme)

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
  const [authForm, setAuthForm] = useState(INITIAL_AUTH_FORM)

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

  const [confirmingClusterId, setConfirmingClusterId] = useState(null)
  const [confirmingTopicName, setConfirmingTopicName] = useState(null)

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
    setConfirmingTopicName(null)
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
    setAuthForm(INITIAL_AUTH_FORM)
    setConfirmingClusterId(null)
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
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

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
    if (authMode === 'register' && authForm.password !== authForm.confirmPassword) {
      setAuthError('Şifreler eşleşmiyor')
      return
    }

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
        setAuthForm(INITIAL_AUTH_FORM)
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

  function handleToggleTheme() {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
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

  function handleRequestDeleteCluster(clusterId) {
    setConfirmingClusterId(clusterId)
  }

  function handleCancelDeleteCluster() {
    setConfirmingClusterId(null)
  }

  async function handleConfirmDeleteCluster(clusterId) {
    const nextRemainingClusters = clusters.filter((item) => item.id !== clusterId)

    setDeletingClusterId(clusterId)
    setClusterError('')

    try {
      await deleteCluster(clusterId)

      safeSetState(() => {
        setClusters(nextRemainingClusters)
        setConfirmingClusterId(null)
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

  function handleRequestDeleteTopic(topicName) {
    setConfirmingTopicName(topicName)
  }

  function handleCancelDeleteTopic() {
    setConfirmingTopicName(null)
  }

  async function handleConfirmDeleteTopic(topicName) {
    if (!selectedClusterId) {
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
      setConfirmingTopicName(null)
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
      <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
        <main className="flex flex-1">
          <AuthScreen
            mode={authMode}
            form={authForm}
            loading={authLoading}
            error={authError}
            onModeChange={setAuthMode}
            onFormChange={setAuthForm}
            onSubmit={handleAuthSubmit}
          />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <main className="min-h-0 flex-1">
        <div className="mx-auto flex h-full min-h-0 max-w-[1600px] gap-6 px-6 py-6">
          <ClusterSidebar
            clusters={clusters}
            selectedClusterId={selectedClusterId}
            confirmingClusterId={confirmingClusterId}
            onSelect={setSelectedClusterId}
            onOpenCreate={() => setIsClusterModalOpen(true)}
            onRequestDelete={handleRequestDeleteCluster}
            onCancelDelete={handleCancelDeleteCluster}
            onConfirmDelete={handleConfirmDeleteCluster}
            loading={clustersLoading}
            deletingClusterId={deletingClusterId}
            error={clusterError}
            onLogout={handleLogout}
            theme={theme}
            onToggleTheme={handleToggleTheme}
          />

          <section className="min-h-0 flex-1 overflow-y-auto pr-2">
          {!selectedCluster ? (
            <section className="flex min-h-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div>
                <div className="text-6xl">🛰️</div>
                <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                  Cluster seçilmedi
                </h1>
                <p className="mt-4 max-w-xl text-sm text-slate-600 dark:text-slate-400">
                  Soldan kayıtlı bir cluster seçin veya yeni cluster ekleyin. Health,
                  topics, consumer groups ve messages paneli seçimden sonra açılır.
                </p>
              </div>
            </section>
          ) : (
            <div className="flex flex-col gap-6">
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center justify-between gap-6">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Cluster Overview
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                      {selectedCluster.name}
                    </h1>
                    <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-400">
                      {selectedCluster.bootstrapServers}
                    </p>
                  </div>
                  {healthLoading ? (
                    <Skeleton variant="badge" />
                  ) : health ? (
                    <span
                      className={`inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold ring-1 ${
                        health.status === 'HEALTHY'
                          ? 'bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30'
                          : health.status === 'DEGRADED'
                            ? 'bg-amber-100 text-amber-700 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30'
                            : 'bg-rose-100 text-rose-700 ring-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-500/30'
                      }`}
                    >
                      {health.status}
                    </span>
                  ) : null}
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4">
                  {healthLoading ? (
                    <>
                      <Skeleton variant="card" />
                      <Skeleton variant="card" />
                      <Skeleton variant="card" />
                    </>
                  ) : (
                    <>
                      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Cluster ID
                        </p>
                        <p className="mt-2 truncate text-sm text-slate-900 dark:text-slate-100">
                          {health?.clusterId ?? selectedCluster.id}
                        </p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Node Count
                        </p>
                        <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                          {health?.nodeCount ?? '-'}
                        </p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Topic Count
                        </p>
                        <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                          {health?.topicCount ?? '-'}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {healthError ? (
                  <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
                    <p className="font-semibold">Health hatası</p>
                    <p className="mt-1">{healthError}</p>
                  </div>
                ) : null}
              </section>

              <div className="grid grid-cols-[1.25fr_0.95fr] gap-6">
                <TopicSection
                  topics={topics}
                  loading={topicsLoading}
                  error={topicsError}
                  deletingTopic={deletingTopic}
                  confirmingTopicName={confirmingTopicName}
                  onOpenCreate={() => setIsTopicModalOpen(true)}
                  onRequestDelete={handleRequestDeleteTopic}
                  onCancelDelete={handleCancelDeleteTopic}
                  onConfirmDelete={handleConfirmDeleteTopic}
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
            </div>
          )}
          </section>
        </div>
      </main>

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
      <Footer />
    </div>
  )
}

export default App
