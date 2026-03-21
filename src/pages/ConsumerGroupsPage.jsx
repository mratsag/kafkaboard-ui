import { ClusterEmptyState } from '../components/ClusterEmptyState'
import { ConsumerGroupsSection } from '../components/ConsumerGroupsSection'

export function ConsumerGroupsPage({ selectedCluster, ...props }) {
  if (!selectedCluster) {
    return (
      <ClusterEmptyState
        icon="👥"
        title="Consumer group izleme hazır"
        description="Lag görünümü ve zaman serisi grafiği için önce bir cluster seçin."
      />
    )
  }

  return <ConsumerGroupsSection {...props} />
}
