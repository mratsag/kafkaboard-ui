import { ClusterEmptyState } from '../components/ClusterEmptyState'
import { TopicSection } from '../components/TopicSection'

export function TopicsPage({ selectedCluster, ...props }) {
  if (!selectedCluster) {
    return (
      <ClusterEmptyState
        icon="🪹"
        title="Topic görünümü hazır"
        description="Topic listesini görmek ve yeni topic oluşturmak için önce bir cluster seçin."
      />
    )
  }

  return <TopicSection {...props} disabled={false} />
}
