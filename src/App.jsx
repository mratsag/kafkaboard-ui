import { useEffect, useRef, useState } from 'react'
import { ConnectionPanel } from './components/ConnectionPanel'
import { ConsumerGroupsSection } from './components/ConsumerGroupsSection'
import { MessageViewer } from './components/MessageViewer'
import { TopicModal } from './components/TopicModal'
import { TopicSection } from './components/TopicSection'
import {
  createTopic,
  deleteTopic,
  fetchClusterHealth,
  fetchConsumerGroups,
  fetchTopicMessages,
  fetchTopics,
} from './lib/api'

const DEFAULT_BOOTSTRAP_SERVERS = 'localhost:9092'
const INITIAL_TOPIC_FORM = {
  topicName: '',
  partitions: '1',
  replicationFactor: '1',
}

function App() {
  const isMountedRef = useRef(true)

  const [bootstrapServers, setBootstrapServers] = useState(
    DEFAULT_BOOTSTRAP_SERVERS,
  )
  const [health, setHealth] = useState(null)
  const [topics, setTopics] = useState([])
  const [consumerGroups, setConsumerGroups] = useState([])
  const [messages, setMessages] = useState([])

  const [selectedTopic, setSelectedTopic] = useState('')
  const [messageLimit, setMessageLimit] = useState('10')
  const [expandedGroupId, setExpandedGroupId] = useState(null)

  const [healthError, setHealthError] = useState('')
  const [topicsError, setTopicsError] = useState('')
  const [groupsError, setGroupsError] = useState('')
  const [messagesError, setMessagesError] = useState('')
  const [createError, setCreateError] = useState('')

  const [connectionLoading, setConnectionLoading] = useState(false)
  const [topicsLoading, setTopicsLoading] = useState(false)
  const [groupsLoading, setGroupsLoading] = useState(false)
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [deletingTopic, setDeletingTopic] = useState('')

  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false)
  const [topicForm, setTopicForm] = useState(INITIAL_TOPIC_FORM)

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  function safeSetState(updater) {
    if (isMountedRef.current) {
      updater()
    }
  }

  async function loadDashboard(nextBootstrapServers) {
    safeSetState(() => {
      setConnectionLoading(true)
      setTopicsLoading(false)
      setGroupsLoading(false)
      setHealthError('')
      setTopicsError('')
      setGroupsError('')
    })

    try {
      const healthData = await fetchClusterHealth(nextBootstrapServers)

      safeSetState(() => {
        setHealth(healthData)
      })

      if (healthData.status === 'UNHEALTHY') {
        safeSetState(() => {
          setTopics([])
          setConsumerGroups([])
          setMessages([])
          setSelectedTopic('')
        })

        console.log('Scenario 2 - unhealthy cluster connection:', {
          bootstrapServers: nextBootstrapServers,
          status: healthData.status,
        })
        return
      }

      safeSetState(() => {
        setTopicsLoading(true)
        setGroupsLoading(true)
      })

      const [topicsData, groupsData] = await Promise.all([
        fetchTopics(nextBootstrapServers),
        fetchConsumerGroups(nextBootstrapServers),
      ])

      safeSetState(() => {
        setTopics(topicsData)
        setConsumerGroups(groupsData)
        setSelectedTopic((currentTopic) => {
          if (currentTopic && topicsData.some((topic) => topic.name === currentTopic)) {
            return currentTopic
          }
          return topicsData[0]?.name ?? ''
        })
      })

      console.log('Scenario 1 - healthy cluster connection:', {
        bootstrapServers: nextBootstrapServers,
        status: healthData.status,
        topicCount: topicsData.length,
        consumerGroupCount: groupsData.length,
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
        setConnectionLoading(false)
        setTopicsLoading(false)
        setGroupsLoading(false)
      })
    }
  }

  async function handleConnect() {
    const trimmedBootstrapServers = bootstrapServers.trim()

    if (!trimmedBootstrapServers) {
      safeSetState(() => {
        setHealthError('Bootstrap server adresi boş olamaz')
      })
      return
    }

    safeSetState(() => {
      setBootstrapServers(trimmedBootstrapServers)
      setMessages([])
      setMessagesError('')
    })

    await loadDashboard(trimmedBootstrapServers)
  }

  function handleTopicFormChange(event) {
    const { name, value } = event.target
    setTopicForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleCreateTopic() {
    setCreateError('')
    setCreateLoading(true)

    try {
      await createTopic({
        bootstrapServers,
        topicName: topicForm.topicName.trim(),
        partitions: Number(topicForm.partitions),
        replicationFactor: Number(topicForm.replicationFactor),
      })

      await loadTopicsOnly(bootstrapServers)
      setIsTopicModalOpen(false)
      setTopicForm(INITIAL_TOPIC_FORM)
      console.log('Scenario 3 - topic created:', topicForm.topicName.trim())
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      safeSetState(() => {
        setCreateLoading(false)
      })
    }
  }

  async function loadTopicsOnly(nextBootstrapServers) {
    setTopicsLoading(true)
    setTopicsError('')

    try {
      const topicsData = await fetchTopics(nextBootstrapServers)
      safeSetState(() => {
        setTopics(topicsData)
        setSelectedTopic((currentTopic) => {
          if (currentTopic && topicsData.some((topic) => topic.name === currentTopic)) {
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
    const confirmed = window.confirm(
      `${topicName} topic'ini silmek istediğinize emin misiniz?`,
    )

    if (!confirmed) {
      return
    }

    setDeletingTopic(topicName)
    setTopicsError('')

    try {
      await deleteTopic(bootstrapServers, topicName)
      await loadTopicsOnly(bootstrapServers)
      if (selectedTopic === topicName) {
        setMessages([])
      }
      console.log('Scenario 4 - topic deleted:', topicName)
    } catch (error) {
      setTopicsError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      safeSetState(() => {
        setDeletingTopic('')
      })
    }
  }

  async function handleFetchMessages() {
    if (!selectedTopic) {
      setMessagesError('Topic seçin')
      return
    }

    setMessagesLoading(true)
    setMessagesError('')

    try {
      const nextMessages = await fetchTopicMessages(
        bootstrapServers,
        selectedTopic,
        Number(messageLimit),
      )

      safeSetState(() => {
        setMessages(nextMessages)
      })

      console.log('Scenario 6 - messages loaded:', {
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
      console.log('Scenario 5 - consumer group toggled:', {
        groupId: nextGroup.groupId,
        totalLag: nextGroup.totalLag,
        partitions: nextGroup.partitionLags.length,
      })
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.15),_transparent_28%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_38%,#f8fafc_100%)] text-slate-900">
      <main className="mx-auto flex w-[1440px] max-w-full flex-col gap-8 px-10 py-10">
        <ConnectionPanel
          bootstrapServers={bootstrapServers}
          onBootstrapServersChange={setBootstrapServers}
          onConnect={handleConnect}
          loading={connectionLoading}
          error={healthError}
          health={health}
        />

        <div className="grid grid-cols-[1.25fr_0.95fr] gap-8">
          <TopicSection
            topics={topics}
            loading={topicsLoading}
            error={topicsError}
            deletingTopic={deletingTopic}
            onOpenCreate={() => setIsTopicModalOpen(true)}
            onDelete={handleDeleteTopic}
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

      <TopicModal
        open={isTopicModalOpen}
        form={topicForm}
        onChange={handleTopicFormChange}
        onClose={() => {
          setIsTopicModalOpen(false)
          setCreateError('')
          setTopicForm(INITIAL_TOPIC_FORM)
        }}
        onSubmit={handleCreateTopic}
        loading={createLoading}
        error={createError}
      />
    </div>
  )
}

export default App
