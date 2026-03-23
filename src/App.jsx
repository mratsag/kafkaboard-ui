import { useCallback, useEffect, useRef, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { AuthScreen } from './components/AuthScreen'
import { ClusterModal } from './components/ClusterModal'
import { PrivateRoute } from './components/PrivateRoute'
import { TopicModal } from './components/TopicModal'
import { useConsumerGroupLag } from './hooks/useConsumerGroupLag'
import { AuthLayout } from './layouts/AuthLayout'
import { DashboardLayout } from './layouts/DashboardLayout'
import { ConsumerGroupsPage } from './pages/ConsumerGroupsPage'
import { DashboardPage } from './pages/DashboardPage'
import { LandingPage } from './pages/LandingPage'
import { MessagesPage } from './pages/MessagesPage'
import { ProfilePage } from './pages/ProfilePage'
import { TopicsPage } from './pages/TopicsPage'
import {
  clearToken,
  createCluster,
  createTopic,
  deleteCluster,
  deleteProfile,
  deleteTopic,
  fetchClusterHealth,
  fetchClusters,
  fetchConsumerGroups,
  fetchProfile,
  fetchTopicMessages,
  fetchTopics,
  getEmail,
  getToken,
  login,
  logout,
  register,
  setTokenUpdateHandler,
  setUnauthorizedHandler,
  storeAuthSession,
  testConnection,
  updateDisplayName,
  updateProfileEmail,
  updateProfilePassword,
} from './lib/api'

const THEME_STORAGE_KEY = 'kafkaboard_theme'
const SELECTED_CLUSTER_STORAGE_KEY = 'kafkaboard_selected_cluster'
const INITIAL_TOPIC_FORM = {
  topicName: '',
  partitions: '1',
  replicationFactor: '1',
}
const INITIAL_CLUSTER_FORM = {
  name: '',
  bootstrapServers: 'localhost:9092',
  securityProtocol: 'PLAINTEXT',
  saslMechanism: 'PLAIN',
  saslUsername: '',
  saslPassword: '',
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
  const navigate = useNavigate()
  const location = useLocation()

  const [token, setToken] = useState(() => getToken())
  const [userEmail, setUserEmail] = useState(() => getEmail())
  const [theme, setTheme] = useState(getInitialTheme)

  const [clusters, setClusters] = useState([])
  const [selectedClusterId, setSelectedClusterId] = useState(
    () => localStorage.getItem(SELECTED_CLUSTER_STORAGE_KEY) ?? null,
  )
  const [health, setHealth] = useState(null)
  const [topics, setTopics] = useState([])
  const [consumerGroups, setConsumerGroups] = useState([])
  const [messages, setMessages] = useState([])
  const [profile, setProfile] = useState(null)

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
  const [profileError, setProfileError] = useState('')
  const [testConnectionResult, setTestConnectionResult] = useState(null)

  const [authLoading, setAuthLoading] = useState(false)
  const [clustersLoading, setClustersLoading] = useState(false)
  const [clusterActionLoading, setClusterActionLoading] = useState(false)
  const [testConnectionLoading, setTestConnectionLoading] = useState(false)
  const [healthLoading, setHealthLoading] = useState(false)
  const [topicsLoading, setTopicsLoading] = useState(false)
  const [groupsLoading, setGroupsLoading] = useState(false)
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [createTopicLoading, setCreateTopicLoading] = useState(false)
  const [deletingTopic, setDeletingTopic] = useState('')
  const [deletingClusterId, setDeletingClusterId] = useState('')

  const [confirmingClusterId, setConfirmingClusterId] = useState(null)
  const [confirmingTopicName, setConfirmingTopicName] = useState(null)

  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false)
  const [isClusterModalOpen, setIsClusterModalOpen] = useState(false)
  const [topicForm, setTopicForm] = useState(INITIAL_TOPIC_FORM)
  const [clusterForm, setClusterForm] = useState(INITIAL_CLUSTER_FORM)
  const lagStream = useConsumerGroupLag(selectedClusterId, token)

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
    localStorage.removeItem(SELECTED_CLUSTER_STORAGE_KEY)
    setToken(null)
    setUserEmail('')
    setClusters([])
    setSelectedClusterId(null)
    setProfile(null)
    resetDashboardData()
    setClusterError('')
    setAuthError('')
    setProfileError('')
    setAuthMode('login')
    setAuthForm(INITIAL_AUTH_FORM)
    setConfirmingClusterId(null)
    navigate('/login', { replace: true })
  }, [navigate, resetDashboardData])

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

  const loadProfileData = useCallback(async () => {
    safeSetState(() => {
      setProfileLoading(true)
      setProfileError('')
    })

    try {
      const profileResponse = await fetchProfile()
      safeSetState(() => {
        setProfile(profileResponse)
      })
    } catch (error) {
      safeSetState(() => {
        setProfileError(error instanceof Error ? error.message : 'Unknown error')
      })
    } finally {
      safeSetState(() => {
        setProfileLoading(false)
      })
    }
  }, [])

  const loadConsumerGroupsOnly = useCallback(async (clusterId) => {
    safeSetState(() => {
      setGroupsLoading(true)
      setGroupsError('')
    })

    try {
      const groupsData = await fetchConsumerGroups(clusterId)
      safeSetState(() => {
        setConsumerGroups(groupsData)
      })
    } catch (error) {
      safeSetState(() => {
        setGroupsError(error instanceof Error ? error.message : 'Unknown error')
      })
    } finally {
      safeSetState(() => {
        setGroupsLoading(false)
      })
    }
  }, [])

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
    if (selectedClusterId) {
      localStorage.setItem(SELECTED_CLUSTER_STORAGE_KEY, selectedClusterId)
    } else {
      localStorage.removeItem(SELECTED_CLUSTER_STORAGE_KEY)
    }
  }, [selectedClusterId])

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
    setTokenUpdateHandler((nextToken) => {
      setToken(nextToken)
    })

    return () => {
      setTokenUpdateHandler(null)
    }
  }, [])

  useEffect(() => {
    if (!token) {
      return
    }

    loadClusters()
    loadProfileData()
  }, [loadClusters, loadProfileData, token])

  useEffect(() => {
    if (!token || !selectedClusterId) {
      return
    }

    loadClusterDashboard(selectedClusterId)
  }, [loadClusterDashboard, selectedClusterId, token])

  useEffect(() => {
    if (lagStream.groups === null) {
      return
    }

    setConsumerGroups(lagStream.groups)
    setGroupsLoading(false)
  }, [lagStream.groups])

  useEffect(() => {
    if (lagStream.error) {
      setGroupsError(lagStream.error)
      if (!lagStream.connected) {
        setGroupsLoading(false)
      }
      return
    }

    if (lagStream.connected) {
      setGroupsError('')
    }
  }, [lagStream.connected, lagStream.error])

  useEffect(() => {
    if (token && location.pathname === '/login') {
      navigate('/dashboard', { replace: true })
    }
  }, [location.pathname, navigate, token])

  useEffect(() => {
    if (location.pathname === '/register' && authMode !== 'register') {
      setAuthMode('register')
      return
    }

    if (location.pathname === '/login' && authMode !== 'login') {
      setAuthMode('login')
    }
  }, [authMode, location.pathname])

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

      storeAuthSession({
        token: response.token,
        refreshToken: response.refreshToken,
        email: payload.email,
      })

      safeSetState(() => {
        setToken(response.token)
        setUserEmail(payload.email)
        setAuthForm(INITIAL_AUTH_FORM)
      })

      navigate('/dashboard', { replace: true })
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

  async function handleLogout() {
    try {
      await logout()
    } catch {
      // ignore revoke failure
    } finally {
      resetToLoginState()
    }
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

  async function handleTestClusterConnection() {
    if (!clusterForm.bootstrapServers.trim()) {
      setCreateClusterError('Bootstrap server adresi boş olamaz')
      return
    }

    setCreateClusterError('')
    setTestConnectionLoading(true)

    try {
      const result = await testConnection({
        bootstrapServers: clusterForm.bootstrapServers.trim(),
        securityProtocol: clusterForm.securityProtocol,
        saslMechanism: clusterForm.saslMechanism || undefined,
        saslUsername: clusterForm.saslUsername || undefined,
        saslPassword: clusterForm.saslPassword || undefined,
      })
      safeSetState(() => {
        setTestConnectionResult(result)
      })
    } catch (error) {
      safeSetState(() => {
        setTestConnectionResult({
          status: 'UNHEALTHY',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      })
    } finally {
      safeSetState(() => {
        setTestConnectionLoading(false)
      })
    }
  }

  async function handleCreateCluster() {
    setClusterActionLoading(true)
    setCreateClusterError('')

    try {
      const nextCluster = await createCluster({
        name: clusterForm.name.trim(),
        bootstrapServers: clusterForm.bootstrapServers.trim(),
        securityProtocol: clusterForm.securityProtocol,
        saslMechanism: clusterForm.saslMechanism || undefined,
        saslUsername: clusterForm.saslUsername || undefined,
        saslPassword: clusterForm.saslPassword || undefined,
      })

      safeSetState(() => {
        setIsClusterModalOpen(false)
        setClusterForm(INITIAL_CLUSTER_FORM)
        setTestConnectionResult(null)
      })

      await loadClusters(nextCluster.id)
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
    } catch (error) {
      setCreateTopicError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      safeSetState(() => {
        setCreateTopicLoading(false)
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
  }

  async function handleUpdateDisplayName(nextDisplayName) {
    const updatedProfile = await updateDisplayName({ displayName: nextDisplayName })
    safeSetState(() => {
      setProfile(updatedProfile)
    })
    return updatedProfile
  }

  async function handleUpdateEmail({ newEmail, password }) {
    const normalizedEmail = newEmail.trim().toLowerCase()
    const response = await updateProfileEmail({ newEmail: normalizedEmail, password })

    storeAuthSession({
      token: response.token,
      refreshToken: response.refreshToken,
      email: normalizedEmail,
    })

    safeSetState(() => {
      setToken(response.token)
      setUserEmail(normalizedEmail)
    })

    await loadProfileData()
  }

  async function handleUpdatePassword(payload) {
    await updateProfilePassword(payload)
  }

  async function handleDeleteAccount(password) {
    await deleteProfile({ password })
    resetToLoginState()
  }

  const selectedCluster =
    clusters.find((cluster) => cluster.id === selectedClusterId) ?? null

  return (
    <>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<LandingPage token={token} />} />
          <Route
            path="/login"
            element={
              token ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <AuthScreen
                  mode={authMode}
                  form={authForm}
                  loading={authLoading}
                  error={authError}
                  onModeChange={(nextMode) => navigate(nextMode === 'login' ? '/login' : '/register')}
                  onFormChange={setAuthForm}
                  onSubmit={handleAuthSubmit}
                />
              )
            }
          />
          <Route
            path="/register"
            element={
              token ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <AuthScreen
                  mode="register"
                  form={authForm}
                  loading={authLoading}
                  error={authError}
                  onModeChange={(nextMode) => navigate(nextMode === 'login' ? '/login' : '/register')}
                  onFormChange={setAuthForm}
                  onSubmit={handleAuthSubmit}
                />
              )
            }
          />
        </Route>

        <Route element={<PrivateRoute token={token} />}>
          <Route
            element={
              <DashboardLayout
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
                userEmail={userEmail}
                theme={theme}
                onToggleTheme={handleToggleTheme}
              />
            }
          >
            <Route
              path="/dashboard"
              element={
                <DashboardPage
                  selectedCluster={selectedCluster}
                  health={health}
                  healthLoading={healthLoading}
                  healthError={healthError}
                />
              }
            />
            <Route
              path="/topics"
              element={
                <TopicsPage
                  selectedCluster={selectedCluster}
                  topics={topics}
                  loading={topicsLoading}
                  error={topicsError}
                  deletingTopic={deletingTopic}
                  confirmingTopicName={confirmingTopicName}
                  onOpenCreate={() => setIsTopicModalOpen(true)}
                  onRequestDelete={handleRequestDeleteTopic}
                  onCancelDelete={handleCancelDeleteTopic}
                  onConfirmDelete={handleConfirmDeleteTopic}
                />
              }
            />
            <Route
              path="/messages"
              element={
                <MessagesPage
                  selectedCluster={selectedCluster}
                  topics={topics}
                  selectedTopic={selectedTopic}
                  onTopicChange={setSelectedTopic}
                  limit={messageLimit}
                  onLimitChange={setMessageLimit}
                  onFetch={handleFetchMessages}
                  loading={messagesLoading}
                  error={messagesError}
                  messages={messages}
                />
              }
            />
            <Route
              path="/consumer-groups"
              element={
                <ConsumerGroupsPage
                  selectedCluster={selectedCluster}
                  groups={consumerGroups}
                  expandedGroupId={expandedGroupId}
                  onToggle={handleToggleGroup}
                  onRefresh={() => {
                    if (selectedClusterId) {
                      loadConsumerGroupsOnly(selectedClusterId)
                    }
                  }}
                  loading={groupsLoading || (lagStream.loading && consumerGroups.length === 0)}
                  error={groupsError}
                  connected={lagStream.connected}
                />
              }
            />
            <Route
              path="/profile"
              element={
                <ProfilePage
                  profile={profile}
                  loading={profileLoading}
                  error={profileError}
                  onRefresh={loadProfileData}
                  onUpdateDisplayName={handleUpdateDisplayName}
                  onUpdateEmail={handleUpdateEmail}
                  onUpdatePassword={handleUpdatePassword}
                  onDeleteAccount={handleDeleteAccount}
                />
              }
            />
          </Route>
        </Route>

        <Route
          path="*"
          element={<Navigate to={token ? '/dashboard' : '/'} replace />}
        />
      </Routes>

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
          setTestConnectionResult(null)
        }}
        onTestConnection={handleTestClusterConnection}
        onSubmit={handleCreateCluster}
        loading={clusterActionLoading}
        testLoading={testConnectionLoading}
        testResult={testConnectionResult}
        error={createClusterError}
      />
    </>
  )
}

export default App
